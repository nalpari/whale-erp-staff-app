'use client'

import { usePopupController } from '@/store/usePopupController'
import { useEffect, useState } from 'react'
import { usePayrollDetail, useDownloadPayrollExcel } from '@/hooks/queries/use-payroll-queries'
import type {
  FullTimePayrollDetailResponse,
  PartTimePayrollDetailResponse,
  PayrollItemResponse,
  WeekDetail,
  BonusItemResponse,
} from '@/types/api'

// ============================================================
// 유틸리티 함수
// ============================================================

function formatAmount(amount: number): string {
  return Number(amount).toLocaleString('ko-KR') + ' 원'
}

function formatHours(hours: number): string {
  return Number(hours).toFixed(1)
}

function formatDailyDate(date: string, dayOfWeek: string): string {
  return `${date.replace(/-/g, '.')} (${dayOfWeek})`
}

// ============================================================
// 정직원 상세 컴포넌트
// ============================================================

function FullTimeDetail({ data, onExcelDownload }: { data: FullTimePayrollDetailResponse; onExcelDownload: () => void }) {
  return (
    <div className="pop-tit-cont-wrap">
      {/* ****년 *월 급여명세서 */}
      <div className="pop-tit-cont-item">
        <div className="pop-tit-cont-header">
          <div className="pop-tit-cont-tit">{data.payrollMonth}</div>
          <div className="pop-tit-cont-btn-wrap">
            {data.payrollFileUrl ? (
              <a
                href={data.payrollFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-form outline block"
              >
                파일 다운로드
              </a>
            ) : (
              <button className="btn-form outline block" onClick={onExcelDownload}>
                파일 다운로드
              </button>
            )}
          </div>
        </div>
        <div className="pop-tit-cont-body">
          <div className="pop-tit-cont-body-item">
            <table className="data-table">
              <colgroup>
                <col width="70px" />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th>근무처</th>
                  <td>{data.workplaceName}</td>
                </tr>
                <tr>
                  <th>직원명</th>
                  <td>{data.employeeName}</td>
                </tr>
                <tr>
                  <th>급여일</th>
                  <td>{data.paymentDate}</td>
                </tr>
                <tr>
                  <th>정산 기간</th>
                  <td>{data.settlementPeriod}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 급여명세서 파일 */}
      {data.payrollFileUrl && (
        <div className="pop-tit-cont-item">
          <div className="pop-tit-cont-header">
            <div className="pop-tit-cont-tit">급여명세서 파일</div>
          </div>
          <div className="pop-tit-cont-body">
            <div className="pop-tit-cont-body-item">
              <ul className="salary-file-list">
                <li className="salary-file-item">
                  <a href={data.payrollFileUrl} target="_blank" rel="noopener noreferrer">
                    {data.payrollFileUrl.split('/').pop()?.split('?')[0] ?? '급여명세서 파일'}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 급여정보 */}
      <div className="pop-tit-cont-item">
        <div className="pop-tit-cont-header">
          <div className="pop-tit-cont-tit">급여정보</div>
        </div>
        <div className="pop-tit-cont-body">
          <div className="pop-tit-cont-body-item">
            <div className="salary-data">
              <div className="salary-data-item red">
                <div className="salary-data-item-tit">실지급액</div>
                <div className="salary-data-item-desc">{formatAmount(data.actualPayment)}</div>
              </div>
              <div className="salary-data-item">
                <div className="salary-data-item-tit">지급총액</div>
                <div className="salary-data-item-desc">{formatAmount(data.totalPayment)}</div>
              </div>
              <div className="salary-data-item">
                <div className="salary-data-item-tit">공제총액</div>
                <div className="salary-data-item-desc">{formatAmount(data.totalDeduction)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 지급 세부 내역 */}
      <div className="pop-tit-cont-item">
        <div className="pop-tit-cont-header">
          <div className="pop-tit-cont-tit">지급 세부 내역</div>
        </div>
        <div className="pop-tit-cont-body">
          <div className="pop-tit-cont-body-item salary">
            <div className="salary-data">
              {data.paymentItems.map((item: PayrollItemResponse, i: number) => (
                <div key={i} className="salary-data-item">
                  <div className="salary-data-item-tit">{item.name}</div>
                  <div className="salary-data-item-desc">{formatAmount(item.amount)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="pop-tit-cont-total-item">
            <div className="total-data-wrap">
              <div className="total-data-tit">지급총액 (+)</div>
              <div className="total-data-desc">{formatAmount(data.totalPayment)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 공제 세부 내역 */}
      <div className="pop-tit-cont-item">
        <div className="pop-tit-cont-header">
          <div className="pop-tit-cont-tit">공제 세부 내역</div>
        </div>
        <div className="pop-tit-cont-body">
          <div className="pop-tit-cont-body-item salary">
            <div className="salary-data">
              {data.deductionItems.map((item: PayrollItemResponse, i: number) => (
                <div key={i} className="salary-data-item">
                  <div className="salary-data-item-tit">{item.name}</div>
                  <div className="salary-data-item-desc">{formatAmount(item.amount)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="pop-tit-cont-total-item">
            <div className="total-data-wrap">
              <div className="total-data-tit">공제총액(-)</div>
              <div className="total-data-desc">{formatAmount(data.totalDeduction)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 실지급액 */}
      <div className="pop-tit-cont-item">
        <div className="pop-tit-cont-header">
          <div className="pop-tit-cont-tit">실지급액</div>
        </div>
        <div className="pop-tit-cont-body">
          <div className="pop-tit-cont-body-item black">
            <div className="actual-pay-wrap">
              <div className="actual-pay-tit">실지급액</div>
              <div className="actual-pay-desc">{formatAmount(data.actualPayment)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 파트타이머 상세 컴포넌트
// ============================================================

function PartTimeDetail({ data }: { data: PartTimePayrollDetailResponse }) {
  const totalBonusNetAmount = data.bonuses.reduce(
    (sum: number, b: BonusItemResponse) => sum + Number(b.netAmount),
    0,
  )

  return (
    <div className="pop-tit-cont-wrap">
      {/* ****년 *월 급여명세서 */}
      <div className="pop-tit-cont-item">
        <div className="pop-tit-cont-header">
          <div className="pop-tit-cont-tit">{data.payrollMonth}</div>
        </div>
        <div className="pop-tit-cont-body">
          <div className="pop-tit-cont-body-item">
            <table className="data-table">
              <colgroup>
                <col width="70px" />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th>근무처</th>
                  <td>{data.workplaceName}</td>
                </tr>
                <tr>
                  <th>직원명</th>
                  <td>{data.employeeName}</td>
                </tr>
                <tr>
                  <th>급여일</th>
                  <td>{data.paymentDate}</td>
                </tr>
                <tr>
                  <th>정산 기간</th>
                  <td>{data.settlementPeriod}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 급여정보 */}
      <div className="pop-tit-cont-item">
        <div className="pop-tit-cont-header">
          <div className="pop-tit-cont-tit">급여정보</div>
        </div>
        <div className="pop-tit-cont-body">
          <div className="pop-tit-cont-body-item">
            <div className="salary-data">
              <div className="salary-data-item red">
                <div className="salary-data-item-tit">실지급액</div>
                <div className="salary-data-item-desc">
                  {formatAmount(data.grandTotal.actualPayment)}
                </div>
              </div>
              <div className="salary-data-item">
                <div className="salary-data-item-tit">지급총액</div>
                <div className="salary-data-item-desc">
                  {formatAmount(data.grandTotal.totalPayment)}
                </div>
              </div>
              <div className="salary-data-item">
                <div className="salary-data-item-tit">공제총액</div>
                <div className="salary-data-item-desc">
                  {formatAmount(data.grandTotal.totalDeduction)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 지급 상세 정보 */}
      <div className="pop-tit-cont-item">
        <div className="pop-tit-cont-header">
          <div className="pop-tit-cont-tit">지급 상세 정보</div>
        </div>
        <div className="pop-tit-cont-body">
          <div className="salary-detail-info-wrap">
            {data.weeklyDetails.map((week: WeekDetail) => (
              <div key={week.weekNumber}>
                {/* 일별 근무 기록 */}
                {week.dailyRecords.map((record, j: number) => {
                  const isLast = j === week.dailyRecords.length - 1
                  return (
                    <div
                      key={j}
                      className={`salary-detail-info-item${isLast ? ' last' : ''}`}
                    >
                      <div className="salary-detail-info-item-header">
                        <div className="salary-detail-info-item-date">
                          {formatDailyDate(record.date, record.dayOfWeek)}
                        </div>
                        <div className="salary-detail-info-item-pay">
                          {formatAmount(record.dailyPay)}
                        </div>
                      </div>
                      <div className="salary-detail-info-item-content">
                        <div className="salary-detail-info-table">
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">근무시간</div>
                            <div className="salary-detail-info-table-item-desc">
                              {formatHours(record.workHours)}
                            </div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">시급</div>
                            <div className="salary-detail-info-table-item-desc">
                              {Number(record.hourlyRate).toLocaleString('ko-KR')}
                            </div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">지급액</div>
                            <div className="salary-detail-info-table-item-desc">
                              {Number(record.dailyPay).toLocaleString('ko-KR')}
                            </div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">공제액</div>
                            <div className="salary-detail-info-table-item-desc">
                              {Number(record.tax).toLocaleString('ko-KR')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* 주간 소계 */}
                <div className="salary-detail-info-item data">
                  <div className="salary-detail-info-item-header">
                    <div className="salary-detail-info-item-tit">주간소계</div>
                    <div className="salary-detail-info-item-pay">
                      {formatAmount(week.weeklySubtotal.pay)}
                    </div>
                  </div>
                  <div className="salary-detail-info-item-content">
                    <div className="salary-detail-info-table">
                      <div className="salary-detail-info-table-item">
                        <div className="salary-detail-info-table-item-tit">근무시간</div>
                        <div className="salary-detail-info-table-item-desc">
                          {formatHours(week.weeklySubtotal.hours)}
                        </div>
                      </div>
                      <div className="salary-detail-info-table-item">
                        <div className="salary-detail-info-table-item-tit">지급액</div>
                        <div className="salary-detail-info-table-item-desc">
                          {Number(week.weeklySubtotal.pay).toLocaleString('ko-KR')}
                        </div>
                      </div>
                      <div className="salary-detail-info-table-item">
                        <div className="salary-detail-info-table-item-tit">공제액</div>
                        <div className="salary-detail-info-table-item-desc">
                          {Number(week.weeklySubtotal.tax).toLocaleString('ko-KR')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 주휴수당 */}
                {week.weeklyPaidHolidayAllowance && (
                  <div className="salary-detail-info-item data">
                    <div className="salary-detail-info-item-header">
                      <div className="salary-detail-info-item-tit">주휴수당</div>
                      <div className="salary-detail-info-item-pay">
                        {formatAmount(week.weeklyPaidHolidayAllowance.amount)}
                      </div>
                    </div>
                    <div className="salary-detail-info-item-content">
                      <div className="salary-detail-info-table">
                        <div className="salary-detail-info-table-item">
                          <div className="salary-detail-info-table-item-tit">근무시간</div>
                          <div className="salary-detail-info-table-item-desc">
                            {formatHours(week.weeklyPaidHolidayAllowance.hours)}
                          </div>
                        </div>
                        <div className="salary-detail-info-table-item">
                          <div className="salary-detail-info-table-item-tit">시급</div>
                          <div className="salary-detail-info-table-item-desc">
                            {Number(week.weeklyPaidHolidayAllowance.hourlyRate).toLocaleString(
                              'ko-KR',
                            )}
                          </div>
                        </div>
                        <div className="salary-detail-info-table-item">
                          <div className="salary-detail-info-table-item-tit">지급액</div>
                          <div className="salary-detail-info-table-item-desc">
                            {Number(week.weeklyPaidHolidayAllowance.amount).toLocaleString('ko-KR')}
                          </div>
                        </div>
                        <div className="salary-detail-info-table-item">
                          <div className="salary-detail-info-table-item-tit">공제액</div>
                          <div className="salary-detail-info-table-item-desc">
                            {Number(week.weeklyPaidHolidayAllowance.tax).toLocaleString('ko-KR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 주간 합계 */}
                <div className="salary-detail-info-item data">
                  <div className="salary-detail-info-item-header">
                    <div className="salary-detail-info-item-tit">주간합계</div>
                    <div className="salary-detail-info-item-pay">
                      {formatAmount(week.weeklyTotal.pay)}
                    </div>
                  </div>
                  <div className="salary-detail-info-item-content">
                    <div className="salary-detail-info-table">
                      <div className="salary-detail-info-table-item">
                        <div className="salary-detail-info-table-item-tit">근무시간</div>
                        <div className="salary-detail-info-table-item-desc">
                          {formatHours(week.weeklyTotal.hours)}
                        </div>
                      </div>
                      <div className="salary-detail-info-table-item">
                        <div className="salary-detail-info-table-item-tit">지급액</div>
                        <div className="salary-detail-info-table-item-desc">
                          {Number(week.weeklyTotal.pay).toLocaleString('ko-KR')}
                        </div>
                      </div>
                      <div className="salary-detail-info-table-item">
                        <div className="salary-detail-info-table-item-tit">공제액</div>
                        <div className="salary-detail-info-table-item-desc">
                          {Number(week.weeklyTotal.tax).toLocaleString('ko-KR')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 급여 소계 */}
            <div className="salary-detail-info-item total">
              <div className="salary-detail-info-item-header">
                <div className="salary-detail-info-item-tit">급여 소계</div>
                <div className="salary-detail-info-item-pay">
                  {formatAmount(data.payrollSubtotal.totalPay)}
                </div>
              </div>
              <div className="salary-detail-info-item-content">
                <div className="salary-detail-info-table">
                  <div className="salary-detail-info-table-item">
                    <div className="salary-detail-info-table-item-tit">근무시간</div>
                    <div className="salary-detail-info-table-item-desc">
                      {formatHours(data.payrollSubtotal.hours)}
                    </div>
                  </div>
                  <div className="salary-detail-info-table-item">
                    <div className="salary-detail-info-table-item-tit">지급액</div>
                    <div className="salary-detail-info-table-item-desc">
                      {Number(data.payrollSubtotal.totalPay).toLocaleString('ko-KR')}
                    </div>
                  </div>
                  <div className="salary-detail-info-table-item">
                    <div className="salary-detail-info-table-item-tit">공제액</div>
                    <div className="salary-detail-info-table-item-desc">
                      {Number(data.payrollSubtotal.totalTax).toLocaleString('ko-KR')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 급여합계 */}
            <div className="salary-detail-info-item actual">
              <div className="salary-detail-info-item-header">
                <div className="salary-detail-info-item-tit">급여합계</div>
                <div className="salary-detail-info-item-pay">
                  {formatAmount(data.grandTotal.actualPayment)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 상여금 */}
      {data.bonuses.length > 0 && (
        <div className="pop-tit-cont-item">
          <div className="pop-tit-cont-header">
            <div className="pop-tit-cont-tit">상여금</div>
          </div>
          <div className="pop-tit-cont-body">
            <div className="salary-detail-info-wrap">
              <div className="salary-detail-info-item total">
                <div className="salary-detail-info-item-header">
                  <div className="salary-detail-info-item-tit">상여금</div>
                  <div className="salary-detail-info-item-pay">
                    {formatAmount(totalBonusNetAmount)}
                  </div>
                </div>
                <div className="salary-detail-info-item-content">
                  <div className="salary-detail-info-table">
                    <div className="salary-detail-info-table-item">
                      <div className="salary-detail-info-table-item-tit">항목</div>
                      {data.bonuses.map((b: BonusItemResponse, i: number) => (
                        <div key={i} className="salary-detail-info-table-item-txt">
                          {b.name}
                        </div>
                      ))}
                    </div>
                    <div className="salary-detail-info-table-item">
                      <div className="salary-detail-info-table-item-tit">지급액</div>
                      {data.bonuses.map((b: BonusItemResponse, i: number) => (
                        <div key={i} className="salary-detail-info-table-item-desc">
                          {Number(b.amount).toLocaleString('ko-KR')}
                        </div>
                      ))}
                    </div>
                    <div className="salary-detail-info-table-item">
                      <div className="salary-detail-info-table-item-tit">공제액</div>
                      {data.bonuses.map((b: BonusItemResponse, i: number) => (
                        <div key={i} className="salary-detail-info-table-item-desc">
                          {Number(b.tax).toLocaleString('ko-KR')}
                        </div>
                      ))}
                    </div>
                    <div className="salary-detail-info-table-item">
                      <div className="salary-detail-info-table-item-tit">차인금액</div>
                      {data.bonuses.map((b: BonusItemResponse, i: number) => (
                        <div key={i} className="salary-detail-info-table-item-desc">
                          {Number(b.netAmount).toLocaleString('ko-KR')}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 공제 세부 내역 */}
      <div className="pop-tit-cont-item">
        <div className="pop-tit-cont-header">
          <div className="pop-tit-cont-tit">공제 세부 내역</div>
        </div>
        <div className="pop-tit-cont-body">
          <div className="pop-tit-cont-body-item salary">
            <div className="salary-data">
              {data.deductions.map((item: PayrollItemResponse, i: number) => (
                <div key={i} className="salary-data-item">
                  <div className="salary-data-item-tit">{item.name}</div>
                  <div className="salary-data-item-desc">{formatAmount(item.amount)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="pop-tit-cont-total-item">
            <div className="total-data-wrap">
              <div className="total-data-tit">공제총액(-)</div>
              <div className="total-data-desc">{formatAmount(data.grandTotal.totalDeduction)}</div>
            </div>
          </div>
          <div className="pop-tit-cont-total-item">
            <div className="total-data-wrap">
              <div className="total-data-tit">실지급액</div>
              <div className="total-data-desc red">{formatAmount(data.grandTotal.actualPayment)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 메인 팝업 컴포넌트
// ============================================================

export default function SalaryDetailFullTime() {
  const [active, setActive] = useState(false)

  const SalaryDetailFullTimePopup = usePopupController(
    (state) => state.SalaryDetailFullTimePopup,
  )
  const setSalaryDetailFullTimePopup = usePopupController(
    (state) => state.setSalaryDetailFullTimePopup,
  )
  const selectedPayrollId = usePopupController((state) => state.selectedPayrollId)
  const selectedPayrollType = usePopupController((state) => state.selectedPayrollType)

  const { data: payrollDetailData, isPending } = usePayrollDetail(
    selectedPayrollId,
    !!selectedPayrollId && SalaryDetailFullTimePopup,
  )
  const loading = !!selectedPayrollId && SalaryDetailFullTimePopup && isPending
  const fullTimeData =
    selectedPayrollType === 'REGULAR'
      ? ((payrollDetailData?.data as FullTimePayrollDetailResponse) ?? null)
      : null
  const partTimeData =
    selectedPayrollType !== 'REGULAR'
      ? ((payrollDetailData?.data as PartTimePayrollDetailResponse) ?? null)
      : null

  const { mutateAsync: downloadExcel } = useDownloadPayrollExcel()

  const handleDownload = async () => {
    if (!selectedPayrollId) return
    try {
      const { blob, filename } = await downloadExcel(selectedPayrollId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      // 에러 처리 - 무시
    }
  }

  // 팝업 애니메이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(SalaryDetailFullTimePopup)
    }, 100)
    return () => clearTimeout(timer)
  }, [SalaryDetailFullTimePopup])

  const handleClose = () => {
    setActive(false)
    setTimeout(() => {
      setSalaryDetailFullTimePopup(false)
    }, 250)
  }

  const isFullTime = selectedPayrollType === 'REGULAR'

  const renderContent = () => {
    if (loading) {
      return (
        <div className="pop-tit-cont-wrap">
          <div className="data-item">
            <div className="workplace-empty">불러오는 중...</div>
          </div>
        </div>
      )
    }
    if (isFullTime && fullTimeData) {
      return <FullTimeDetail data={fullTimeData} onExcelDownload={handleDownload} />
    }
    if (!isFullTime && partTimeData) {
      return <PartTimeDetail data={partTimeData} />
    }
    return null
  }

  return (
    <div className={`modal-popup full ${active ? 'act' : ''}`}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header min">
            <h3>급여 명세서 상세</h3>
            <button className="modal-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}
