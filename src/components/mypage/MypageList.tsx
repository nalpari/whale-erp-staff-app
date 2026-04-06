'use client'
import { useRouter } from 'next/navigation'

export default function MypageList() {
  const router = useRouter()
  return (
    <div className="data-wrap">
      <div className="data-list">
        <button className="data-item" onClick={() => router.push('/mypage/profile')}>
          <div className="mypage-item-inner">
            <div className="mypage-item-info">
              <div className="mypage-item-info-name">프로필</div>
              <div className="mypage-item-info-desc">계정 정보를 확인 하고 수정할 수 있습니다.</div>
            </div>
            <div className="mypage-item-arr">
              <div className="data-list-arr"></div>
            </div>
          </div>
        </button>
        <button className="data-item" onClick={() => router.push('/mypage/account')}>
          <div className="mypage-item-inner">
            <div className="mypage-item-info">
              <div className="mypage-item-info-name">급여 계좌 정보</div>
              <div className="mypage-item-info-desc">급여 지급을 위한 계좌 정보를 등록 수정할 수 있습니다.</div>
            </div>
            <div className="mypage-item-arr">
              <div className="data-list-arr"></div>
            </div>
          </div>
        </button>
        <button className="data-item" onClick={() => router.push('/mypage/personal')}>
          <div className="mypage-item-inner">
            <div className="mypage-item-info">
              <div className="mypage-item-info-name">경력 관리</div>
              <div className="mypage-item-info-desc">근무 이력과 경력 정보를 기록하고 관리할 수 있습니다.</div>
            </div>
            <div className="mypage-item-arr">
              <div className="data-list-arr"></div>
            </div>
          </div>
        </button>
        <button className="data-item" onClick={() => router.push('/mypage/certificate')}>
          <div className="mypage-item-inner">
            <div className="mypage-item-info">
              <div className="mypage-item-info-name">자격증  관리</div>
              <div className="mypage-item-info-desc">보유 자격증 정보를 등록하고 관리할 수 있습니다.</div>
            </div>
            <div className="mypage-item-arr">
              <div className="data-list-arr"></div>
            </div>
          </div>
        </button>
        <button className="data-item" onClick={() => router.push('/mypage/document')}>
          <div className="mypage-item-inner">
            <div className="mypage-item-info">
              <div className="mypage-item-info-name">서류관리</div>
              <div className="mypage-item-info-desc">근로 관련 서류를 등록하고 제출 상태를 관리합니다.</div>
            </div>
            <div className="mypage-item-arr">
              <div className="data-list-arr"></div>
            </div>
          </div>
        </button>
        <button className="data-item" onClick={() => router.push('/mypage/withdrawal')}>
          <div className="mypage-item-inner">
            <div className="mypage-item-info red">
              <div className="mypage-item-info-name">회원 탈퇴</div>
              <div className="mypage-item-info-desc">탈퇴 전 유의사항을 확인해 주세요</div>
            </div>
            <div className="mypage-item-arr">
              <div className="data-list-arr"></div>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
