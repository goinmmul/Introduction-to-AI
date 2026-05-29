# 메오티

메오티는 KENTECH 학생과 빛가람혁신도시 주변 사용자를 위한 조건 기반 음식 추천 MVP입니다. 사용자가 먹기 싫은 음식, 예산, 원하는 맛, 식사 시간, 최근 먹은 음식을 입력하면 로컬 메뉴 데이터에서 Top 3 메뉴를 추천합니다.

## Main Features

- 홈 페이지: 서비스 소개, 작동 방식, 메뉴 추천 미리보기
- 추천 페이지: 조건 입력 폼과 Top 3 추천 결과
- About 페이지: 서비스 목적, 데이터 범위, MVP 한계 설명
- 로컬 JSON 기반 추천 로직
- 가격 정보가 없는 메뉴도 안전하게 처리
- 로그인, 데이터베이스, 지도 API, 결제, 예약 기능 없음

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Local JSON data
- Deployment target: Vercel

## Install and Run

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다.

빌드 확인:

```bash
npm run build
```

## Data Scope

MVP 데이터는 빛가람혁신도시 주변 음식점과 대표 메뉴를 대상으로 합니다. 데이터는 `data/menus.json` 파일에 저장되어 있으며, 별도 데이터베이스는 사용하지 않습니다.

## How `data/menus.json` Is Used

`src/lib/recommendation.ts`에서 `data/menus.json`을 import해 추천 후보 목록으로 사용합니다. 각 메뉴는 `restaurantName`, `menuName`, `category`, `estimatedPrice`, `tasteTags`, `mealTimeTags`, `similarityTags`, `locationNote`, `needsVerification` 같은 필드를 가질 수 있습니다.

`estimatedPrice`가 `null`인 경우 추천에서 제거하지 않고 가격 확인 필요로 표시합니다.

## How to Update Menu Data

1. `data/menus.json`을 엽니다.
2. 기존 JSON 배열 형식을 유지합니다.
3. 메뉴 객체에 고유한 `id`를 넣습니다.
4. 가격을 모르면 `estimatedPrice: null`로 둡니다.
5. 검증이 필요한 항목은 `needsVerification: true`를 유지합니다.
6. 저장 후 `npm run build`로 JSON 파싱과 타입 오류를 확인합니다.

## MVP Limitations

- 메뉴 데이터는 수동 수집 또는 부분 검증 데이터일 수 있습니다.
- 가격과 영업 상태는 실시간으로 업데이트되지 않습니다.
- AI API는 MVP에 통합되어 있지 않습니다.
- 지도, 로그인, 예약, 결제 기능은 포함하지 않습니다.
- 추천 설명은 규칙 기반 문장입니다.

## Future Improvements

- AI 생성 추천 설명
- 그룹 추천
- 지도 링크
- 실제 음식점 데이터 업데이트 흐름
- 더 정교한 유사도 계산

## AI Usage Note

AI API is not integrated in the MVP. AI-generated explanations are optional future work. The current recommendation result uses local data and rule-based scoring only.

## Warning

Prices and restaurant information may need manual verification before a real visit. Do not expose private API keys or credentials in this repository or Vercel environment variables.
