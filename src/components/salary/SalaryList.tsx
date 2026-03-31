'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePopupController } from '@/store/usePopupController'
import { payrollApi } from '@/lib/api-endpoints'
import type { PayrollListResponse } from '@/types/api'

export default function SalaryList() {
  const setSalaryDetailFullTimePopup = usePopupController((state) => state.setSalaryDetailFullTimePopup)
  const setSelectedPayrollId = usePopupController((state) => state.setSelectedPayrollId)
  const setSelectedPayrollType = usePopupController((state) => state.setSelectedPayrollType)

  const [payrolls, setPayrolls] = useState<PayrollListResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchPayrolls = useCallback(async (pageNum: number, append = false) => {
    try {
      if (pageNum === 0) setLoading(true)
      else setLoadingMore(true)

      const res = await payrollApi.getPayrolls({ page: pageNum, size: 20 })
      const data = res.data

      if (data.content.length === 0) {
        setHasMore(false)
      } else {
        setPayrolls(prev => append ? [...prev, ...data.content] : data.content)
        setHasMore(pageNum < data.totalPages - 1)
      }
    } catch {
      if (!append) setPayrolls([])
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    fetchPayrolls(0)
  }, [fetchPayrolls])

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchPayrolls(nextPage, true)
    }
  }

  const handleOpenDetail = (payroll: PayrollListResponse) => {
    setSelectedPayrollId(payroll.id)
    setSelectedPayrollType(payroll.payrollType)
    setSalaryDetailFullTimePopup(true)
  }

  if (loading) {
    return (
      <div className="data-wrap">
        <div className="data-tit">급여명세서</div>
        <div className="data-list">
          <div className="data-item">
            <div className="workplace-empty">불러오는 중...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="data-wrap">
      <div className="data-tit">급여명세서</div>
      <div className="data-list">
        {payrolls.length === 0 ? (
          <div className="data-item">
            <div className="workplace-empty">등록된 급여명세서가 없습니다.</div>
          </div>
        ) : (
          <>
            {payrolls.map((payroll) => (
              <button
                className="data-item"
                key={payroll.id}
                onClick={() => handleOpenDetail(payroll)}
              >
                <div className="salary-item-inner">
                  <div className="salary-tit-wrap">
                    <div className="salary-tit">{payroll.payrollMonth}</div>
                    <div className="salary-btn-wrap">
                      <div className="data-list-arr"></div>
                    </div>
                  </div>
                  <div className="data-table-wrap">
                    <table className="data-table">
                      <colgroup>
                        <col width="70px" />
                        <col />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th>급여일</th>
                          <td>{payroll.paymentDate}</td>
                        </tr>
                        <tr>
                          <th>정산기간</th>
                          <td>{payroll.settlementPeriod}</td>
                        </tr>
                        <tr>
                          <th>근무처</th>
                          <td>{payroll.workplaceName}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </button>
            ))}
            {hasMore && (
              <button className="data-item" onClick={handleLoadMore} disabled={loadingMore}>
                <div className="workplace-empty">
                  {loadingMore ? '불러오는 중...' : '더보기'}
                </div>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
