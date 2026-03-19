'use client'

import { usePopupController } from '@/store/usePopupController'

export default function SignPopup() {
  // 필요한 함수만 선택적으로 구독
  const setSignPopup = usePopupController((state) => state.setSignPopup)
  const setEmploymentStep = usePopupController((state) => state.setEmploymentStep)

  const handleSave = () => {
    setEmploymentStep(true) // step을 true로 변경
    setSignPopup(false) // SignPopup 닫기
  }

  const handleCancel = () => {
    setSignPopup(false) // SignPopup 닫기
  }

  return (
    <div className="modal-popup">
      <div className="modal-dialog min">
        <div className="modal-content">
          <div className="modal-header">
            <h1></h1>
            <button className="modal-close" onClick={handleCancel}></button>
          </div>
          <div className="modal-body">
            <div className="pop-frame">
              <div className="sign-frame-header">
                <div className="sign-frame-tit">SIGN을 해주세요</div>
                <button className="sign-reset"></button>
              </div>
              <div
                className="qr-cam-area"
                style={{ height: '175px', backgroundColor: '#FFF', border: ' 1px solid #EBEBEB' }}
              ></div>
              <div className="qr-btn-wrap">
                <button className="btn-form outline block" onClick={handleCancel}>
                  취소
                </button>
                <button className="btn-form login block" onClick={handleSave}>
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
