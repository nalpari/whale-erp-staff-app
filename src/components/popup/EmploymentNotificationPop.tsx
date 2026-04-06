'use client'

import { usePopupController } from '@/store/usePopupController'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EmploymentNotificationPop() {
  const router = useRouter()
  const [active, setActive] = useState(false)
  const EmploymentNotificationPopup = usePopupController((state) => state.EmploymentNotificationPopup)
  const setEmploymentNotificationPopup = usePopupController((state) => state.setEmploymentNotificationPopup)
  const pendingContracts = usePopupController((state) => state.pendingContracts)

  useEffect(() => {
    setTimeout(() => {
      setActive(EmploymentNotificationPopup)
    }, 100)
  }, [EmploymentNotificationPopup])

  const handleClose = () => {
    setActive(false)
    setTimeout(() => {
      setEmploymentNotificationPopup(false)
    }, 250)
  }

  const handleContract = (contractId: number) => {
    handleClose()
    // 근로계약 상세/체결 페이지로 이동
    router.push(`/employment?contractId=${contractId}`)
  }

  if (pendingContracts.length === 0) return null

  return (
    <div className={`modal-popup full ${active ? 'act' : ''}`}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3>
              <span>
                근로 계약 {pendingContracts.length}건의
                <br />
              </span>
              요청이 있습니다.
            </h3>
            <button className="modal-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="pop-cont-wrap">
              {pendingContracts.map((contract) => (
                <div className="pop-cont-item" key={contract.id}>
                  <div className="cont-item-tit">근무처</div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      readOnly
                      defaultValue={contract.storeName}
                    />
                  </div>
                  <div className="cont-btn-wrap">
                    <button
                      className="btn-form login block"
                      onClick={() => handleContract(contract.id)}
                    >
                      근로계약 체결
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
