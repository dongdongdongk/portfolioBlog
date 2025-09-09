/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// 변환할 폴더 경로 (명령줄 인수로 받거나 기본값 사용)
const folderPath = process.argv[2] || './public/images/blog/game/3dUnity'
const quality = parseInt(process.argv[3]) || 70 // WebP 품질 (1-100)

console.log(`📁 변환 대상 폴더: ${path.resolve(folderPath)}`)
console.log(`🎨 WebP 품질 설정: ${quality}`)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

// 폴더가 존재하는지 확인
if (!fs.existsSync(folderPath)) {
  console.error(`❌ 오류: 폴더 '${folderPath}'를 찾을 수 없습니다.`)
  process.exit(1)
}

// PNG 파일 찾기 및 변환
async function convertPngToWebp() {
  try {
    const files = fs.readdirSync(folderPath)
    const pngFiles = files.filter((file) => path.extname(file).toLowerCase() === '.png')

    if (pngFiles.length === 0) {
      console.log('📄 변환할 PNG 파일이 없습니다.')
      return
    }

    console.log(`🔍 발견된 PNG 파일: ${pngFiles.length}개`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    let successCount = 0
    let totalOriginalSize = 0
    let totalCompressedSize = 0

    for (const file of pngFiles) {
      try {
        const inputPath = path.join(folderPath, file)
        const fileName = path.parse(file).name
        const outputPath = path.join(folderPath, `${fileName}.webp`)

        // 원본 파일 크기
        const originalSize = fs.statSync(inputPath).size

        // PNG를 WebP로 변환
        await sharp(inputPath)
          .webp({
            quality: quality,
            effort: 6, // 압축 노력도 (0-6, 높을수록 더 좋은 압축)
          })
          .toFile(outputPath)

        // 변환된 파일 크기
        const compressedSize = fs.statSync(outputPath).size
        const compressionRatio = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)

        console.log(`✅ ${file} → ${fileName}.webp`)
        console.log(
          `   📊 ${formatBytes(originalSize)} → ${formatBytes(compressedSize)} (${compressionRatio}% 감소)`
        )

        totalOriginalSize += originalSize
        totalCompressedSize += compressedSize
        successCount++

        // 원본 PNG 파일 삭제할지 물어보기 (선택사항)
        fs.unlinkSync(inputPath) // 이 줄의 주석을 제거하면 원본 파일이 삭제됩니다
      } catch (error) {
        console.error(`❌ ${file} 변환 실패:`, error.message)
      }
    }

    // 요약 정보
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`🎉 변환 완료!`)
    console.log(`📈 성공: ${successCount}/${pngFiles.length}개 파일`)
    console.log(
      `💾 전체 용량: ${formatBytes(totalOriginalSize)} → ${formatBytes(totalCompressedSize)}`
    )
    const totalSavings = (
      ((totalOriginalSize - totalCompressedSize) / totalOriginalSize) *
      100
    ).toFixed(1)
    console.log(
      `🗜️  총 절약: ${formatBytes(totalOriginalSize - totalCompressedSize)} (${totalSavings}%)`
    )
  } catch (error) {
    console.error('❌ 변환 중 오류 발생:', error.message)
  }
}

// 바이트를 읽기 쉬운 형태로 변환
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// 스크립트 실행
convertPngToWebp()
