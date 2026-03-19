'use client'

import { usePopupController } from '@/store/usePopupController'
import { useEffect, useState } from 'react'

export default function ContractHistoryPop() {
  const [active, setActive] = useState(false)
  const ContractHistoryPopup = usePopupController((state) => state.ContractHistoryPopup)
  const setContractHistoryPopup = usePopupController((state) => state.setContractHistoryPopup)

  useEffect(() => {
    // 팝업 열기 시간 필요
    setTimeout(() => {
      setActive(ContractHistoryPopup)
    }, 100)
  }, [ContractHistoryPopup])

  // 팝업 닫기 시간 필요
  const handleClose = () => {
    setActive(false)
    setTimeout(() => {
      setContractHistoryPopup(false)
    }, 250)
  }

  return (
    <div className={`modal-popup full ${active ? 'act' : ''}`}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header min">
            <h3>계약 이력</h3>
            <button className="modal-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="pop-cont-wrap">
              <div className="pop-cont-item">
                <div className="contract-num">3</div>
                <div className="contract-info">
                  <div className="contract-info-item">
                    <div className="contract-info-item-tit">계약서 전송일시</div>
                    <div className="contract-info-item-desc">2025.01.03 02:28:00</div>
                  </div>
                  <div className="contract-info-item">
                    <div className="contract-info-item-tit">계약서 열람일시</div>
                    <div className="contract-info-item-desc">2025.01.03 02:28:00</div>
                  </div>
                  <div className="contract-info-item">
                    <div className="contract-info-item-tit">전자서명 일시</div>
                    <div className="contract-info-item-desc">2025.01.03 02:28:00</div>
                  </div>
                  <div className="contract-info-item">
                    <div className="contract-info-item-tit">서명자 정보</div>
                    <div className="contract-info-item-desc">홍길동 (Ka123345)</div>
                  </div>
                </div>
              </div>
              <div className="pop-cont-item">
                <div className="contract-num">2</div>
                <div className="contract-info">
                  <div className="contract-info-item">
                    <div className="contract-info-item-tit">계약서 전송일시</div>
                    <div className="contract-info-item-desc">2025.01.03 02:28:00</div>
                  </div>
                  <div className="contract-info-item">
                    <div className="contract-info-item-tit">계약서 열람일시</div>
                    <div className="contract-info-item-desc">2025.01.03 02:28:00</div>
                  </div>
                  <div className="contract-info-item">
                    <div className="contract-info-item-tit">전자서명 일시</div>
                    <div className="contract-info-item-desc">2025.01.03 02:28:00</div>
                  </div>
                  <div className="contract-info-item">
                    <div className="contract-info-item-tit">서명자 정보</div>
                    <div className="contract-info-item-desc">홍길동 (Ka123345)</div>
                  </div>
                </div>
              </div>
              <div className="pop-cont-item">
                <div className="contract-num">1</div>
                <div className="contract-info">
                  <div className="contract-info-item">
                    <div className="contract-info-item-tit">계약서 전송일시</div>
                    <div className="contract-info-item-desc">2025.01.03 02:28:00</div>
                  </div>
                  <div className="contract-info-item">
                    <div className="contract-info-item-tit">계약서 열람일시</div>
                    <div className="contract-info-item-desc">2025.01.03 02:28:00</div>
                  </div>
                  <div className="contract-info-item">
                    <div className="contract-info-item-tit">전자서명 일시</div>
                    <div className="contract-info-item-desc">2025.01.03 02:28:00</div>
                  </div>
                  <div className="contract-info-item">
                    <div className="contract-info-item-tit">서명자 정보</div>
                    <div className="contract-info-item-desc">홍길동 (Ka123345)</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="contract-history-btn-wrap">
              <button className="btn-form login block">
                더보기 <i className="more"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
