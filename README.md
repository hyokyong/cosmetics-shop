# cosmetics-shop

Next.js 기반 화장품 쇼핑몰입니다. 상품 목록·상세, 장바구니, 즐겨찾기, 마이페이지, 관리자(파트너·상품) 화면을 포함하며, 프론트엔드와 백엔드를 동일한 Next.js 프로젝트 내에서 구현했습니다.
백엔드 API는 Axios로 호출하고 데이터 패칭은 TanStack Query(React Query)로 처리합니다.
Next.js의 App Router를 활용하여 서버 컴포넌트와 클라이언트 컴포넌트를 분리하여 개발했습니다.

## 기술 스택

**프론트엔드**

- **프레임워크**: Next.js 15 (App Router), React 19
- **언어**: TypeScript
- **스타일**: Tailwind CSS, Radix UI
- **상태·데이터**: Zustand, TanStack Query v5, React Hook Form + Zod
- **HTTP**: Axios (`NEXT_PUBLIC_API_URL` 기준)
- **다국어**: next-intl (한국어 `ko`, 영어 `en`, 아랍어 `ar`)

**백엔드**

- **API**: Next.js App Router API Routes (`src/app/api/`)
- **DB**: PostgreSQL (Neon)
- **ORM**: Prisma 7
- **인증**: JWT (jsonwebtoken, bcryptjs)

## 프로젝트 구조 (요약)

```
src/
  app/
    api/          # API Routes (백엔드)
      auth/       # 로그인, 회원가입, 토큰 갱신
      products/   # 상품 목록, 상세, 등록, 수정, 삭제
      orders/     # 주문 목록, 상세, 생성, 취소
      shipping-addresses/  # 배송지 목록, 등록, 삭제
      reviews/    # 리뷰 목록, 작성
      admin/      # 파트너 관리
    (pages)/      # App Router 페이지·레이아웃
  api/            # Axios API 함수 (엔드포인트별 모듈)
  react-query/    # Query/Mutation 훅
  components/     # UI 컴포넌트
  store/          # Zustand 스토어 (인증, 장바구니, 위시리스트 등)
  lib/            # Prisma Client, JWT 인증 유틸
  constants/      # 카테고리, QUERY_KEYS
  types/          # 공통 타입 정의
  hooks/          # 토스트 등 공통 훅
  utils/          # 포맷 등 유틸
prisma/
  schema.prisma   # DB 스키마
```

## UI·디자인

피그마 등 **별도의 디자인 시안 없이** 화면을 구성했고, 레이아웃·컴포넌트·문구 등 UI 작업에는 **AI 도구(Cursor, Claude)를 활용**했습니다.

## 디자인 토큰 (색상)

색상 **값**은 `src/app/globals.css`의 `:root` 변수, **클래스**는 `tailwind.config.ts`에서 연결합니다. 색상 토큰값을 사용하여 개발하며 하드코딩을 지양합니다.

| 토큰                            | 용도               |
| ------------------------------- | ------------------ |
| `primary-*`                     | 브랜드 (기존 rose) |
| `gray-*`                        | 텍스트·배경·보더   |
| `success` / `warning` / `error` | 상태·에러          |

## API · React Query 구조

**컴포넌트 → React Query 훅 → API 함수 → Axios** 순으로만 호출합니다. 페이지에서 Axios를 직접 쓰지 않습니다.

| 레이어  | 경로                       | 역할                                                                 |
| ------- | -------------------------- | -------------------------------------------------------------------- |
| Axios   | `src/api/axiosInstance/`   | `axiosService`(비인증), `axiosWithAuth`(Bearer + 401 refresh)        |
| API     | `src/api/*.ts`             | `getOrders`, `postLogin` 등 순수 HTTP 함수                           |
| 훅      | `src/react-query/queries/` | `useGetOrders` → `queryFn: getOrders`, `usePostOrder` → `mutationFn` |
| 타입·키 | `src/types/`, `QUERY_KEYS` | 요청·응답 타입, 캐시 키                                              |

## 백엔드 구조

### 인증

JWT 기반 인증을 구현했습니다. 로그인 시 `accessToken`(1시간)과 `refreshToken`(7일)을 발급하며, 비밀번호는 bcrypt로 암호화하여 저장합니다.

`src/lib/auth.ts`에서 토큰 검증 및 권한 체크 유틸을 제공합니다.

```
인증 필요 API  →  getAuthUser(req)로 토큰 검증  →  없으면 401 반환
관리자 API    →  role === 'ADMIN' 체크           →  없으면 403 반환
```

### DB 스키마

Prisma를 통해 아래 테이블을 관리합니다.

| 테이블            | 설명                                  |
| ----------------- | ------------------------------------- |
| `User`            | 유저 (role: USER / ADMIN / PARTNER)   |
| `Product`         | 상품 (소프트 삭제 지원)               |
| `Order`           | 주문 (status: PENDING → CANCELLED 등) |
| `OrderItem`       | 주문 상품 (주문 1개 : 상품 N개)       |
| `ShippingAddress` | 배송지 (기본 배송지 지원)             |
| `Review`          | 리뷰                                  |
| `Partner`         | 파트너 (활성/비활성)                  |

## API 목록

아래 경로는 모두 **`NEXT_PUBLIC_API_URL`에 붙는 상대 경로**입니다.

**인증**

| 메서드 | 경로                       | 인증 | 설명                                  |
| ------ | -------------------------- | ---- | ------------------------------------- |
| `POST` | `/auth/login`              |      | 로그인                                |
| `POST` | `/auth/signup`             |      | 회원가입                              |
| `GET`  | `/auth/check-email?email=` |      | 이메일 중복 여부                      |
| `POST` | `/auth/refresh`            |      | 액세스 토큰 갱신 (`{ refreshToken }`) |

**상품**

| 메서드   | 경로               | 인증  | 설명                                                             |
| -------- | ------------------ | ----- | ---------------------------------------------------------------- |
| `GET`    | `/products`        |       | 상품 목록(페이징). 쿼리: `page`, `size`, `category`, `brandName` |
| `GET`    | `/products/brands` |       | 브랜드명 목록                                                    |
| `GET`    | `/products/:id`    |       | 상품 상세                                                        |
| `POST`   | `/products`        | ADMIN | 상품 등록                                                        |
| `PUT`    | `/products/:id`    | ADMIN | 상품 수정                                                        |
| `DELETE` | `/products/:id`    | ADMIN | 상품 삭제(소프트)                                                |

**주문**

| 메서드   | 경로          | 인증 | 설명         |
| -------- | ------------- | ---- | ------------ |
| `POST`   | `/orders`     | USER | 주문 생성    |
| `GET`    | `/orders`     | USER | 내 주문 목록 |
| `GET`    | `/orders/:id` | USER | 주문 상세    |
| `DELETE` | `/orders/:id` | USER | 주문 취소    |

**배송지**

| 메서드   | 경로                      | 인증 | 설명        |
| -------- | ------------------------- | ---- | ----------- |
| `GET`    | `/shipping-addresses`     | USER | 배송지 목록 |
| `POST`   | `/shipping-addresses`     | USER | 배송지 등록 |
| `DELETE` | `/shipping-addresses/:id` | USER | 배송지 삭제 |

**리뷰**

| 메서드 | 경로                  | 인증 | 설명             |
| ------ | --------------------- | ---- | ---------------- |
| `GET`  | `/reviews?productId=` |      | 상품별 리뷰 목록 |
| `POST` | `/reviews`            | USER | 리뷰 작성        |

**관리자 · 파트너**

| 메서드  | 경로                         | 인증  | 설명                                |
| ------- | ---------------------------- | ----- | ----------------------------------- |
| `GET`   | `/admin/partners`            | ADMIN | 파트너 목록                         |
| `POST`  | `/admin/partners`            | ADMIN | 파트너 등록                         |
| `PATCH` | `/admin/partners/:id/active` | ADMIN | 파트너 활성/비활성 (`{ isActive }`) |

## 로컬 실행

```bash
# 패키지 설치
npm install

# 환경변수 설정
# .env.development에 아래 값 설정
# NEXT_PUBLIC_API_URL=http://localhost:3000/api
# DATABASE_URL=<Neon Connection String>
# JWT_SECRET=<시크릿 키>
# JWT_REFRESH_SECRET=<리프레시 시크릿 키>

# DB 테이블 생성
npx prisma db push

# 개발 서버 실행
npm run dev
```

## 다국어 (i18n)

[next-intl](https://next-intl-docs.vercel.app/)을 사용합니다. 문구는 **`messages/ko.json`**, **`messages/en.json`**, **`messages/ar.json`** 에서 관리합니다.

| 항목      | 설명                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------ |
| URL       | `/ko/products`, `/en/products`, `/ar/products` 형태 (`localePrefix: always`)                           |
| 기본 언어 | `ko`                                                                                                   |
| 아랍어    | `dir="rtl"` 자동 적용, Tailwind `start`/`end`, `rtl:rotate-180` 등 사용                                |
| GNB       | `LanguageSwitcher` — 모바일은 `KO`/`EN`/`AR`, 데스크톱은 전체 언어명                                   |
| 코드      | `useTranslations('gnb')` / `getTranslations('home')`, 링크는 `@/i18n/navigation`의 `Link`, `useRouter` |

새 문구 추가 시 세 JSON 파일에 **동일한 키**로 넣고, 컴포넌트에서 `t('키')`로 참조하면 됩니다.
