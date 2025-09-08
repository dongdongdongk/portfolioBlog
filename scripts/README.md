# PNG to WebP 변환 스크립트

PNG 파일들을 WebP 형식으로 변환하여 용량을 줄이는 스크립트입니다.

## 사용법

### 1. 기본 사용법 (public/images 폴더)

```bash
npm run convert-webp
```

### 2. 특정 폴더 지정

```bash
npm run convert-webp [폴더경로]
```

### 3. 품질 설정 (1-100)

```bash
npm run convert-webp [폴더경로] [품질]
```

## 예시

### 기본 폴더에서 기본 품질(80)로 변환

```bash
npm run convert-webp
```

### 특정 폴더에서 변환

```bash
npm run convert-webp "./data/blog/Web Audio API Basic"
```

### 높은 품질(90)로 변환

```bash
npm run convert-webp "./public/images" 90
```

### 낮은 품질(60)로 변환 (더 작은 용량)

```bash
npm run convert-webp "./public/images" 60
```

## 기능

✅ **자동 파일명 유지**: `image.png` → `image.webp`  
✅ **용량 압축**: 평균 20-70% 용량 감소  
✅ **품질 조절**: 1-100까지 품질 설정 가능  
✅ **진행 상황 표시**: 각 파일별 변환 결과 출력  
✅ **요약 정보**: 전체 절약 용량 및 압축률 표시

## 주의사항

- 스크립트는 **원본 PNG 파일을 보존**합니다
- 원본 파일을 삭제하려면 스크립트 내 주석을 해제하세요
- WebP 품질 권장값: 70-90 (기본값: 80)

## 품질 가이드

| 품질   | 용도           | 특징                 |
| ------ | -------------- | -------------------- |
| 60-70  | 썸네일, 아이콘 | 최대 압축, 작은 용량 |
| 70-80  | 일반 웹 이미지 | 균형잡힌 품질/용량   |
| 80-90  | 고품질 이미지  | 높은 품질 유지       |
| 90-100 | 전문적 용도    | 최고 품질, 큰 용량   |
