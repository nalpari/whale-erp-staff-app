'use client'
import { usePopupController } from '@/store/usePopupController'

export default function CommuteCheck() {
  const setQrCodePopup = usePopupController((state) => state.setQrCodePopup)

  return (
    <div className="commute-contents-body">
      <div className="commute-date-wrap">
        <div className="badge-day">오늘</div>
        <div className="commute-date">2026년 1월 5일 (월)</div>
      </div>
      <div className="commute-guide-wrap">
        <span>근무시간은 휴게시간이 포함되어 실제 근로시간과 다를 수 있습니다</span>
      </div>
      <div className="commute-store-list">
        <div className="commute-store-item">
          <div className="commute-store-header">
            <div className="commute-store-header-tit">힘이나는 커피생활 을지로 3가점</div>
            <div className="commute-store-header-time">08:00-18:00</div>
          </div>
          <div className="commute-store-body">
            <div className="commute-store-body-item">
              <div className="commute-store-body-item-tit">출근기록</div>
              <div className="commute-store-body-item-time none">-</div>
            </div>
            <div className="commute-store-body-item">
              <div className="commute-store-body-item-tit">퇴근기록</div>
              <div className="commute-store-body-item-time ">18:00</div>
            </div>
            <div className="commute-store-body-item">
              <div className="commute-store-body-item-tit">근무시간</div>
              <div className="commute-store-body-item-time none">출근 미체크</div>
            </div>
          </div>
        </div>
        <div className="commute-store-item">
          <div className="commute-store-header">
            <div className="commute-store-header-tit">바나프레소 교대점</div>
            <div className="commute-store-header-time">08:00-18:00</div>
          </div>
          <div className="commute-store-body">
            <div className="commute-store-body-item">
              <div className="commute-store-body-item-tit">출근기록</div>
              <div className="commute-store-body-item-time">08:00</div>
            </div>
            <div className="commute-store-body-item">
              <div className="commute-store-body-item-tit">퇴근기록</div>
              <div className="commute-store-body-item-time ">18:00</div>
            </div>
            <div className="commute-store-body-item">
              <div className="commute-store-body-item-tit">근무시간</div>
              <div className="commute-store-body-item-time ">2시간10분</div>
            </div>
          </div>
        </div>
      </div>
      <div className="commute-btn-wrap">
        <button className="btn-form block login" onClick={() => setQrCodePopup(true)}>
          출퇴근 체크
        </button>
      </div>
    </div>
  )
}
