'use client'

import { useState } from 'react'

import { usePopupController } from '@/store/usePopupController'
import { useContractSnapshot, useDownloadContractDocx } from '@/hooks/queries/use-contract-queries'

import { formatTime } from '@/lib/date-utils'

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
function SuccessSalaryItem({ label, amount, highlight }: { label: string; amount: number | null | undefined; highlight?: boolean }) {
  return (
    <div className="employcont-item">
      <div className="employcont-item-tit" style={highlight ? { fontWeight: 700 } : undefined}>{label}</div>
      <div className="employcont-item-desc">
        <span style={highlight ? { fontWeight: 700 } : undefined}>{(amount ?? 0).toLocaleString()}원</span>
      </div>
    </div>
  )
}

export default function EmploySuccess() {
  const setContractHistoryPopup = usePopupController((state) => state.setContractHistoryPopup)
  const setEmploymentPopFrame = usePopupController((state) => state.setEmploymentPopFrame)
  const setEmploymentStep = usePopupController((state) => state.setEmploymentStep)
  const selectedContractId = usePopupController((state) => state.selectedContractId)
  const [downloading, setDownloading] = useState(false)
  const { data, isPending } = useContractSnapshot(selectedContractId, !!selectedContractId)
  const detail = data?.data ?? null
  const hasLoaded = !selectedContractId || !isPending
  const { mutateAsync: downloadDocx } = useDownloadContractDocx()

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

  // 정규직/파트타이머 구분
  const isParttime = detail.contract.contractClassificationCode === 'CNTCFWK_003'
  const isRegular = !isParttime

  // 요일별 근무시간 추출
  const saturdayHour = detail.workHours.find((wh) => wh.dayType === 'SATURDAY')
  const sundayHour = detail.workHours.find((wh) => wh.dayType === 'SUNDAY')

  const handleDownload = async () => {
    if (!selectedContractId) return
    try {
      setDownloading(true)
      const res = await downloadDocx(selectedContractId)
      const blob = await res.blob()

      const disposition = res.headers.get('content-disposition')
      let filename = `근로계약서_${selectedContractId}.docx`
      if (disposition) {
        const match = disposition.match(/filename\*=UTF-8''(.+)/)
        if (match) filename = decodeURIComponent(match[1])
      }

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch {
      alert('계약서 다운로드에 실패했습니다.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="employcont-container">
      <div className="employ-success-btn-wrap" style={{ display: 'flex', gap: '8px', padding: '0 16px', marginBottom: '12px' }}>
        <button
          className="btn-form block"
          style={{ flex: 1, backgroundColor: '#6b7280', color: '#fff', border: 'none' }}
          onClick={() => {
            setEmploymentPopFrame(false)
            setEmploymentStep(false)
            setTimeout(() => setContractHistoryPopup(true), 300)
          }}
        >
          계약 이력
        </button>
        <button className="btn-form login block" style={{ flex: 1 }} onClick={handleDownload} disabled={downloading}>
          {downloading ? '다운로드 중...' : '계약서 다운로드'}
        </button>
      </div>
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

        {/* === code_memo 내용 === */}
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
        <div className="employcont-item">
          <div className="employcont-item-tit">기타1</div>
          <div className="employcont-item-desc"><span>{detail.terms?.otherItem1}</span></div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">기타2</div>
          <div className="employcont-item-desc"><span>{detail.terms?.otherItem2}</span></div>
        </div>
        {detail.terms?.otherItems?.map((item, idx) => (
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
                {!!detail.salary.weekDayAllowanceAmount && <SuccessSalaryItem label="평일 시급" amount={detail.salary.weekDayAllowanceAmount} />}
                {!!detail.salary.overtimeDayAllowanceAmount && <SuccessSalaryItem label="연장근무 시급" amount={detail.salary.overtimeDayAllowanceAmount} />}
                {!!detail.salary.nightDayAllowanceAmount && <SuccessSalaryItem label="야간근무 시급" amount={detail.salary.nightDayAllowanceAmount} />}
                {!!detail.salary.holidayAllowanceTimeAmount && <SuccessSalaryItem label="휴일근무 시급" amount={detail.salary.holidayAllowanceTimeAmount} />}
              </>
            ) : (
              <>
                <SuccessSalaryItem label="연봉" amount={detail.salary.annualAmount} highlight />
                <SuccessSalaryItem label="월급여 총액" amount={detail.salary.monthlyTotalAmount} highlight />
                <SuccessSalaryItem label="통상시급" amount={detail.salary.timelyAmount} highlight />
                <SuccessSalaryItem label={`월간 기본급(${detail.salary.monthlyTime}h)`} amount={detail.salary.monthlyBaseAmount} />
                {!!detail.salary.monthlyOvertimeAllowanceAmount && <SuccessSalaryItem label={`월간 연장수당(${detail.salary.monthlyOvertimeAllowanceTime ?? 0}h)`} amount={detail.salary.monthlyOvertimeAllowanceAmount} />}
                {!!detail.salary.monthlyNightAllowanceAmount && <SuccessSalaryItem label={`월간 야간수당(${detail.salary.monthlyNightAllowanceTime ?? 0}h)`} amount={detail.salary.monthlyNightAllowanceAmount} />}
                {!!detail.salary.monthlyHolidayAllowanceAmount && <SuccessSalaryItem label={`월간 휴일근무수당(${detail.salary.monthlyHolidayAllowanceTime ?? 0}h)`} amount={detail.salary.monthlyHolidayAllowanceAmount} />}
                {!!detail.salary.monthlyAddHolidayAllowanceAmount && <SuccessSalaryItem label={`월간 추가휴일근무수당(${detail.salary.monthlyAddHolidayAllowanceTime ?? 0}h)`} amount={detail.salary.monthlyAddHolidayAllowanceAmount} />}
                <SuccessSalaryItem label="식대(비과세)" amount={detail.salary.mealAllowanceAmount} />
                <SuccessSalaryItem label="자가운전보조금(비과세)" amount={detail.salary.vehicleAllowanceAmount} />
                <SuccessSalaryItem label="육아수당(비과세)" amount={detail.salary.childcareAllowanceAmount} />
              </>
            )}
            {detail.salary.bonuses.map((bonus, idx) => (
              <SuccessSalaryItem key={idx} label={bonus.bonusType} amount={bonus.amount} />
            ))}
            <div className="employcont-item">
              <div className="employcont-item-tit">급여 지급일</div>
              <div className="employcont-item-desc"><span>매월 {detail.contract.salaryDay}일</span></div>
            </div>
          </>
        )}

        {/* === 급여 계좌 (읽기 전용) === */}
        {detail.salaryAccount && (
          <div className="employcont-item">
            <div className="employcont-item-tit">급여 계좌</div>
            <div className="employcont-item-desc">
              <span>{detail.salaryAccount.bankName} {detail.salaryAccount.accountNumber} ({detail.salaryAccount.accountHolder})</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
