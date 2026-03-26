'use client'

import { useEffect, useState } from 'react'
import { usePopupController } from '@/store/usePopupController'
import { contractApi } from '@/lib/api-endpoints'
import type { ContractListResponse } from '@/types/api'

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

function getStampStyle(status: string): { className: string; label: string[] } {
  switch (status) {
    case 'PENDING':
      return { className: 'blue', label: ['계약', '하기'] }
    case 'COMPLETED':
      return { className: 'grey', label: ['계약', '완료'] }
    case 'REJECTED':
      return { className: 'red', label: ['거절'] }
    default:
      return { className: 'grey', label: [status] }
  }
}

export default function EmploymentList() {
  const setEmploymentPopFrame = usePopupController((state) => state.setEmploymentPopFrame)
  const setSelectedContractId = usePopupController((state) => state.setSelectedContractId)
  const [contracts, setContracts] = useState<ContractListResponse[]>([])
  const [loading, setLoading] = useState(true)

  // 팝업 스토어에 선택된 계약 ID 저장용
  const setContractHistoryPopup = usePopupController((s) => s.setContractHistoryPopup)

  useEffect(() => {
    contractApi.getContracts()
      .then((res) => {
        setContracts(res.data ?? [])
      })
      .catch((err) => {
        console.error('계약 목록 조회 실패:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleContractClick = (contract: ContractListResponse) => {
    // 전역 스토어에 선택된 계약 ID 저장 (팝업 컴포넌트에서 상세 조회 시 사용)
    setSelectedContractId(contract.id)
    if (contract.status === 'PENDING') {
      // 계약 체결 팝업 열기
      setEmploymentPopFrame(true)
    } else {
      // 계약 상세/이력 보기
      setContractHistoryPopup(true)
    }
  }

  if (loading) {
    return (
      <div className="data-wrap">
        <div className="data-tit">근로계약서</div>
        <div className="data-list">
          <div className="data-item">
            <div className="workplace-empty" style={{ color: '#999' }}>불러오는 중...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="data-wrap">
      <div className="data-tit">근로계약서</div>
      <div className="data-list">
        {contracts.length === 0 ? (
          <div className="data-item">
            <div className="workplace-empty">등록된 근로계약이 없습니다.</div>
          </div>
        ) : (
          contracts.map((contract) => {
            const stamp = getStampStyle(contract.status)
            return (
              <button
                className="data-item"
                key={contract.id}
                onClick={() => handleContractClick(contract)}
              >
                <div className="employment-item-inner">
                  <div className={`employment-stemp ${stamp.className}`}>
                    {stamp.label.map((text, i) => (
                      <span key={i}>{text}</span>
                    ))}
                  </div>
                  <div className="employment-info">
                    <div className="employment-info-name">{contract.storeName}</div>
                    <div className="employment-info-desc">
                      <span>수신일 {formatDate(contract.receivedDate)}</span>
                      <span>체결일 {formatDate(contract.completedDate)}</span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
