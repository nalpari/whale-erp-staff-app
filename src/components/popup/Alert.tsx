'use client'
import { usePopupController } from '@/store/usePopupController'

export default function Alert() {
  const setAlertPopup = usePopupController((state) => state.setAlertPopup)
  return (
    <div className="modal-popup">
      <div className="modal-dialog alert">
        <div className="modal-content">
          <div className="modal-body">
            <div className="alert-wrap">
              <div className="alert-txt">
                <span>환영합니다!</span>
                <span>회원가입이 완료되었습니다</span>
              </div>
              <div className="alert-btn-wrap">
                <button className="btn-form login block" onClick={() => setAlertPopup(false)}>
                  선택
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
