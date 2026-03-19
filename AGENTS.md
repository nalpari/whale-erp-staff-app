<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Memo

- 모든 답변과 추론과정은 한국어로 작성한다.
- task가 끝나면 서브 에이전트를 사용해서 린트체크, 타입체크, 빌드체크를 수행한다.
- 린트체크시 오류가 있으면 반드시 해결하고 넘어가도록 하고, 경고가 있더라도 해결하려고 노력한다.
- 커밋시에 접두사는 영어로 나머지 타이틀과 내용은 한국어로 작성한다.
- task 완료시 AGENTS.md 및 README.md 문서에 업데이트가 필요하면 진행한다.
- 가급적 react 19.2 버전의 최신 문법을 사용한다.

# 프로젝트 개요

Whale ERP 직원용 모바일 웹 애플리케이션. 출퇴근, 급여, 근로계약, 할 일, 사업장 관리 등 직원 업무를 지원한다.

# 기술 스택

| 항목 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 16.2.0 |
| 런타임 | React | 19.2.4 |
| 언어 | TypeScript | 5 |
| 스타일 | SCSS (7-1 패턴) + Tailwind CSS | sass 1.98, tailwind 4 |
| 상태관리 | Zustand | 5.0.12 |
| UI | react-modal-sheet (바텀시트) | 5.5.0 |
| 패키지매니저 | pnpm | 9.15.0 |

# 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── layout.tsx          # 루트 레이아웃 (Header, Footer, Controllers)
│   ├── page.tsx            # 홈/대시보드
│   ├── list/               # 목록 페이지
│   ├── (auth)/             # 인증 라우트 그룹
│   │   ├── login/          # 로그인
│   │   ├── signup/         # 회원가입
│   │   └── request/        # 가입 요청
│   └── (sub)/              # 서브 라우트 그룹
│       ├── commute/        # 출퇴근
│       ├── employment/     # 근로계약
│       ├── salary/         # 급여명세
│       ├── todo/           # 할 일
│       ├── workplace/      # 사업장 (동적 라우트 [id])
│       └── mypage/         # 마이페이지
│           ├── profile/    # 프로필
│           ├── personal/   # 경력/인사정보
│           ├── certificate/# 자격증
│           ├── account/    # 계좌정보
│           ├── document/   # 서류관리
│           └── withdrawal/ # 회원탈퇴
├── components/             # 컴포넌트
│   ├── ui/                 # 공통 UI (Header, Footer, SubHeader, Controllers)
│   ├── login/              # 로그인 관련
│   ├── main/               # 메인/대시보드
│   ├── commute/            # 출퇴근
│   ├── employment/         # 근로계약
│   ├── salary/             # 급여
│   ├── todo/               # 할 일
│   ├── workplace/          # 사업장
│   ├── mypage/             # 마이페이지
│   ├── popup/              # 팝업 (QR, AI채팅, 비밀번호변경, 서명 등)
│   ├── bottomSheet/        # 바텀시트 (매장선택, 은행선택, 아바타 등)
│   └── publist/            # 퍼블리싱 목록
├── store/                  # Zustand 스토어
│   ├── usePopupController.ts       # 팝업 상태 관리 (10개)
│   └── useBottomSheetController.ts # 바텀시트 상태 관리 (12개)
├── data/                   # 정적 데이터
│   └── SubMenuData.ts      # 네비게이션 메뉴 데이터
└── styles/                 # SCSS 7-1 패턴
    ├── abstracts/          # 변수, 믹스인
    ├── base/               # 리셋, 폰트, 입력필드, 버튼
    ├── components/         # 컴포넌트별 스타일
    ├── layout/             # 레이아웃, 팝업, 바텀시트
    └── style.scss          # 메인 엔트리포인트
```

# 주요 아키텍처 패턴

- **라우트 그룹**: `(auth)`, `(sub)`으로 URL 영향 없이 레이아웃 분리
- **컨트롤러 패턴**: PopupController, BottomSheetController가 루트 레이아웃에서 모든 모달을 중앙 관리
- **선택적 구독**: Zustand 셀렉터로 필요한 상태만 구독하여 리렌더링 최소화
- **경로 별칭**: `@/*` → `./src/*` (tsconfig paths)

# 코딩 규칙

- 컴포넌트 파일명: PascalCase (예: `CommuteCheck.tsx`)
- 스토어 파일명: camelCase `use` 접두사 (예: `usePopupController.ts`)
- 스타일 파일명: SCSS partial `_` 접두사 (예: `_variables.scss`)
- 클라이언트 컴포넌트: 인터랙션이 필요한 경우 `'use client'` 선언
- 이미지 경로: `/assets/images/{common|contents|layout|popup}/`
