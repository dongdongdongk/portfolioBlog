#!/usr/bin/env node
/* eslint-disable */
/**
 * Notion Export → Blog MDX 변환 스크립트
 *
 * 실행 순서:
 *   1단계: node scripts/notion-to-blog.js upload   → 이미지 Cloudinary 업로드
 *   2단계: node scripts/notion-to-blog.js convert  → MD → MDX 변환
 *
 * .env 파일 필요:
 *   CLOUDINARY_CLOUD_NAME=...
 *   CLOUDINARY_API_KEY=...
 *   CLOUDINARY_API_SECRET=...
 */

const cloudinary = require('cloudinary').v2
const fs = require('fs')
const path = require('path')
const os = require('os')

// ── 설정 ──────────────────────────────────────────────────────
const NOTION_SRC = 'F:/개인 페이지 & 공유된 페이지/프로그래밍'
const BLOG_OUT = path.join(__dirname, '../data/blog')
const IMAGE_MAP_FILE = path.join(__dirname, 'image-map.json')
const CONCURRENCY = 5 // 동시 업로드 수

require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
// ──────────────────────────────────────────────────────────────

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'])

/** Notion UUID 접미사 제거 */
function removeUUID(name) {
  return name.replace(/\s+[0-9a-f]{32}$/i, '').trim()
}

/** 슬러그 생성 (ASCII만, URL-safe) */
function toSlug(name) {
  return (
    name
      .replace(/[^\x00-\x7F]/g, '') // 한글 등 비ASCII 제거
      .replace(/[^a-zA-Z0-9\s-]/g, '') // 특수문자(@, (, ) 등) 제거
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase()
      .replace(/^-|-$/g, '') // 앞뒤 - 제거
      .slice(0, 80) || 'post'
  ) // 빈 슬러그 방지
}

/** 파일에서 첫 번째 H1 추출 */
function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : null
}

/** 디렉터리에서 MD 파일 재귀 수집 */
function getMdFiles(dir) {
  const results = []
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return results
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...getMdFiles(fullPath))
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath)
    }
  }
  return results
}

/** 디렉터리에서 이미지 파일 재귀 수집 */
function getImageFiles(dir) {
  const results = []
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return results
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...getImageFiles(fullPath))
    } else if (IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath)
    }
  }
  return results
}

/** Cloudinary public_id 생성 (ASCII만 사용) */
function makePublicId(imagePath) {
  const rel = path.relative(NOTION_SRC, imagePath)
  return (
    'notion-blog/' +
    rel
      .replace(/\\/g, '/')
      .replace(/\.[^.]+$/, '') // 확장자 제거
      .replace(/[^\x00-\x7F]/g, '_') // 비ASCII(한글 등) → _
      .replace(/[^a-zA-Z0-9/_.-]/g, '_') // 특수문자 → _
      .replace(/_+/g, '_') // 연속 _ 정리
      .slice(0, 200)
  )
}

/** 이미지 하나 업로드 */
async function uploadOne(imagePath, imageMap) {
  if (imageMap[imagePath]) return // 이미 업로드됨

  const publicId = makePublicId(imagePath)
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      public_id: publicId,
      overwrite: false,
      resource_type: 'image',
    })
    imageMap[imagePath] = result.secure_url
    process.stdout.write('.')
  } catch (err) {
    console.error(`\n업로드 실패: ${imagePath} — ${err.message}`)
    imageMap[imagePath] = null
  }
}

/** 배열을 청크로 분할해 순차 처리 */
async function processInChunks(items, fn, size) {
  for (let i = 0; i < items.length; i += size) {
    await Promise.all(items.slice(i, i + size).map(fn))
  }
}

/** ── 1단계: 이미지 업로드 ──────────────────────────────────── */
async function phaseUpload() {
  console.log('이미지 파일 수집 중...')
  const images = getImageFiles(NOTION_SRC)
  console.log(`총 이미지: ${images.length}개`)

  // 기존 맵 로드
  let imageMap = {}
  if (fs.existsSync(IMAGE_MAP_FILE)) {
    imageMap = JSON.parse(fs.readFileSync(IMAGE_MAP_FILE, 'utf8'))
    const already = Object.keys(imageMap).length
    console.log(`이미 업로드된 이미지: ${already}개, 남은 이미지: ${images.length - already}개`)
  }

  const pending = images.filter((p) => !imageMap[p])
  console.log(`업로드 시작 (동시 ${CONCURRENCY}개)...`)

  await processInChunks(pending, (img) => uploadOne(img, imageMap), CONCURRENCY)

  fs.writeFileSync(IMAGE_MAP_FILE, JSON.stringify(imageMap, null, 2), 'utf8')
  console.log(`\n완료! image-map.json 저장됨`)
}

/** MD 내용에서 이미지 경로를 Cloudinary URL로 교체 */
function replaceImages(content, mdFilePath, imageMap) {
  // ![alt](path) 또는 ![alt](path "title") 패턴
  return content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, rawPath) => {
    // title 제거
    const pathPart = rawPath.replace(/\s+"[^"]*"$/, '').trim()
    // URL 디코딩
    let decoded
    try {
      decoded = decodeURIComponent(pathPart)
    } catch {
      decoded = pathPart
    }
    // 절대 경로로 변환
    const absPath = path.resolve(path.dirname(mdFilePath), decoded).replace(/\\/g, '/')
    const url = imageMap[absPath] || imageMap[absPath.replace(/\//g, '\\')]
    if (url) return `![${alt}](${url})`
    return match // URL 없으면 원본 유지
  })
}

/** 내부 노션 링크를 일반 텍스트로 변환 */
function stripNotionLinks(content) {
  // [text](some/path/file.md) → text
  return content.replace(/\[([^\]]+)\]\([^)]*\.md[^)]*\)/g, '$1')
}

/** 폴더 경로에서 category(경로형) / tags 추출 */
function extractCategoryInfo(mdFilePath) {
  const rel = path.relative(NOTION_SRC, mdFilePath)
  const parts = rel
    .split(path.sep)
    .slice(0, -1)
    .map((p) => removeUUID(p))
    .filter(Boolean)
  // category = '게임 개발/유니티' 형식 (buildCategoryTree가 /로 분리해 트리 생성)
  const category = parts.slice(0, 2).join('/')
  return {
    category,
    tags: parts.slice(0, 2).filter(Boolean),
  }
}

/** 파일 수정 시간에서 날짜 추출 */
function getFileDate(filePath) {
  try {
    const stat = fs.statSync(filePath)
    return stat.mtime.toISOString().slice(0, 10)
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

/** 슬러그 중복 방지 카운터 */
const usedSlugs = new Set()
function uniqueSlug(base) {
  let slug = base
  let i = 2
  while (usedSlugs.has(slug)) {
    slug = `${base}-${i++}`
  }
  usedSlugs.add(slug)
  return slug
}

/** ── 2단계: MD → MDX 변환 ─────────────────────────────────── */
async function phaseConvert() {
  if (!fs.existsSync(IMAGE_MAP_FILE)) {
    console.error('image-map.json 없음. 먼저 upload 단계를 실행하세요.')
    process.exit(1)
  }

  const imageMap = JSON.parse(fs.readFileSync(IMAGE_MAP_FILE, 'utf8'))
  const mdFiles = getMdFiles(NOTION_SRC)
  console.log(`MD 파일 ${mdFiles.length}개 변환 시작...`)

  if (!fs.existsSync(BLOG_OUT)) fs.mkdirSync(BLOG_OUT, { recursive: true })

  let converted = 0
  let skipped = 0

  for (const mdFile of mdFiles) {
    let content = fs.readFileSync(mdFile, 'utf8')

    // 내용이 거의 없거나 링크만 있는 인덱스 파일 건너뛰기
    const lines = content.split('\n').filter((l) => l.trim())
    const linkOnlyLines = lines.filter((l) => /^\[.+\]\(.+\.md\)/.test(l.trim()))
    if (lines.length > 0 && linkOnlyLines.length / lines.length > 0.7) {
      skipped++
      continue
    }

    // 제목 추출
    const fileBaseName = removeUUID(path.basename(mdFile, '.md'))
    const title = extractTitle(content) || fileBaseName

    // 카테고리 정보
    const { category, subcategory, tags } = extractCategoryInfo(mdFile)

    // 날짜
    const date = getFileDate(mdFile)

    // 슬러그
    const slug = uniqueSlug(toSlug(fileBaseName))

    // 이미지 교체
    content = replaceImages(content, mdFile, imageMap)

    // 내부 링크 제거
    content = stripNotionLinks(content)

    // H1 제거 (frontmatter title 중복 방지)
    content = content.replace(/^#\s+.+\n?/, '')

    // frontmatter 생성
    const tagsYaml = tags.map((t) => `'${t.replace(/'/g, "''")}'`).join(', ')
    const titleYaml = title.replace(/'/g, "''")
    const categoryYaml = category.replace(/'/g, "''")
    const frontmatter = `---
title: '${titleYaml}'
date: '${date}'
category: '${categoryYaml}'
tags: [${tagsYaml}]
draft: false
summary: ''
---

`

    const mdxContent = frontmatter + content.trim() + '\n'
    const outFile = path.join(BLOG_OUT, slug + '.mdx')
    fs.writeFileSync(outFile, mdxContent, 'utf8')
    converted++

    if (converted % 50 === 0) console.log(`  ${converted}개 변환됨...`)
  }

  console.log(`\n완료! 변환: ${converted}개, 스킵(인덱스): ${skipped}개`)
  console.log(`출력 위치: ${BLOG_OUT}`)
}

// ── 진입점 ────────────────────────────────────────────────────
const phase = process.argv[2]
if (phase === 'upload') {
  phaseUpload().catch(console.error)
} else if (phase === 'convert') {
  phaseConvert().catch(console.error)
} else {
  console.log(`사용법:
  node scripts/notion-to-blog.js upload   # 이미지 Cloudinary 업로드
  node scripts/notion-to-blog.js convert  # MD → MDX 변환
`)
}
