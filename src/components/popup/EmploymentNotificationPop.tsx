'use client'

import { usePopupController } from '@/store/usePopupController'
import { useEffect, useState } from 'react'
import { useBottomSheetController } from '@/store/useBottomSheetController'

export default function EmploymentNotificationPop() {
  const [active, setActive] = useState(false)
  const EmploymentNotificationPopup = usePopupController((state) => state.EmploymentNotificationPopup)
  const setEmploymentNotificationPopup = usePopupController((state) => state.setEmploymentNotificationPopup)
  const setEmploymentNotificationSheet = useBottomSheetController((state) => state.setEmploymentNotificationSheet)

  useEffect(() => {
    // 팝업 열기 시간 필요
    setTimeout(() => {
      setActive(EmploymentNotificationPopup)
    }, 100)
  }, [EmploymentNotificationPopup])

  // 팝업 닫기 시간 필요
  const handleClose = () => {
    setActive(false)
    setTimeout(() => {
      setEmploymentNotificationPopup(false)
    }, 250)
  }
  return (
    <div className={`modal-popup full ${active ? 'act' : ''}`}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3>
              <span>
                직원초대 3건, 근로 계약 3건의
                <br />
              </span>
              요청이 있습니다.
            </h3>
            <button className="modal-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="pop-cont-wrap">
              <div className="pop-cont-item">
                <div className="cont-item-tit">근무처</div>
                <div className="block">
                  <input type="text" className="input-frame" readOnly defaultValue="근무처 1" />
                </div>
                <div className="cont-btn-wrap">
                  <button className="btn-form login block" onClick={() => setEmploymentNotificationSheet(true)}>
                    추가
                  </button>
                  <button className="btn-form login block">근로계약 체결</button>
                </div>
              </div>
              <div className="pop-cont-item">
                <div className="cont-item-tit">근무처</div>
                <div className="block">
                  <input type="text" className="input-frame" readOnly defaultValue="근무처 2" />
                </div>
                <div className="cont-btn-wrap">
                  <button className="btn-form login block" onClick={() => setEmploymentNotificationSheet(true)}>
                    추가
                  </button>
                  <button className="btn-form login block">근로계약 체결</button>
                </div>
              </div>
              <div className="pop-cont-item">
                <div className="cont-item-tit">근무처</div>
                <div className="block">
                  <input type="text" className="input-frame" readOnly defaultValue="근무처 3" />
                </div>
                <div className="cont-btn-wrap">
                  <button className="btn-form login block" onClick={() => setEmploymentNotificationSheet(true)}>
                    추가
                  </button>
                  <button className="btn-form login block">근로계약 체결</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
