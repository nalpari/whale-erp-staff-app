'use client'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { useRouter } from 'next/navigation'
export default function WorkPlaceList() {
  const router = useRouter()
  const setWorkPlaceAddSheet = useBottomSheetController((state) => state.setWorkPlaceAddSheet)
  return (
    <div className="data-wrap">
      <div className="data-tit">근무처/급여계좌 설정</div>
      <div className="data-list">
        <button className="data-item" onClick={() => router.push('/workplace/1')}>
          <div className="workplace-item-inner">
            <div className="workplace-info">
              <div className="sub-badge green">근무</div>
              <div className="workplace-info-name">힘이나는커피생활 을지로3가점</div>
              <div className="workplace-info-desc">급여계좌 : 한국은행</div>
            </div>
            <div className="workplace-arr">
              <div className="data-list-arr"></div>
            </div>
          </div>
        </button>
        <button className="data-item" onClick={() => router.push('/workplace/1')}>
          <div className="workplace-item-inner">
            <div className="workplace-info">
              <div className="sub-badge brown">휴직</div>
              <div className="workplace-info-name">힘이나는커피생활 종로3가점</div>
              <div className="workplace-info-desc">급여계좌 : 한국은행</div>
            </div>
            <div className="workplace-arr">
              <div className="data-list-arr"></div>
            </div>
          </div>
        </button>
        <button className="data-item" onClick={() => router.push('/workplace/1')}>
          <div className="workplace-item-inner">
            <div className="workplace-info">
              <div className="sub-badge red">퇴사</div>
              <div className="workplace-info-name">힘이나는커피생활 을지로3가점</div>
              <div className="workplace-info-desc">급여계좌 : 한국은행</div>
            </div>
            <div className="workplace-arr">
              <div className="data-list-arr"></div>
            </div>
          </div>
        </button>
        <div className="data-item">
          <div className="workplace-empty">등록된 매장정보가 없습니다.</div>
        </div>
      </div>
      <div className="data-btn-wrap">
        <button className="btn-form login block" onClick={() => setWorkPlaceAddSheet(true)}>
          근무처 추가
        </button>
      </div>
    </div>
  )
}
