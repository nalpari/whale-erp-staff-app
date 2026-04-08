'use client'
import { usePopupController } from '@/store/usePopupController'

export default function MainContents() {
  // 함수만 구독 (함수 레퍼런스는 변하지 않음)
  const setQrCodePopup = usePopupController((state) => state.setQrCodePopup)
  const setAIChatPopup = usePopupController((state) => state.setAIChatPopup)

  return (
    <div className="container main">
      <div className="main-contents">
        <div className="dtae-calendar-wrap"></div>
        <div className="date-list-wrap">
          <div className="date-list-header">
            <div className="date-list-tit">12월 7일 금요일</div>
            <div className="data-jop-wrap">
              <div className="data-jop work">근무: 2일</div>
              <div className="data-jop todo">TO-DO: 8개</div>
            </div>
          </div>
          <ul className="date-cont-list">
            <li className="date-cont-item">
              <div className="date-cont-header">
                <div className="date-cont-ring" style={{ backgroundColor: '#88BDD4' }}></div>
                <div className="date-cont-info">
                  <div className="date-cont-info-name">힘이나는 커피생활 을지로 3가점</div>
                  <div className="date-cont-info-time">10:00-18:00</div>
                </div>
              </div>
              <div className="date-cont-wrap">
                <div className="date-cont-data-item">
                  <div className="cont-item-tit work">출퇴근 체크</div>
                  <div className="cont-item-data-wrap">
                    <div className="data-item-inner">
                      <div className="data-item-inner-item">
                        <span>출근 </span>08:00
                      </div>
                      <div className="data-item-inner-item">
                        <span>퇴근 </span>18:00
                      </div>
                    </div>
                    <div className="data-item-inner-arr"></div>
                  </div>
                </div>
                <div className="date-cont-data-item">
                  <div className="cont-item-tit todo">TO-DO 체크</div>
                  <div className="cont-item-data-wrap">
                    <div className="data-item-inner">
                      <div className="data-item-inner-item">
                        <span>미완료 </span>0
                      </div>
                      <div className="data-item-inner-item">
                        <span>완료 </span>4
                      </div>
                    </div>
                    <div className="data-item-inner-arr"></div>
                  </div>
                </div>
              </div>
            </li>
            <li className="date-cont-item">
              <div className="date-cont-header">
                <div className="date-cont-ring" style={{ backgroundColor: '#B1D488' }}></div>
                <div className="date-cont-info">
                  <div className="date-cont-info-name">바나프레소 교대점</div>
                  <div className="date-cont-info-time">10:00-18:00</div>
                </div>
              </div>
              <div className="date-cont-wrap">
                <div className="date-cont-data-item">
                  <div className="cont-item-tit work">출퇴근 체크</div>
                  <div className="cont-item-data-wrap">
                    <div className="data-item-inner">
                      <div className="data-item-inner-item">
                        <span>출근 </span>08:00
                      </div>
                      <div className="data-item-inner-item">
                        <span>퇴근 </span>18:00
                      </div>
                    </div>
                    <div className="data-item-inner-arr"></div>
                  </div>
                </div>
                <div className="date-cont-data-item">
                  <div className="cont-item-tit todo">TO-DO 체크</div>
                  <div className="cont-item-data-wrap">
                    <div className="data-item-inner">
                      <div className="data-item-inner-item">
                        <span>미완료 </span>0
                      </div>
                      <div className="data-item-inner-item">
                        <span>완료 </span>4
                      </div>
                    </div>
                    <div className="data-item-inner-arr"></div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div className="date-list-footer">
            <button className="btn-form login block" onClick={() => setQrCodePopup(true)}>
              출퇴근 체크
            </button>
          </div>
        </div>
      </div>
      <button className="Ai" onClick={() => setAIChatPopup(true)}></button>
    </div>
  )
}
