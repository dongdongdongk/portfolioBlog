# 노션 자료를 블로그에 넣는 방법

## 사전 준비

### 필요한 것

- 노션에서 내보내기(Export)한 마크다운 파일 폴더
- Cloudinary 계정 (이미지 호스팅)
- `.env.local` 파일에 Cloudinary 환경변수 설정

### `.env.local` 설정

프로젝트 루트에 `.env.local` 파일 생성:

```
CLOUDINARY_CLOUD_NAME=du1acdhxq
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 1단계 — 노션에서 내보내기

1. 노션에서 내보낼 페이지 또는 전체 워크스페이스 선택
2. `...` 메뉴 → **Export** 클릭
3. Export format: **Markdown & CSV** 선택
4. **Include subpages** 체크
5. **Create folders for subpages** 체크
6. 다운로드 후 압축 해제

> 📁 현재 프로젝트에서 사용 중인 원본 경로:
> `F:\개인 페이지 & 공유된 페이지\프로그래밍\`

---

## 2단계 — 스크립트 설정 확인

`scripts/notion-to-blog.js` 파일 상단의 `NOTION_SRC` 경로를 자신의 노션 내보내기 폴더 경로로 수정:

```js
const NOTION_SRC = 'F:/개인 페이지 & 공유된 페이지/프로그래밍'
```

---

## 3단계 — 이미지 Cloudinary 업로드

노션 내보내기 폴더의 이미지를 Cloudinary에 업로드합니다.
**최초 1회 또는 새 이미지가 추가됐을 때만 실행**합니다.

```bash
node scripts/notion-to-blog.js upload
```

- 완료되면 `scripts/image-map.json` 파일이 생성됩니다
- 이미 업로드된 이미지는 자동으로 건너뜁니다 (재실행해도 안전)
- 업로드 진행 상황은 점(`.`)으로 표시됩니다

---

## 4단계 — MD → MDX 변환

노션 마크다운 파일을 블로그용 MDX 파일로 변환합니다.

```bash
# 기존 변환 파일 삭제 후 재변환
rm -f data/blog/*.mdx
node scripts/notion-to-blog.js convert
```

변환 결과:

- `data/blog/*.mdx` 파일이 생성됩니다
- 이미지 경로가 Cloudinary URL로 교체됩니다
- 노션 내부 링크는 일반 텍스트로 변환됩니다
- 목차/인덱스 파일(링크만 있는 파일)은 자동으로 스킵됩니다

---

## 5단계 — 로컬에서 확인

```bash
npm run dev
```

브라우저에서 `http://localhost:3000/blog` 접속해 글이 잘 나오는지 확인합니다.

---

## 6단계 — 커밋 및 배포

```bash
git add data/blog/
git commit -m "노션 블로그 글 추가"
git push origin main
```

GitHub push 후 Vercel이 자동으로 빌드·배포합니다.

---

## 변환 규칙 요약

| 항목           | 처리 결과                                 |
| -------------- | ----------------------------------------- |
| 파일명의 UUID  | 제거 (`파일명 1c1e683f....md` → `파일명`) |
| 슬러그         | 한글·특수문자 제거, 공백→`-`, 소문자      |
| 이미지         | Cloudinary URL로 자동 교체                |
| 노션 내부 링크 | 링크 제거, 텍스트만 유지                  |
| 목차 파일      | 자동 스킵                                 |
| category       | 폴더 구조 기반 (`게임 개발/유니티` 형식)  |
| tags           | 1~2단계 폴더명                            |
| date           | 파일 수정일 기준                          |

---

## 폴더 구조와 카테고리 관계

노션 폴더 구조가 블로그 카테고리로 그대로 반영됩니다.

```
노션 폴더:
  프로그래밍/
    게임 개발/
      유니티/
        강의 정리.md

블로그 frontmatter:
  category: '게임 개발/유니티'
  tags: ['게임 개발', '유니티']
```

블로그 사이드바에 자동으로 카테고리 트리가 생성됩니다.

---

## 자주 있는 문제

### 이미지가 안 보여요

- `image-map.json`에 해당 이미지 경로가 있는지 확인
- Cloudinary 대시보드에서 이미지가 업로드됐는지 확인
- 권한 문제: Cloudinary API Key의 Upload 권한 활성화 필요

### 404 오류가 나요

- 슬러그에 한글이나 특수문자가 있는 경우 발생
- 변환 스크립트가 자동으로 처리하므로 재변환 시도

### 카테고리가 사이드바에 안 보여요

- MDX frontmatter에 `category` 필드가 있는지 확인
- 형식: `category: '게임 개발/유니티'` (슬래시로 구분)
