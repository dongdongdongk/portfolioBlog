# 프로젝트 전체 정리

## 프로젝트 개요

김동현 포트폴리오 블로그. Next.js 기반 정적 사이트로 포트폴리오, 블로그, 프로젝트 소개를 담고 있다.

- **URL**: https://dongk.vercel.app
- **기술스택**: Next.js 15.2.9 / Tailwind CSS v4 / TypeScript
- **배포**: Vercel (GitHub main 브랜치 push → 자동 배포)
- **콘텐츠**: 파일 기반 MDX (DB 없음)
- **이미지**: Cloudinary (cloud: `du1acdhxq`)

---

## 페이지 구성

| 페이지      | 경로           | 파일                                 | 설명                               |
| ----------- | -------------- | ------------------------------------ | ---------------------------------- |
| 메인        | `/`            | `app/Main.tsx`                       | 히어로, 스킬, Contact, 링크 섹션   |
| 블로그 목록 | `/blog`        | `layouts/ListLayoutWithTags.tsx`     | 카테고리 트리 사이드바 + 검색      |
| 블로그 상세 | `/blog/[slug]` | `layouts/PostLayout.tsx`             | 카테고리 트리 사이드바 + 이전/다음 |
| 포트폴리오  | `/portfolio`   | `app/portfolio/page.tsx`             | Vimeo/YouTube 영상 아코디언        |
| 프로젝트    | `/projects`    | `layouts/ProjectsLayoutWithTags.tsx` | Developer/Sound Designer 탭        |
| About       | `/about`       | `app/about/page.tsx`                 | 2컬럼 (이미지 + 텍스트)            |
| Contact     | `/contact`     | `app/contact/page.tsx`               | 2컬럼 폼                           |
| 404         | 없는 경로      | `app/not-found.tsx`                  | 미니멀 스타일                      |

---

## 디자인 컨셉

- **스타일**: 화이트/미니멀, 블랙-화이트만 사용
- **다크모드**: 없음
- **최대 너비**: `max-w-5xl` (블로그 상세는 사이드바 포함 `max-w-7xl`)
- **헤더**: Sticky, 흰 배경, 로고 마크 없음
- **푸터**: 블랙 배경

---

## 주요 컴포넌트

### CategoryTree (`components/CategoryTree.tsx`)

블로그 사이드바의 폴더 트리 컴포넌트.

- 기본: 모두 닫힘
- 블로그 상세에서 `currentCategory` 전달 시 해당 폴더 자동 펼침
- 긴 이름: 말줄임표 + 호버 툴팁

### buildCategoryTree (`lib/categoryTree.ts`)

posts 배열의 `category` 필드(`'게임 개발/유니티'`)를 `/`로 분리해 트리 구조 생성.

---

## 콘텐츠 관리

### 블로그 글

- 위치: `data/blog/*.mdx`
- 노션 내보내기 → 변환 스크립트로 자동 생성
- 상세 방법: `docs/notion-to-blog-guide.md` 참고

### Portfolio 영상 추가

`app/portfolio/page.tsx`의 배열에 직접 추가:

```ts
// 사운드 디자인 (Vimeo)
const soundDesignItems = [
  {
    title: '영상 제목',
    description: '설명',
    type: 'vimeo',
    embedId: 'Vimeo영상ID',
    embedSrc: 'https://player.vimeo.com/video/[ID]?badge=0&...',
    tags: ['Sound Design', 'SFX'],
  },
]

// 시스템 구현 (YouTube)
const systemItems = [
  {
    title: '영상 제목',
    description: '설명',
    type: 'youtube',
    embedId: 'YouTube영상ID',
    tags: ['Unity', 'C#'],
  },
]
```

### About 내용

`data/about/developer.mdx` 직접 편집

### 네비게이션 링크

`data/headerNavLinks.ts` 직접 편집

---

## 환경변수

`.env.local` (gitignore 처리됨, GitHub에 올라가지 않음):

```
CLOUDINARY_CLOUD_NAME=du1acdhxq
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## Vercel 배포 관리

```bash
# 배포 목록 확인
npx vercel ls

# 도메인 수동 연결 (자동 안 될 때)
npx vercel alias set [deployment-url] dongk.vercel.app

# 배포 로그 확인
npx vercel inspect [deployment-url] --logs
```

**주의**: Deployment Protection이 On이면 외부 접속 불가 → Settings에서 Off로 설정

---

## CSP 설정 (`next.config.js`)

외부 iframe 또는 스크립트 추가 시 `ContentSecurityPolicy`에 도메인 추가 필요:

```js
frame-src giscus.app https://www.youtube.com https://player.vimeo.com;
script-src ... https://player.vimeo.com;
```

---

## 로컬 개발

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

---

## 커밋 & 배포 흐름

```bash
# 1. 변경사항 확인
git status

# 2. 스테이징 (민감한 파일 제외 확인)
git add [파일들]

# 3. 커밋
git commit -m "변경 내용 설명"

# 4. 푸시 → Vercel 자동 배포
git push origin main
```

**빌드 실패 시 체크리스트**:

1. TypeScript 오류 → `npm run build`로 로컬 확인
2. ESLint 오류 → `npm run lint`로 확인
3. Next.js 보안 취약점 → 버전 업데이트 필요
