# Whale ERP Staff App

Whale ERP 직원용 모바일 웹 애플리케이션

## 기술 스택

- **Framework**: Next.js 16.2.0 (App Router)
- **Runtime**: React 19.2.4 + TypeScript 5
- **Styling**: SCSS (7-1 패턴) + Tailwind CSS 4
- **State**: Zustand 5.0.12
- **UI**: react-modal-sheet 5.5.0
- **Package Manager**: pnpm 9.15.0

## 시작하기

```bash
pnpm install
pnpm dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 실행 |
| `pnpm lint` | ESLint 검사 |

## 주요 기능

| 기능 | 경로 | 설명 |
|------|------|------|
| 대시보드 | `/` | 메인 홈 |
| 로그인 | `/login` | 인증 |
| 회원가입 | `/signup` | 계정 생성 |
| 출퇴근 | `/commute` | QR 체크인/아웃 |
| 근로계약 | `/employment` | 계약서 관리 |
| 급여명세 | `/salary` | 급여 조회 |
| 할 일 | `/todo` | 업무 체크리스트 |
| 사업장 | `/workplace` | 매장 관리 |
| 마이페이지 | `/mypage` | 프로필, 경력, 자격증, 계좌, 서류, 탈퇴 |

## 프로젝트 구조

```
src/
├── app/           # 페이지 (App Router, 라우트 그룹: auth, sub)
├── components/    # 컴포넌트 (ui, popup, bottomSheet, 도메인별)
├── store/         # Zustand 스토어 (팝업, 바텀시트 상태)
├── data/          # 정적 데이터 (메뉴 등)
└── styles/        # SCSS 7-1 패턴 (abstracts, base, components, layout)
```
