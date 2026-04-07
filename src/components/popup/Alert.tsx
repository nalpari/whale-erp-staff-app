'use client'
import { usePopupController } from '@/store/usePopupController'

export default function Alert() {
  const setAlertPopup = usePopupController((state) => state.setAlertPopup)
  const message = usePopupController((state) => state.alertMessage)
  const confirmLabel = usePopupController((state) => state.alertConfirmLabel)
  const cancelLabel = usePopupController((state) => state.alertCancelLabel)
  const onConfirm = usePopupController((state) => state.alertOnConfirm)

  const handleConfirm = () => {
    setAlertPopup(false)
    onConfirm?.()
  }

  const handleCancel = () => {
    setAlertPopup(false)
  }

  return (
    <div className="modal-popup">
      <div className="modal-dialog alert">
        <div className="modal-content">
          <div className="modal-body">
            <div className="alert-wrap">
              <div className="alert-txt">
                {message.split('\n').map((line, i) => (
                  <span key={i}>{line}</span>
                ))}
              </div>
              <div className="alert-btn-wrap">
                {cancelLabel && (
                  <button className="btn-form outline block" onClick={handleCancel}>
                    {cancelLabel}
                  </button>
                )}
                <button className="btn-form login block" onClick={handleConfirm}>
                  {confirmLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
