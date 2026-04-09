'use client'

import { useState } from 'react'
import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { useValidateEmployee, useLinkEmployee } from '@/hooks/queries/use-workplace-queries'
import { useWorkplaceStore } from '@/store/useWorkplaceStore'

type Step = 'input' | 'confirm'

export default function WorkPlaceAddSheet() {
  const workPlaceAddSheet = useBottomSheetController((state) => state.workPlaceAddSheet)
  const setWorkPlaceAddSheet = useBottomSheetController((state) => state.setWorkPlaceAddSheet)
  const fetchWorkplaces = useWorkplaceStore((s) => s.fetchWorkplaces)

  const [step, setStep] = useState<Step>('input')
  const [employeeNumber, setEmployeeNumber] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [confirmedInfo, setConfirmedInfo] = useState<{ employeeName?: string; workplaceName?: string } | null>(null)
  const [linkToken, setLinkToken] = useState<string | null>(null)

  const { mutate: validate, isPending: isValidating } = useValidateEmployee()
  const { mutate: link, isPending: isLinking } = useLinkEmployee()

  const handleClose = () => {
    setWorkPlaceAddSheet(false)
  }

  // 닫기 애니메이션 완료 후 상태 초기화 (setTimeout 하드코딩 대신 onCloseEnd 활용)
  const handleCloseEnd = () => {
    setStep('input')
    setEmployeeNumber('')
    setErrorMsg('')
    setConfirmedInfo(null)
    setLinkToken(null)
  }

  // Step 1: 직원 코드 유효성 확인
  const handleValidate = () => {
    const trimmed = employeeNumber.trim()
    if (!trimmed) {
      setErrorMsg('직원 코드를 입력해주세요.')
      return
    }
    setErrorMsg('')
    validate(
      { employeeNumber: trimmed },
      {
        onSuccess: (res) => {
          if (res.data.valid) {
            setConfirmedInfo({
              employeeName: res.data.employeeName,
              workplaceName: res.data.workplaceName,
            })
            setLinkToken(res.data.linkToken ?? null)
            setStep('confirm')
          } else {
            setErrorMsg('전화번호가 일치하지 않거나 유효하지 않은 직원 코드입니다.')
          }
        },
        onError: (err) => {
          console.error('[WorkPlaceAdd] 직원 코드 검증 실패:', err)
          setErrorMsg('유효하지 않은 직원 코드입니다.')
        },
      },
    )
  }

  // Step 2: 실제 연결 저장
  const handleLink = () => {
    link(
      { employeeNumber: employeeNumber.trim(), linkToken: linkToken ?? undefined },
      {
        onSuccess: () => {
          fetchWorkplaces()
          handleClose()
        },
        onError: (err) => {
          console.error('[WorkPlaceAdd] 직원 연결 실패:', err)
          setErrorMsg('연결에 실패했습니다. 다시 시도해주세요.')
          setStep('input')
        },
      },
    )
  }

  return (
    <Sheet
      isOpen={workPlaceAddSheet}
      onClose={handleClose}
      onCloseEnd={handleCloseEnd}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>근무처 추가</h3>
            </div>

            {step === 'input' && (
              <>
                <div className="bottom-sheet-body">
                  <div className="filed-wrap">
                    <div className="filed-item">
                      <div className="filed-item-tit">
                        사장님께 받은 직원 코드 입력 <span className="imp">*</span>
                      </div>
                      <div className="block">
                        <input
                          type="text"
                          className="input-frame"
                          placeholder="직원 코드를 입력하세요."
                          value={employeeNumber}
                          onChange={(e) => {
                            setEmployeeNumber(e.target.value)
                            setErrorMsg('')
                          }}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleValidate() }}
                          disabled={isValidating}
                        />
                      </div>
                      {errorMsg && (
                        <div className="msg error mt10">{errorMsg}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="sheet-btn-wrap">
                  <button
                    className="btn-form login block"
                    onClick={handleValidate}
                    disabled={isValidating}
                  >
                    {isValidating ? '확인 중...' : '확인'}
                  </button>
                </div>
              </>
            )}

            {step === 'confirm' && (
              <>
                <div className="bottom-sheet-body">
                  <div className="filed-wrap">
                    <div className="filed-item">
                      <div className="filed-item-tit">직원 코드</div>
                      <div className="block">
                        <input
                          type="text"
                          className="input-frame"
                          value={employeeNumber}
                          readOnly
                        />
                      </div>
                    </div>
                    {confirmedInfo?.workplaceName && (
                      <div className="filed-item">
                        <div className="filed-item-tit">근무처</div>
                        <div className="block">
                          <input
                            type="text"
                            className="input-frame"
                            value={confirmedInfo.workplaceName}
                            readOnly
                          />
                        </div>
                      </div>
                    )}
                    {confirmedInfo?.employeeName && (
                      <div className="filed-item">
                        <div className="filed-item-tit">직원명</div>
                        <div className="block">
                          <input
                            type="text"
                            className="input-frame"
                            value={confirmedInfo.employeeName}
                            readOnly
                          />
                        </div>
                      </div>
                    )}
                    <div className="msg success mt10">유효한 직원 코드입니다. 저장하시겠습니까?</div>
                    {errorMsg && (
                      <div className="msg error mt10">{errorMsg}</div>
                    )}
                  </div>
                </div>
                <div className="sheet-btn-wrap">
                  <button
                    className="btn-form gray block"
                    onClick={() => { setStep('input'); setErrorMsg('') }}
                    disabled={isLinking}
                  >
                    다시 입력
                  </button>
                  <button
                    className="btn-form login block"
                    onClick={handleLink}
                    disabled={isLinking}
                  >
                    {isLinking ? '저장 중...' : '저장'}
                  </button>
                </div>
              </>
            )}
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  )
}
