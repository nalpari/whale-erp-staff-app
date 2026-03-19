'use client'
import { useBottomSheetController } from '@/store/useBottomSheetController'

export default function CommuteWork() {
  const setCommuteDaySelectSheet = useBottomSheetController((state) => state.setCommuteDaySelectSheet)
  return (
    <div className="commute-contents-body">
      <div className="commute-work-date-wrap">
        <div className="commute-work-date">2025.12.08(월) ~ 2025.12.15(일)</div>
        <button className="data-list-arr" onClick={() => setCommuteDaySelectSheet(true)}></button>
      </div>
      <div className="commute-work-list">
        <div className="commute-work-list-item">
          <div className="commute-work-list-item-date">
            {/* <div className="badge-day">오늘</div> */}
            <span className="num">8</span>
            <span>월요일</span>
          </div>
          <div className="commute-work-list-item-cont">
            <div className="work-store-tit">힘이나는 커피생활 을지로 3가점</div>
            <ul className="work-commute-list">
              <li className="work-commute-list-item">출근 08:00</li>
              <li className="work-commute-list-item">퇴근 18:00</li>
            </ul>
            <div className="work-commute-time">
              <div className="work-badge g">근무시간</div>
              <div className="work-time">8시간</div>
            </div>
          </div>
        </div>
        <div className="commute-work-list-item">
          <div className="commute-work-list-item-date">
            {/* <div className="badge-day">오늘</div> */}
            <span className="num">9</span>
            <span>화요일</span>
          </div>
          <div className="commute-work-list-item-cont">
            <div className="work-store-tit">힘이나는 커피생활 을지로 3가점</div>
            <ul className="work-commute-list">
              <li className="work-commute-list-item">출근 08:00</li>
              <li className="work-commute-list-item">퇴근 18:00</li>
            </ul>
            <div className="work-commute-time">
              <div className="work-badge r">결근</div>
              <div className="work-time"></div>
            </div>
          </div>
        </div>
        <div className="commute-work-list-item">
          <div className="commute-work-list-item-date">
            {/* <div className="badge-day">오늘</div> */}
            <span className="num">10</span>
            <span>수요일</span>
          </div>
          <div className="commute-work-list-item-cont">
            <div className="work-store-tit">힘이나는 커피생활 을지로 3가점</div>
            <ul className="work-commute-list">
              <li className="work-commute-list-item">출근 08:00</li>
              <li className="work-commute-list-item">퇴근 -</li>
            </ul>
            <div className="work-commute-time">
              <div className="work-badge o">퇴근 미체크</div>
              <div className="work-time"></div>
            </div>
          </div>
        </div>
        <div className="commute-work-list-item">
          <div className="commute-work-list-item-date">
            {/* <div className="badge-day">오늘</div> */}
            <span className="num">11</span>
            <span>목요일</span>
          </div>
          <div className="commute-work-list-item-cont">
            <div className="work-store-tit">힘이나는 커피생활 을지로 3가점</div>
            <ul className="work-commute-list">
              <li className="work-commute-list-item">출근 -</li>
              <li className="work-commute-list-item">퇴근 18:00</li>
            </ul>
            <div className="work-commute-time">
              <div className="work-badge o">출근 미체크</div>
              <div className="work-time"></div>
            </div>
          </div>
        </div>
        <div className="commute-work-list-item">
          <div className="commute-work-list-item-date">
            <div className="badge-day">오늘</div>
            <span className="num">12</span>
            <span>금요일</span>
          </div>
          <div className="commute-work-list-item-cont">
            <div className="empty-work">근무일정 없음</div>
          </div>
        </div>
      </div>
    </div>
  )
}
