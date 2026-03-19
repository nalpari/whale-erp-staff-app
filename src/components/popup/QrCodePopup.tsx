import { usePopupController } from '@/store/usePopupController'

export default function QrCodePopup() {
  // 함수만 구독
  const setQrCodePopup = usePopupController((state) => state.setQrCodePopup)
  return (
    <div className="modal-popup">
      <div className="modal-dialog min">
        <div className="modal-content">
          <div className="modal-header">
            <h1></h1>
            <button className="modal-close" onClick={() => setQrCodePopup(false)}></button>
          </div>
          <div className="modal-body">
            <div className="pop-frame">
              <div className="qr-frame-header">
                <div className="qr-frame-tit">출퇴근 체크</div>
                <div className="qr-frame-txt">2026년 1월5일 화요일</div>
              </div>
              <div className="qr-cam-area" style={{ height: '175px', backgroundColor: '#101010' }}></div>
              <div className="qr-btn-wrap">
                <button className="btn-form login block">출근하기</button>
                <button className="btn-form outline block">퇴근하기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
