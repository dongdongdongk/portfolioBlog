# portfolioBlog 개발 문서

## 프로젝트 개요

- **기술스택**: Next.js 15.2.9, Tailwind CSS v4, TypeScript
- **배포**: Vercel
  - `https://portfolio-blog-dongdongdongks-projects.vercel.app`
  - `https://dongk.vercel.app`
- **저장소**: GitHub `dongdongdongk/portfolioBlog`, main 브랜치
- **콘텐츠**: 파일 기반 MDX (`data/blog/`, `data/projects/`), DB 없음
- **이미지 호스팅**: Cloudinary (cloud_name: `du1acdhxq`), 환경변수는 `.env.local`

---

## 디자인 컨셉

- 화이트/미니멀, 블랙-화이트만 사용, 다크모드 없음
- 최대 너비: `max-w-5xl` (블로그 상세는 사이드바 때문에 `max-w-7xl`)
- 헤더: sticky, 흰 배경, 로고 마크 없음, Home 탭 포함
- 푸터: 블랙 배경 (`bg-black`)

### 공통 레이아웃 패턴

```tsx
// 헤더 영역
<div className="border-b border-gray-100 py-10">
  <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
    <h1 className="text-3xl font-bold text-slate-900">페이지명</h1>
  </div>
</div>

// 콘텐츠 영역
<div className="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-12">
  ...
</div>
```

### 버튼 스타일

```tsx
// 채워진 버튼
className =
  'flex h-10 items-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-700'

// 아웃라인 버튼
className =
  'flex h-10 items-center rounded-full border-2 border-slate-900 px-5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white'
```

---

## 주요 파일 구조

```
app/
  Main.tsx              # 메인 랜딩 (client component)
  about/page.tsx        # About 페이지
  portfolio/page.tsx    # Portfolio (Vimeo+YouTube 영상, 아코디언)
  blog/[...slug]/page.tsx  # 블로그 상세
  not-found.tsx         # 404 페이지
  contact/page.tsx      # Contact 페이지

components/
  Header.tsx            # 헤더 (sticky, Home 탭 포함)
  Footer.tsx            # 푸터 (블랙 배경)
  CategoryTree.tsx      # 블로그 카테고리 트리 사이드바
  Tag.tsx               # 태그 버튼

layouts/
  ListLayoutWithTags.tsx  # 블로그 목록 (카테고리 트리 사이드바 포함)
  PostLayout.tsx          # 블로그 상세 (카테고리 트리 사이드바 포함)

lib/
  categoryTree.ts       # buildCategoryTree() 유틸
  mdx.ts                # MDX 파일 처리

data/
  blog/                 # 블로그 MDX 파일 (노션에서 변환)
  projects/             # 프로젝트 MDX 파일
  about/developer.mdx   # About 페이지 내용
  headerNavLinks.ts     # 네비게이션 링크
  siteMetadata.js       # 사이트 메타데이터

scripts/
  notion-to-blog.js     # 노션 → 블로그 변환 스크립트
  image-map.json        # 로컬 이미지 경로 → Cloudinary URL 매핑

next.config.js          # CSP 설정 (Vimeo, YouTube iframe 허용)
```

---

## 노션 → 블로그 변환

### 노션 내보내기 원본 위치

`F:\개인 페이지 & 공유된 페이지\프로그래밍\`

### 실행 순서

```bash
# 1단계: 이미지를 Cloudinary에 업로드 (최초 1회, 또는 새 이미지 추가 시)
node scripts/notion-to-blog.js upload

# 2단계: MD → MDX 변환 (내용 변경 시 재실행)
rm -f data/blog/*.mdx
node scripts/notion-to-blog.js convert
```

### 변환 규칙

| 항목      | 처리 방식                                          |
| --------- | -------------------------------------------------- |
| 슬러그    | 비ASCII·특수문자 제거, 공백→`-`, 소문자, 최대 80자 |
| 이미지    | Cloudinary URL로 교체 (image-map.json 조회)        |
| 내부 링크 | `[text](file.md)` → `text` (링크 제거)             |
| 목차 파일 | 링크 비율 70% 이상이면 스킵                        |
| category  | `'게임 개발/유니티'` 형식 (1단계/2단계 폴더)       |

### frontmatter 구조

```yaml
---
title: '제목'
date: '파일 수정일'
category: '게임 개발/유니티'
tags: ['게임 개발', '유니티']
draft: false
summary: ''
---
```

### 변환 통계 (2026-09-03 기준)

- MD 파일: 957개 → 873개 변환, 84개 스킵
- 이미지: 6,294개 Cloudinary 업로드 완료

---

## 블로그 카테고리 트리

### 구조

노션 폴더 계층 → MDX `category` 필드 → `buildCategoryTree()` → 사이드바 렌더링

```
게임 개발 / 유니티
게임 개발 / 언리얼
게임 개발 / WWISE
백엔드 / 스프링
백엔드 / JPA
프론트 / React
...
```

### CategoryTree 컴포넌트 주요 동작

- 기본: 모두 닫힘
- `currentCategory` prop 전달 시: 해당 경로 자동 펼침 (블로그 상세 페이지)
- 긴 이름: `truncate` + `title` 속성으로 말줄임표 + 호버 툴팁
- 아이콘에 `shrink-0` 적용 → 긴 이름에서도 크기 고정

### CategoryTree Props

```tsx
<CategoryTree
  tree={buildCategoryTree(posts)}
  onCategorySelect={(path) => setSelectedCategory(path)}
  selectedCategory={selectedCategory}
  currentCategory="백엔드/스프링" // 블로그 상세에서만 사용
/>
```

---

## Portfolio 페이지 영상 목록

### 사운드 디자인 (Vimeo)

| 제목                                            | Vimeo ID  |
| ----------------------------------------------- | --------- |
| Batman Arkham — Sound Design                    | 731211072 |
| Warhammer 40,000: Space Marine 2 — Sound Design | 731215361 |
| Casual Style — Sound Design & Composition       | 731735440 |
| FORSPOKEN — Sound Design                        | 731215776 |

### 시스템 구현 (YouTube)

| 제목                                         | YouTube ID  |
| -------------------------------------------- | ----------- |
| 1인칭 호러 게임 「OverTime」                 | Th7y8oyaKOg |
| 물리 상호작용 기반 절차적 사운드 생성 시스템 | MSVq0Zz2MMk |

> 새 영상 추가: `app/portfolio/page.tsx`의 `soundDesignItems` 또는 `systemItems` 배열에 추가

---

## Vercel 배포

### 자동 배포

GitHub main 브랜치 push → Vercel 자동 빌드 및 배포

### 수동 프로모션 (자동 안 될 때)

```bash
npx vercel alias set [새 deployment URL] dongk.vercel.app
npx vercel alias set [새 deployment URL] portfolio-blog-dongdongdongks-projects.vercel.app
```

### 주의사항

- Deployment Protection은 Off로 설정 (Settings → Deployment Protection)
- Next.js 취약 버전 감지 시 Vercel이 배포 차단 → 업데이트 필요

---

## CSP (Content Security Policy)

`next.config.js`에서 관리

현재 허용 목록:

- `frame-src`: `giscus.app`, `https://www.youtube.com`, `https://player.vimeo.com`
- `script-src`: `giscus.app`, `analytics.umami.is`, `https://player.vimeo.com`

새 외부 서비스 추가 시 `next.config.js`의 `ContentSecurityPolicy` 수정 필요

---

## 환경변수 (.env.local)

```
CLOUDINARY_CLOUD_NAME=du1acdhxq
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

`.gitignore`에 포함되어 있어 GitHub에 올라가지 않음
