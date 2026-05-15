# cosmetics-shop

Next.js 기반 화장품 쇼핑몰 프론트엔드입니다. 상품 목록·상세, 장바구니, 즐겨찾기, 마이페이지, 관리자(파트너·상품) 화면을 포함하며, 백엔드 API는 Axios로 호출하고 데이터 패칭은 TanStack Query(React Query)로 처리합니다.
Next.js의 App Router를 활용하여 서버 컴포넌트와 클라이언트 컴포넌트를 분리하여 개발했습니다.

## 개발 전제

이 프로젝트는 **백엔드 API가 있다는 것을 전제로** 개발했습니다. 엔드포인트 URL, HTTP 메서드, 요청·응답 형태는 실제 서버와 맞닿도록 `src/api/` 모듈과 `src/types/`의 타입에 반영해 두었고, 화면은 대부분 React Query 훅을 통해 그 API를 호출하는 흐름입니다. 로컬에서 API 서버를 띄우지 않은 채 UI만 다룰 때는 아래 `API_QUERY_ENABLED`로 쿼리 실행을 꺼 두면 됩니다.

## 기술 스택

- **프레임워크**: Next.js 15 (App Router), React 19
- **언어**: TypeScript
- **스타일**: Tailwind CSS, Radix UI
- **상태·데이터**: Zustand, TanStack Query v5, React Hook Form + Zod
- **HTTP**: Axios (`NEXT_PUBLIC_API_URL` 기준)
- **다국어**: next-intl (한국어 `ko`, 영어 `en`, 아랍어 `ar`)

## 프로젝트 구조 (요약)

```
src/
  app/              # App Router 페이지·레이아웃
  api/              # Axios API 함수 (엔드포인트별 모듈)
  react-query/      # Query/Mutation 훅
  components/       # UI 컴포넌트
  store/            # Zustand 스토어 (인증, 장바구니, 위시리스트 등)
  constants/        # 카테고리, QUERY_KEYS, API_QUERY_ENABLED
  types/            # 공통 타입 정의
  hooks/            # 토스트 등 공통 훅
  utils/            # 포맷 등 유틸
```

## UI·디자인

피그마 등 **별도의 디자인 시안 없이** 화면을 구성했고, 레이아웃·컴포넌트·문구 등 UI 작업에는 **AI 도구(cursor, claude)를 활용**했습니다. 따라서 브랜드 가이드나 완성된 디자인 시스템에 맞춘 결과물은 아니며, 기능·흐름 위주의 구현에 가깝습니다.

## 디자인 토큰 (색상)

색상 **값**은 `src/app/globals.css`의 `:root` 변수, **클래스**는 `tailwind.config.ts`에서 연결합니다. 색상 토큰값을 사용하여 개발하며 하드코딩을 지양합니다.

| 토큰                            | 용도               |
| ------------------------------- | ------------------ |
| `primary-*`                     | 브랜드 (기존 rose) |
| `gray-*`                        | 텍스트·배경·보더   |
| `success` / `warning` / `error` | 상태·에러          |

## 백엔드 연동 시 참고

- 인증이 필요한 요청은 `axiosWithAuth` 인스턴스를 사용합니다. 토큰·리프레시 처리는 `src/api/axiosInstance/interceptors`에서 담당합니다.
- API 함수는 `src/api/` 아래 모듈에 정의되어 있고, 화면에서는 `src/react-query/queries/` 훅을 통해 호출하는 구성을 권장합니다.

## API 목록

아래 경로는 모두 **`NEXT_PUBLIC_API_URL`에 붙는 상대 경로**입니다.

**인증**

| 메서드 | 경로                       | 설명                                  |
| ------ | -------------------------- | ------------------------------------- |
| `POST` | `/auth/login`              | 로그인                                |
| `POST` | `/auth/signup`             | 회원가입                              |
| `GET`  | `/auth/check-email?email=` | 이메일 중복 여부                      |
| `POST` | `/auth/refresh`            | 액세스 토큰 갱신 (`{ refreshToken }`) |

**상품** (`src/api/products.ts`)

| 메서드   | 경로               | 설명                                                             |
| -------- | ------------------ | ---------------------------------------------------------------- |
| `GET`    | `/products`        | 상품 목록(페이징). 쿼리: `page`, `size`, `category`, `brandName` |
| `GET`    | `/products/brands` | 브랜드명 목록                                                    |
| `GET`    | `/products/:id`    | 상품 상세                                                        |
| `POST`   | `/products`        | 상품 등록                                                        |
| `PUT`    | `/products/:id`    | 상품 수정                                                        |
| `DELETE` | `/products/:id`    | 상품 삭제(소프트)                                                |

**주문** (`src/api/orders.ts`)

| 메서드   | 경로          | 설명                                         |
| -------- | ------------- | -------------------------------------------- |
| `POST`   | `/orders`     | 주문 생성                                    |
| `GET`    | `/orders`     | 내 주문 목록                                 |
| `GET`    | `/orders/:id` | 주문 상세                                    |
| `DELETE` | `/orders/:id` | 주문 취소(주문완료 상태 등 서버 규칙에 따름) |

**배송지** (`src/api/shipping.ts`)

| 메서드   | 경로                      | 설명        |
| -------- | ------------------------- | ----------- |
| `GET`    | `/shipping-addresses`     | 배송지 목록 |
| `POST`   | `/shipping-addresses`     | 배송지 등록 |
| `DELETE` | `/shipping-addresses/:id` | 배송지 삭제 |

**리뷰** (`src/api/reviews.ts`)

| 메서드 | 경로                  | 설명             |
| ------ | --------------------- | ---------------- |
| `GET`  | `/reviews?productId=` | 상품별 리뷰 목록 |
| `POST` | `/reviews`            | 리뷰 작성        |

**관리자 · 파트너** (`src/api/partners.ts`)

| 메서드  | 경로                         | 설명                                |
| ------- | ---------------------------- | ----------------------------------- |
| `GET`   | `/admin/partners`            | 파트너 목록                         |
| `POST`  | `/admin/partners`            | 파트너 등록                         |
| `PATCH` | `/admin/partners/:id/active` | 파트너 활성/비활성 (`{ isActive }`) |

상세 요청·응답 타입은 `src/types/index.ts`와 각 `src/api/*.ts` 구현을 함께 보면 됩니다.

## API 쿼리 켜기 / 끄기 (`API_QUERY_ENABLED`)

백엔드나 인증이 준비되기 전에는 불필요한 요청·에러를 피하기 위해, React Query의 `enabled`와 연동되는 플래그를 **`src/constants/index.ts`** 의 `API_QUERY_ENABLED` 객체에서 한 번에 제어합니다. 기본값은 모두 `false`입니다.
백엔드를 띄운 뒤 연동할 화면만 `true`로 바꾸면 됩니다. 목록/상세 등은 API가 꺼져 있을 때 안내 문구나 빈 상태를 보여 주도록 되어 있습니다.

## 다국어 (i18n)

[next-intl](https://next-intl-docs.vercel.app/)을 사용합니다. 문구는 스프레드시트 → JSON 변환 파이프라인과 동일하게 **`messages/ko.json`**, **`messages/en.json`**, **`messages/ar.json`** 에서 관리합니다.

| 항목      | 설명                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------ |
| URL       | `/ko/products`, `/en/products`, `/ar/products` 형태 (`localePrefix: always`)                           |
| 기본 언어 | `ko`                                                                                                   |
| 아랍어    | `dir="rtl"` 자동 적용, Tailwind `start`/`end`, `rtl:rotate-180` 등 사용                                |
| GNB       | `LanguageSwitcher` — 모바일은 `KO`/`EN`/`AR`, 데스크톱은 전체 언어명                                   |
| 코드      | `useTranslations('gnb')` / `getTranslations('home')`, 링크는 `@/i18n/navigation`의 `Link`, `useRouter` |

새 문구 추가 시 세 JSON 파일에 **동일한 키**로 넣고, 컴포넌트에서 `t('키')`로 참조하면 됩니다.
