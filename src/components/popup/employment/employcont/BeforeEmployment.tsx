'use client'

import { useState } from 'react'
import { usePopupController } from '@/store/usePopupController'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { useContractDetail, useRejectContract } from '@/hooks/queries/use-contract-queries'
import { useAccountList } from '@/hooks/queries/use-account-queries'

/**
 * 근무 시간 포맷 (HH:MM:SS → HH:MM)
 */
function formatTime(time: string | null | undefined): string {
  if (!time) return '-'
  return time.substring(0, 5)
}

/**
 * 날짜 포맷 (YYYY-MM-DD)
 */
function formatDate(date: string | null | undefined): string {
  if (!date) return '-'
  return date
}


/**
 * 급여 항목 컴포넌트
 */
function SalaryItem({ label, amount, highlight }: { label: string; amount: number | null | undefined; highlight?: boolean }) {
  return (
    <div className="employcont-item">
      <div className="employcont-item-tit" style={highlight ? { fontWeight: 700 } : undefined}>{label}</div>
      <div className="employcont-item-desc">
        <span style={highlight ? { fontWeight: 700 } : undefined}>{(amount ?? 0).toLocaleString()}원</span>
      </div>
    </div>
  )
}

export default function BeforeEmployment() {
  const setSignPopup = usePopupController((state) => state.setSignPopup)
  const setEmploymentPopFrame = usePopupController((state) => state.setEmploymentPopFrame)
  const selectedContractId = usePopupController((state) => state.selectedContractId)
  const setSelectedSalaryAccountId = usePopupController((state) => state.setSelectedSalaryAccountId)
  const [agreed, setAgreed] = useState(false)
  const [agreeError, setAgreeError] = useState(false)

  // 급여 계좌 선택
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null)
  const [accountError, setAccountError] = useState(false)
  const openAccountSheet = useBottomSheetController((state) => state.openAccountSheet)

  const { data: contractDetailData, isPending: detailPending } =
    useContractDetail(selectedContractId, !!selectedContractId)
  const detail = contractDetailData?.data ?? null
  const hasLoaded = !selectedContractId || !detailPending

  const { data: accountsData, refetch: refetchAccounts } = useAccountList()
  const accounts = accountsData?.data ?? []
  const primaryAccount = accounts.find((a) => a.isPrimary)
  const effectiveAccountId = selectedAccountId ?? primaryAccount?.id ?? accounts[0]?.id ?? null

  const fetchAccounts = () => {
    void refetchAccounts()
  }

  const { mutateAsync: rejectContractMutation, isPending: rejecting } = useRejectContract()

  if (!hasLoaded) {
    return (
      <div className="employcont-container">
        <div className="employcont-wrap">
          <div className="employcont-item">
            <div className="employcont-item-desc" style={{ color: '#999' }}>불러오는 중...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="employcont-container">
        <div className="employcont-wrap">
          <div className="employcont-item">
            <div className="employcont-item-desc" style={{ color: '#999' }}>계약 정보를 불러올 수 없습니다.</div>
          </div>
        </div>
      </div>
    )
  }

  const handleAgree = () => {
    if (!effectiveAccountId) {
      setAccountError(true)
      alert('급여 계좌를 선택해 주세요.')
      return
    }
    if (!agreed) {
      setAgreeError(true)
      return
    }
    setAgreeError(false)
    setAccountError(false)
    setSelectedSalaryAccountId(effectiveAccountId)
    setSignPopup(true)
  }

  const handleReject = async () => {
    if (!selectedContractId) return
    if (!confirm('계약을 거절하시겠습니까?')) return
    try {
      await rejectContractMutation({ id: selectedContractId })
      alert('계약이 거절되었습니다.')
      setEmploymentPopFrame(false)
    } catch (err) {
      console.error('계약 거절 실패:', err)
      alert('계약 거절에 실패했습니다.')
    }
  }

  // 정규직/파트타이머 구분
  const isParttime = detail.contract.contractClassificationCode === 'CNTCFWK_003'
  const isRegular = !isParttime

  // 요일별 근무시간 추출
  const saturdayHour = detail.workHours.find((wh) => wh.dayType === 'SATURDAY')
  const sundayHour = detail.workHours.find((wh) => wh.dayType === 'SUNDAY')

  return (
    <div className="employcont-container">
      <div className="employcont-wrap">
        {/* === 사용자(갑) 정보 === */}
        <div className="employcont-item">
          <div className="employcont-item-tit">회사명</div>
          <div className="employcont-item-desc"><span>{detail.company.companyName ?? '-'}</span></div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">사업자등록번호</div>
          <div className="employcont-item-desc"><span>{detail.company.businessRegistrationNumber ?? '-'}</span></div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">주소</div>
          <div className="employcont-item-desc"><span>{detail.company.companyAddress ?? '-'}</span></div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">대표자명</div>
          <div className="employcont-item-desc"><span>{detail.company.representativeName ?? '-'}</span></div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">대표자 연락처</div>
          <div className="employcont-item-desc"><span>{detail.company.representativePhone ?? '-'}</span></div>
        </div>

        {/* === 취업자(을) 정보 === */}
        <div className="employcont-item">
          <div className="employcont-item-tit">근로자명</div>
          <div className="employcont-item-desc"><span>{detail.employee.employeeName}</span></div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">주민등록번호</div>
          <div className="employcont-item-desc"><span>{detail.employee.employeeSsn ?? '-'}</span></div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">주소</div>
          <div className="employcont-item-desc"><span>{detail.employee.employeeAddress ?? '-'}</span></div>
        </div>

        {/* === 근로장소 (정규직만) === */}
        {isRegular && (
          <div className="employcont-item">
            <div className="employcont-item-tit">근로장소</div>
            <div className="employcont-item-desc">
              <span>{detail.terms?.workPlace ?? '회사 및 기타 업무상 필요가 있을 경우 \'사원\'의 근무장소 또는 업무내용을 변경할 수 있으며, 이 경우 \'사원\'은 특별한 사정이 없는 한 이에 따라야 한다.'}</span>
            </div>
          </div>
        )}

        {/* === 고용형태 === */}
        <div className="employcont-item">
          <div className="employcont-item-tit">고용형태</div>
          <div className="employcont-item-desc"><span>{isParttime ? '파트타이머' : '정규직'}</span></div>
        </div>

        {/* === 계약기간 === */}
        <div className="employcont-item">
          <div className="employcont-item-tit">계약기간</div>
          <div className="employcont-item-desc">
            <span>{formatDate(detail.contract.contractStartDate)} ~ {formatDate(detail.contract.contractEndDate)}</span>
          </div>
        </div>

        {/* === 4대보험 가입 === */}
        <div className="employcont-item">
          <div className="employcont-item-tit">4대보험 가입</div>
          <div className="employcont-item-desc">
            <span>
              {[
                detail.contract.nationalPensionEnrolled && '국민연금',
                detail.contract.healthInsuranceEnrolled && '건강보험',
                detail.contract.employmentInsuranceEnrolled && '고용보험',
                detail.contract.workersCompensationEnrolled && '산재보험',
              ].filter(Boolean).join(', ') || '미가입'}
            </span>
          </div>
        </div>

        {/* === 근무시간 === */}
        {(() => {
          const weekdays = detail.workHours.filter(wh =>
            ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY'].includes(wh.dayType) && wh.isWork
          )
          const workDayNames = weekdays.map(wh => {
            const map: Record<string, string> = { MONDAY: '월', TUESDAY: '화', WEDNESDAY: '수', THURSDAY: '목', FRIDAY: '금' }
            return map[wh.dayType] || wh.dayType
          })
          const firstWeekday = weekdays[0]
          return weekdays.length > 0 ? (
            <div className="employcont-item">
              <div className="employcont-item-tit">평일 근무시간 ({workDayNames.join('')})</div>
              <div className="employcont-item-desc">
                <span style={{ display: 'block' }}>근무시간 : {formatTime(firstWeekday.workStartTime)} ~ {formatTime(firstWeekday.workEndTime)}</span>
                {firstWeekday.breakStartTime && firstWeekday.breakEndTime && (
                  <span style={{ display: 'block' }}>휴게시간 : {formatTime(firstWeekday.breakStartTime)} ~ {formatTime(firstWeekday.breakEndTime)}</span>
                )}
              </div>
            </div>
          ) : null
        })()}
        {saturdayHour && saturdayHour.isWork && (
          <div className="employcont-item">
            <div className="employcont-item-tit">
              토요일 {saturdayHour.everySaturdayWork ? '(매주)' : '(격주)'}
            </div>
            <div className="employcont-item-desc">
              <span style={{ display: 'block' }}>근무시간 : {formatTime(saturdayHour.workStartTime)} ~ {formatTime(saturdayHour.workEndTime)}</span>
              {saturdayHour.breakStartTime && saturdayHour.breakEndTime && (
                <span style={{ display: 'block' }}>휴게시간 : {formatTime(saturdayHour.breakStartTime)} ~ {formatTime(saturdayHour.breakEndTime)}</span>
              )}
            </div>
          </div>
        )}
        {sundayHour && sundayHour.isWork && (
          <div className="employcont-item">
            <div className="employcont-item-tit">
              일요일 {sundayHour.everySundayWork ? '(매주)' : '(격주)'}
            </div>
            <div className="employcont-item-desc">
              <span style={{ display: 'block' }}>근무시간 : {formatTime(sundayHour.workStartTime)} ~ {formatTime(sundayHour.workEndTime)}</span>
              {sundayHour.breakStartTime && sundayHour.breakEndTime && (
                <span style={{ display: 'block' }}>휴게시간 : {formatTime(sundayHour.breakStartTime)} ~ {formatTime(sundayHour.breakEndTime)}</span>
              )}
            </div>
          </div>
        )}

        {/* === 업무내용 === */}
        {detail.contract.jobDescription && (
          <div className="employcont-item">
            <div className="employcont-item-tit">업무내용</div>
            <div className="employcont-item-desc"><span>{detail.contract.jobDescription}</span></div>
          </div>
        )}

        {/* === 근로시간 기타 (정규직만) === */}
        {isRegular && (
          <div className="employcont-item">
            <div className="employcont-item-tit">근로시간 기타</div>
            <div className="employcont-item-desc">
              <span>{'\'사원\'은 업무상 필요한 경우 연장근로시간, 휴일근로, 야간근로를 실시하는데 동의한다.'}</span>
            </div>
          </div>
        )}

        {/* === 주휴일 === */}
        <div className="employcont-item">
          <div className="employcont-item-tit">주휴일</div>
          <div className="employcont-item-desc">
            <span>주 15시간 이상 근로 시 1일의 유급휴일을 부여한다.</span>
          </div>
        </div>

        {/* === code_memo 내용 (정규직/파트타이머 분기) === */}
        {isRegular && detail.terms?.holidayDefault && (
          <div className="employcont-item">
            <div className="employcont-item-tit">휴일</div>
            <div className="employcont-item-desc">
              <span>{detail.terms.holidayDefault}</span>
              {detail.terms.holidayAdditional && (
                <span style={{ display: 'block', marginTop: '4px' }}>{detail.terms.holidayAdditional}</span>
              )}
            </div>
          </div>
        )}
        <div className="employcont-item">
          <div className="employcont-item-tit">연차 휴가</div>
          <div className="employcont-item-desc">
            <span>{detail.terms?.annualLeaveDefault ?? '-'}</span>
            {detail.terms?.annualLeaveAdditional && (
              <span style={{ display: 'block', marginTop: '4px' }}>{detail.terms.annualLeaveAdditional}</span>
            )}
          </div>
        </div>
        {isRegular && detail.terms?.resignationDefault && (
          <div className="employcont-item">
            <div className="employcont-item-tit">퇴사 시 업무인수인계</div>
            <div className="employcont-item-desc">
              <span>{detail.terms.resignationDefault}</span>
              {detail.terms.resignationAdditional && (
                <span style={{ display: 'block', marginTop: '4px' }}>{detail.terms.resignationAdditional}</span>
              )}
            </div>
          </div>
        )}
        {isParttime && detail.terms?.severancePayDefault && (
          <div className="employcont-item">
            <div className="employcont-item-tit">퇴직금</div>
            <div className="employcont-item-desc">
              <span>{detail.terms.severancePayDefault}</span>
              {detail.terms.severancePayAdditional && (
                <span style={{ display: 'block', marginTop: '4px' }}>{detail.terms.severancePayAdditional}</span>
              )}
            </div>
          </div>
        )}
        {/* 기타 항목 */}
        <div className="employcont-item">
          <div className="employcont-item-tit">기타1</div>
          <div className="employcont-item-desc"><span>{detail.terms?.otherItem1}</span></div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">기타2</div>
          <div className="employcont-item-desc"><span>{detail.terms?.otherItem2}</span></div>
        </div>
        {detail.terms?.otherItems.map((item, idx) => (
          <div className="employcont-item" key={idx}>
            <div className="employcont-item-tit">기타{idx + 3}</div>
            <div className="employcont-item-desc"><span>{item}</span></div>
          </div>
        ))}

        {/* === 급여 정보 === */}
        {detail.salary && (
          <>
            {isParttime ? (
              <>
                {!!detail.salary.weekDayAllowanceAmount && <SalaryItem label="평일 시급" amount={detail.salary.weekDayAllowanceAmount} />}
                {!!detail.salary.overtimeDayAllowanceAmount && <SalaryItem label="연장근무 시급" amount={detail.salary.overtimeDayAllowanceAmount} />}
                {!!detail.salary.nightDayAllowanceAmount && <SalaryItem label="야간근무 시급" amount={detail.salary.nightDayAllowanceAmount} />}
                {!!detail.salary.holidayAllowanceTimeAmount && <SalaryItem label="휴일근무 시급" amount={detail.salary.holidayAllowanceTimeAmount} />}
              </>
            ) : (
              <>
                <SalaryItem label="연봉" amount={detail.salary.annualAmount} highlight />
                <SalaryItem label="월급여 총액" amount={detail.salary.monthlyTotalAmount} highlight />
                <SalaryItem label="통상시급" amount={detail.salary.timelyAmount} highlight />
                <SalaryItem label={`월간 기본급(${detail.salary.monthlyTime}h)`} amount={detail.salary.monthlyBaseAmount} />
                {!!detail.salary.monthlyOvertimeAllowanceAmount && <SalaryItem label={`월간 연장수당(${detail.salary.monthlyOvertimeAllowanceTime ?? 0}h)`} amount={detail.salary.monthlyOvertimeAllowanceAmount} />}
                {!!detail.salary.monthlyNightAllowanceAmount && <SalaryItem label={`월간 야간수당(${detail.salary.monthlyNightAllowanceTime ?? 0}h)`} amount={detail.salary.monthlyNightAllowanceAmount} />}
                {!!detail.salary.monthlyHolidayAllowanceAmount && <SalaryItem label={`월간 휴일근무수당(${detail.salary.monthlyHolidayAllowanceTime ?? 0}h)`} amount={detail.salary.monthlyHolidayAllowanceAmount} />}
                {!!detail.salary.monthlyAddHolidayAllowanceAmount && <SalaryItem label={`월간 추가휴일근무수당(${detail.salary.monthlyAddHolidayAllowanceTime ?? 0}h)`} amount={detail.salary.monthlyAddHolidayAllowanceAmount} />}
                <SalaryItem label="식대(비과세)" amount={detail.salary.mealAllowanceAmount} />
                <SalaryItem label="자가운전보조금(비과세)" amount={detail.salary.vehicleAllowanceAmount} />
                <SalaryItem label="육아수당(비과세)" amount={detail.salary.childcareAllowanceAmount} />
              </>
            )}
            {detail.salary.bonuses.map((bonus, idx) => (
              <SalaryItem key={idx} label={bonus.bonusType} amount={bonus.amount} />
            ))}
            <div className="employcont-item">
              <div className="employcont-item-tit">급여 지급일</div>
              <div className="employcont-item-desc"><span>매월 {detail.contract.salaryDay}일</span></div>
            </div>
          </>
        )}
        {/* 급여 계좌 선택 */}
        <div className="employcont-item">
          <div className="employcont-item-tit" style={{ fontWeight: 700 }}>
            급여 계좌 <span style={{ color: '#ef4444' }}>*</span>
          </div>
          {accounts.length === 0 ? (
            <div className="employcont-item-desc">
              <span style={{ color: '#999' }}>등록된 급여 계좌가 없습니다.</span>
              <button
                type="button"
                onClick={() => openAccountSheet(undefined, fetchAccounts)}
                style={{
                  display: 'block', marginTop: '8px', padding: '8px 16px',
                  backgroundColor: '#2563eb', color: '#fff', border: 'none',
                  borderRadius: '6px', fontSize: '14px', cursor: 'pointer'
                }}
              >
                급여 계좌 등록하기
              </button>
            </div>
          ) : (
            <div className="employcont-item-desc">
              {accounts.map((account) => (
                <label
                  key={account.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 12px', marginBottom: '6px', cursor: 'pointer',
                    backgroundColor: effectiveAccountId === account.id ? '#eff6ff' : '#f9fafb',
                    border: effectiveAccountId === account.id ? '2px solid #2563eb' : '1px solid #e5e7eb',
                    borderRadius: '8px', transition: 'all 0.15s'
                  }}
                >
                  <input
                    type="radio"
                    name="salary-account"
                    checked={effectiveAccountId === account.id}
                    onChange={() => { setSelectedAccountId(account.id); setAccountError(false) }}
                    style={{ accentColor: '#2563eb' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>
                      {account.bankName}
                      {account.isPrimary && (
                        <span style={{
                          marginLeft: '6px', fontSize: '11px', color: '#2563eb',
                          backgroundColor: '#dbeafe', padding: '1px 6px', borderRadius: '4px'
                        }}>대표</span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                      {account.accountNumber} | {account.accountHolder}
                    </div>
                  </div>
                </label>
              ))}
              <button
                type="button"
                onClick={() => openAccountSheet(undefined, fetchAccounts)}
                style={{
                  display: 'block', marginTop: '4px', padding: '6px 12px',
                  backgroundColor: 'transparent', color: '#2563eb', border: '1px dashed #2563eb',
                  borderRadius: '6px', fontSize: '13px', cursor: 'pointer', width: '100%'
                }}
              >
                + 새 계좌 등록
              </button>
            </div>
          )}
          {accountError && (
            <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px' }}>
              급여 계좌를 선택해 주세요.
            </p>
          )}
        </div>
      </div>
      <div className="employcont-check-warp">
        <div className="check-form-box">
          <input
            type="checkbox"
            id="check-form-2"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked)
              if (e.target.checked) setAgreeError(false)
            }}
          />
          <label htmlFor="check-form-2">
            본인은 근로기준법 제17조에 따른 주요 근로조건이 서면으로 명시되었음을 확인하였으며, 근로계약서를 교부
            받았습니다.
          </label>
        </div>
        {agreeError && (
          <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', paddingLeft: '4px' }}>
            동의는 필수입니다. 체크박스를 선택해 주세요.
          </p>
        )}
      </div>
      <div className="employcont-btn-wrap">
        <button className="btn-form outline block" onClick={handleReject} disabled={rejecting}>
          {rejecting ? '처리중...' : '거절 하기'}
        </button>
        <button className="btn-form login block" onClick={handleAgree}>
          동의하기 (SIGN)
        </button>
      </div>
    </div>
  )
}
