'use client'

import { useEffect, useState } from 'react'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { usePopupController } from '@/store/usePopupController'
import { contractApi } from '@/lib/api-endpoints'
import type { ContractDetailResponse } from '@/types/api'

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
 * 근무 시간 항목 컴포넌트
 */
function WorkHourItem({
  title,
  workHour,
}: {
  title: string
  workHour: ContractDetailResponse['workHours'][0] | undefined
}) {
  if (!workHour) return null
  if (!workHour.isWork) {
    return (
      <div className="employcont-item">
        <div className="employcont-item-tit">{title}</div>
        <div className="employcont-item-desc">
          <span>근무 없음</span>
        </div>
      </div>
    )
  }
  return (
    <div className="employcont-item">
      <div className="employcont-item-tit">{title}</div>
      <div className="employcont-item-desc">
        <span>근무시간 : {formatTime(workHour.workStartTime)} ~ {formatTime(workHour.workEndTime)}</span>
        {workHour.breakStartTime && workHour.breakEndTime && (
          <span>휴게시간 : {formatTime(workHour.breakStartTime)} ~ {formatTime(workHour.breakEndTime)}</span>
        )}
      </div>
    </div>
  )
}

export default function EmploySuccess() {
  const setAccountSelectSheet = useBottomSheetController((state) => state.setAccountSelectSheet)
  const setContractHistoryPopup = usePopupController((state) => state.setContractHistoryPopup)
  const selectedContractId = usePopupController((state) => state.selectedContractId)
  const [detail, setDetail] = useState<ContractDetailResponse | null>(null)
  // hasLoaded: API 호출 완료 여부
  const [hasLoaded, setHasLoaded] = useState(!selectedContractId)

  useEffect(() => {
    if (!selectedContractId) return
    contractApi.getContractDetail(selectedContractId)
      .then((res) => {
        setDetail(res.data ?? null)
      })
      .catch((err) => {
        console.error('계약 상세 조회 실패:', err)
      })
      .finally(() => setHasLoaded(true))
  }, [selectedContractId])

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

  // 요일별 근무시간 추출
  const weekdayHour = detail.workHours.find((wh) =>
    ['WEEKDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'].includes(wh.dayType)
  )
  const saturdayHour = detail.workHours.find((wh) => wh.dayType === 'SATURDAY')
  const sundayHour = detail.workHours.find((wh) => wh.dayType === 'SUNDAY')

  return (
    <div className="employcont-container">
      <div className="employ-success-btn-wrap">
        <button className="btn-form login block" onClick={() => setContractHistoryPopup(true)}>
          계약이력
        </button>
        <button className="btn-form outline block">
          계약서 다운로드 <i className="download"></i>
        </button>
      </div>
      <div className="employcont-wrap">
        {/* 1. 회사명 */}
        <div className="employcont-item">
          <div className="employcont-item-tit">회사명</div>
          <div className="employcont-item-desc">
            <span>{detail.company.companyName ?? '-'}</span>
          </div>
        </div>
        {/* 2. 사업자등록번호 */}
        <div className="employcont-item">
          <div className="employcont-item-tit">사업자등록번호</div>
          <div className="employcont-item-desc">
            <span>{detail.company.businessRegistrationNumber ?? '-'}</span>
          </div>
        </div>
        {/* 3. 회사 주소 */}
        <div className="employcont-item">
          <div className="employcont-item-tit">회사 주소</div>
          <div className="employcont-item-desc">
            <span>{detail.company.companyAddress ?? '-'}</span>
          </div>
        </div>
        {/* 4. 취업자명 */}
        <div className="employcont-item">
          <div className="employcont-item-tit">취업자명</div>
          <div className="employcont-item-desc">
            <span>{detail.employee.employeeName}</span>
          </div>
        </div>
        {/* 5. 주민등록번호 */}
        <div className="employcont-item">
          <div className="employcont-item-tit">주민등록번호</div>
          <div className="employcont-item-desc">
            <span>{detail.employee.employeeSsn ?? '-'}</span>
          </div>
        </div>
        {/* 6. 주소 */}
        <div className="employcont-item">
          <div className="employcont-item-tit">주소</div>
          <div className="employcont-item-desc">
            <span>{detail.employee.employeeAddress ?? '-'}</span>
          </div>
        </div>
        {/* 7. 근로 장소 */}
        <div className="employcont-item">
          <div className="employcont-item-tit">근로 장소</div>
          <div className="employcont-item-desc">
            <span>
              {detail.terms?.workPlace ?? '회사 및 기타 업무상 필요가 있을 경우 \'사원\'의 근무장소 또는 업무내용을 변경할 수 있으며, 이 경우 \'사원\'은 특별한 사정이 없는 한 이에 따라야 한다.'}
            </span>
          </div>
        </div>
        {/* 8. 근로계약기간 */}
        <div className="employcont-item">
          <div className="employcont-item-tit">근로계약기간</div>
          <div className="employcont-item-desc">
            <span>{formatDate(detail.contract.contractStartDate)} ~ {formatDate(detail.contract.contractEndDate)}</span>
          </div>
        </div>
        {/* 9. 계약 분류 */}
        <div className="employcont-item">
          <div className="employcont-item-tit">계약 분류</div>
          <div className="employcont-item-desc">
            <span>{detail.contract.contractClassification}</span>
          </div>
        </div>
        {/* 10. 평일 근무시간 */}
        <WorkHourItem title="평일 근무시간" workHour={weekdayHour} />
        {/* 11. 토요일 근무시간 */}
        <WorkHourItem title="토요일 근무시간" workHour={saturdayHour} />
        {/* 12. 일요일 근무시간 */}
        <WorkHourItem title="일요일 근무시간" workHour={sundayHour} />
        {/* 13. 근로시간 기타 */}
        <div className="employcont-item">
          <div className="employcont-item-tit">근로시간 기타</div>
          <div className="employcont-item-desc">
            <span>{'\'사원\'은 업무상 필요한 경우 연장근로시간, 휴일근로, 야간근로를 실시하는데 동의한다.'}</span>
          </div>
        </div>
        {/* 14. 휴일 */}
        <div className="employcont-item">
          <div className="employcont-item-tit">휴일</div>
          <div className="employcont-item-desc">
            <span>{detail.terms?.holidayDefault ?? '-'}</span>
            {detail.terms?.holidayAdditional && (
              <span style={{ display: 'block', marginTop: '4px' }}>{detail.terms.holidayAdditional}</span>
            )}
          </div>
        </div>
        {/* 15. 연차 휴가 */}
        <div className="employcont-item">
          <div className="employcont-item-tit">연차 휴가</div>
          <div className="employcont-item-desc">
            <span>{detail.terms?.annualLeaveDefault ?? '-'}</span>
            {detail.terms?.annualLeaveAdditional && (
              <span style={{ display: 'block', marginTop: '4px' }}>{detail.terms.annualLeaveAdditional}</span>
            )}
          </div>
        </div>
        {/* 16. 퇴사 시 업무 인수인계 */}
        <div className="employcont-item">
          <div className="employcont-item-tit">퇴사 시 업무인수인계</div>
          <div className="employcont-item-desc">
            <span>{detail.terms?.resignationDefault ?? '-'}</span>
            {detail.terms?.resignationAdditional && (
              <span style={{ display: 'block', marginTop: '4px' }}>{detail.terms.resignationAdditional}</span>
            )}
          </div>
        </div>
        {/* 기타 항목 (code-memo otherItems) */}
        {detail.terms?.otherItems.map((item, idx) => (
          <div className="employcont-item" key={idx}>
            <div className="employcont-item-tit">기타 항목 {idx + 1}</div>
            <div className="employcont-item-desc">
              <span>{item}</span>
            </div>
          </div>
        ))}
        {/* 17. 기타 #1 */}
        <div className="employcont-item">
          <div className="employcont-item-tit">기타1</div>
          <div className="employcont-item-desc">
            <span>{detail.terms?.otherItem1}</span>
          </div>
        </div>
        {/* 18. 기타 #2 */}
        <div className="employcont-item">
          <div className="employcont-item-tit">기타2</div>
          <div className="employcont-item-desc">
            <span>{detail.terms?.otherItem2}</span>
          </div>
        </div>
        {/* 급여 계좌 변경 섹션 */}
        <div className="employcont-item">
          <div className="employcont-item-account-wrap">
            <div className="employcont-item-tit-wrap">
              <div className="employcont-item-tit">급여 계좌</div>
              <div className="employcont-item-desc">
                <span>급여 지급일: 매달 {detail.contract.salaryDay}일</span>
              </div>
            </div>
            <div className="employcont-item-btn">
              <button className="employcont-btn" onClick={() => setAccountSelectSheet(true)}>
                계좌 변경
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
