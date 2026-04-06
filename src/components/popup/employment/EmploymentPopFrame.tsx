'use client'

import { usePopupController } from '@/store/usePopupController'
import { useContractDetail } from '@/hooks/queries/use-contract-queries'
import { useEffect, useState, useRef } from 'react'
import BeforeEmployment from '@/components/popup/employment/employcont/BeforeEmployment'
import EmploySuccess from '@/components/popup/employment/employcont/EmploySuccess'

export default function EmploymentPopFrame() {
  const [active, setActive] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  const EmploymentPopFrame = usePopupController((state) => state.EmploymentPopFrame)
  const setEmploymentPopFrame = usePopupController((state) => state.setEmploymentPopFrame)
  const selectedContractId = usePopupController((state) => state.selectedContractId)
  const step = usePopupController((state) => state.EmploymentStep)
  const setEmploymentStep = usePopupController((state) => state.setEmploymentStep)

  useEffect(() => {
    if (popupRef.current) {
      popupRef.current.scrollTo(0, 0)
    }
  }, [step])

  const { data: contractDetailData } = useContractDetail(
    selectedContractId,
    !!selectedContractId && EmploymentPopFrame,
  )
  const storeName =
    contractDetailData?.data?.company?.storeName ??
    contractDetailData?.data?.company?.companyName ??
    ''

  useEffect(() => {
    // 팝업 열기 시간 필요
    setTimeout(() => {
      setActive(EmploymentPopFrame)
    }, 100)
  }, [EmploymentPopFrame])

  useEffect(() => {
    // 팝업이 닫힐 때 step 초기화
    if (!EmploymentPopFrame) {
      setEmploymentStep(false)
    }
  }, [EmploymentPopFrame, setEmploymentStep])

  // 팝업 닫기 시간 필요
  const handleClose = () => {
    setActive(false)
    setTimeout(() => {
      setEmploymentPopFrame(false)
    }, 250)
  }

  return (
    <div ref={popupRef} className={`modal-popup full ${active ? 'act' : ''}`}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3>
              {step ? (
                <>
                  <span>{storeName}</span>
                  과<br /> 근로계약 체결을 완료 하였습니다.
                </>
              ) : (
                <>
                  <span>{storeName}</span>
                  과<br /> 근로계약을 체결합니다.
                </>
              )}
            </h3>
            <button className="modal-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">{step ? <EmploySuccess /> : <BeforeEmployment />}</div>
        </div>
      </div>
    </div>
  )
}
