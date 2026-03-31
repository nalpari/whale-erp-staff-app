'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { workplaceApi } from '@/lib/api-endpoints'
import type { WorkplaceDetailResponse } from '@/types/api'

export default function WorkPlaceDetail() {
  const params = useParams()
  const employeeInfoId = Number(params?.id)

  const setAccountSelectSheet = useBottomSheetController((state) => state.setAccountSelectSheet)
  const setSelectedWorkplaceForAccount = useBottomSheetController((state) => state.setSelectedWorkplaceForAccount)

  const [detail, setDetail] = useState<WorkplaceDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDetail = useCallback(async () => {
    if (!employeeInfoId) return
    try {
      setLoading(true)
      const res = await workplaceApi.getWorkplaceDetail(employeeInfoId)
      setDetail(res.data)
    } catch {
      setDetail(null)
    } finally {
      setLoading(false)
    }
  }, [employeeInfoId])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  // AccountSelect 닫힐 때 새로고침
  const accountSelectSheet = useBottomSheetController((state) => state.accountSelectSheet)
  useEffect(() => {
    if (!accountSelectSheet) {
      const timer = setTimeout(() => fetchDetail(), 300)
      return () => clearTimeout(timer)
    }
  }, [accountSelectSheet, fetchDetail])

  const handleChangeSalaryAccount = () => {
    setSelectedWorkplaceForAccount(employeeInfoId)
    setAccountSelectSheet(true)
  }

  if (loading) {
    return (
      <div className="data-wrap">
        <div className="data-list">
          <div className="data-item">
            <div className="workplace-empty">불러오는 중...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="data-wrap">
        <div className="data-list">
          <div className="data-item">
            <div className="workplace-empty">근무처 정보를 찾을 수 없습니다.</div>
          </div>
        </div>
      </div>
    )
  }

  const { workplace, employee, salaryAccount } = detail

  return (
    <div className="data-wrap">
      <div className="data-list">
        {/* 근무처 정보 */}
        <div className="data-item">
          <div className="sub-tit-wrap">
            <div className="sub-tit">{workplace.name}</div>
          </div>
          <table className="data-table">
            <colgroup>
              <col width="60px" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <th>근무장소</th>
                <td>{workplace.address || '-'}</td>
              </tr>
              <tr>
                <th>대표자명</th>
                <td>{workplace.representativeName || '-'}</td>
              </tr>
              <tr>
                <th>점포 전화</th>
                <td>{workplace.storePhone || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 나의 정보 */}
        <div className="data-item">
          <div className="sub-tit-wrap">
            <div className="sub-tit">나의 정보</div>
          </div>
          <table className="data-table">
            <colgroup>
              <col width="115px" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <th>이름</th>
                <td>{employee.name}</td>
              </tr>
              <tr>
                <th>사번</th>
                <td>{employee.employeeNumber}</td>
              </tr>
              <tr>
                <th>계약분류/직급/직책</th>
                <td>
                  {[employee.contractClassification, employee.rank, employee.position]
                    .filter(Boolean)
                    .join('/') || '-'}
                </td>
              </tr>
              <tr>
                <th>근무여부</th>
                <td>{employee.workStatusName || '-'}</td>
              </tr>
              <tr>
                <th>입사일</th>
                <td>{employee.hireDate || '-'}</td>
              </tr>
              <tr>
                <th>퇴사일</th>
                <td>{employee.resignationDate || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 급여계좌 정보 */}
        <div className="data-item">
          <div className="sub-tit-wrap">
            <div className="sub-tit">급여계좌 정보</div>
          </div>
          <table className="data-table">
            <colgroup>
              <col width="115px" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <th>은행명</th>
                <td>{salaryAccount?.bankName || '-'}</td>
              </tr>
              <tr>
                <th>계좌 번호</th>
                <td>{salaryAccount?.accountNumber || '-'}</td>
              </tr>
              <tr>
                <th>예금주</th>
                <td>{salaryAccount?.accountHolder || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="data-btn-wrap">
        <button className="btn-form login block" onClick={handleChangeSalaryAccount}>
          급여계좌 변경
        </button>
      </div>
    </div>
  )
}
