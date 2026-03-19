'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { usePathname, useRouter } from 'next/navigation'
import { usePopupController } from '@/store/usePopupController'
import { SubMenuData } from '@/data/SubMenuData'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()

  // 서브 페이지 타이틀
  const title = SubMenuData.find((item: { path: string }) => {
    // [id] 같은 동적 세그먼트를 정규식으로 변환
    const pattern = item.path.replace(/\[.*?\]/g, '[^/]+')
    const regex = new RegExp(`^${pattern}$`)
    return regex.test(pathname)
  })?.title

  // 필요한 함수만 선택적으로 구독 (함수는 변하지 않으므로 재렌더링 방지)
  const setPasswordChangePopup = usePopupController((state) => state.setPasswordChangePopup)
  const setStoreSheet = useBottomSheetController((state) => state.setStoreSheet)
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)

  const segments = pathname.split('/').filter(Boolean)
  const isSubPage = segments.length >= 2

  const handleBack = () => {
    router.back()
  }

  // 비밀번호 변경 팝업 열기
  const PasswordChangePopup = () => {
    setPasswordChangePopup(true)
    setIsSideNavOpen(false)
  }

  if (pathname === '/login' || pathname === '/list') {
    return null
  }

  if (isSubPage || pathname === '/request' || pathname === '/signup') {
    return (
      <div className="sub-header">
        <div className="sub-header-inner">
          <div className="sub-header-back">
            <button onClick={handleBack}></button>
          </div>
          <h1 className="sub-header-title">{title}</h1>
        </div>
      </div>
    )
  }
  return (
    <header className={`${pathname === '/mypage' ? 'mypage' : ''}`}>
      <div className="header-inner">
        <div className="header-top">
          <div className="header-data-wrap" onClick={() => router.push('/list')}>
            <div className="header-data-img">
              <Image src="/assets/images/common/avatar_icon.svg" alt="header-data-img" fill />
            </div>
            <ul className="header-data-list">
              <li className="header-data-item">
                <span>홍길동</span> 과장
              </li>
              <li className="header-data-item">매장 매니저</li>
            </ul>
          </div>
          <div className="header-menu-btn">
            <button className="home-btn" onClick={() => router.push('/')}></button>
            <button className="menu-btn" onClick={() => setIsSideNavOpen(true)}></button>
          </div>
        </div>
        {pathname !== '/mypage' && (
          <div className="header-body">
            <div className="header-store-btn">
              <button className="select-btn" onClick={() => setStoreSheet(true)}>
                <span>힘이 나는 커피생활 을지로3가점</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <div className={`side-nav-wrap ${isSideNavOpen ? 'act' : ''}`}>
        <div className="side-nav-inner">
          <div className="side-nav-header">
            <div className="side-nav-header-inner">
              <div className="side-nav-header-icon">
                <Image src="/assets/images/common/avatar_icon.svg" alt="side-nav-header-icon" fill />
              </div>
              <div className="side-nav-header-info">
                <div className="side-nav-header-name">
                  <span>홍길동</span>님 환영 합니다.
                </div>
                <div className="side-nav-header-company">Interplug corp.</div>
              </div>
            </div>
            <button className="side-close-btn" onClick={() => setIsSideNavOpen(false)}></button>
          </div>
          <div className="side-nav-logout-wrap">
            <button className="btn-form black block" onClick={() => router.push('/login')}>
              로그아웃
            </button>
          </div>
          <div className="side-nav-body">
            <ul className="side-nav-body-list">
              <li className="side-nav-body-item">
                <Link href="/mypage" onClick={() => setIsSideNavOpen(false)}>
                  나의 정보관리
                </Link>
              </li>
              <li className="side-nav-body-item">
                <button onClick={PasswordChangePopup}>비밀번호 변경</button>
              </li>
              <li className="side-nav-body-item">
                <Link href="/commute" onClick={() => setIsSideNavOpen(false)}>
                  출퇴근 체크
                </Link>
              </li>
              <li className="side-nav-body-item">
                <Link href="/employment" onClick={() => setIsSideNavOpen(false)}>
                  근로계약
                </Link>
              </li>
              <li className="side-nav-body-item">
                <Link href="/salary" onClick={() => setIsSideNavOpen(false)}>
                  급여명세서
                </Link>
              </li>
              <li className="side-nav-body-item">
                <Link href="/todo" onClick={() => setIsSideNavOpen(false)}>
                  TO-DO 체크
                </Link>
              </li>
              <li className="side-nav-body-item">
                <Link href="/workplace" onClick={() => setIsSideNavOpen(false)}>
                  근무처/급여계좌 설정
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}
