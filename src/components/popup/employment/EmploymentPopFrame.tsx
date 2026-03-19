'use client'

import { usePopupController } from '@/store/usePopupController'
import { useEffect, useState, useRef } from 'react'
import BeforeEmployment from '@/components/popup/employment/employcont/BeforeEmployment'
import EmploySuccess from '@/components/popup/employment/employcont/EmploySuccess'

export default function EmploymentPopFrame() {
  const [active, setActive] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null) // 팝업 내부 스크롤을 상단으로 이동하기 위한 ref

  const EmploymentPopFrame = usePopupController((state) => state.EmploymentPopFrame)
  const setEmploymentPopFrame = usePopupController((state) => state.setEmploymentPopFrame)
  const step = usePopupController((state) => state.EmploymentStep) // 전역 상태에서 step 가져오기
  const setEmploymentStep = usePopupController((state) => state.setEmploymentStep)

  useEffect(() => {
    // step이 변경될 때 popup 내부 스크롤을 상단으로 이동
    if (popupRef.current) {
      popupRef.current.scrollTo(0, 0)
    }
  }, [step])

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
                  <span>힘이나는커피생활 을지로3가점</span>
                  과<br /> 근로계약 체결을 완료 하였습니다.
                </>
              ) : (
                <>
                  <span>힘이나는커피생활 을지로3가점</span>
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
