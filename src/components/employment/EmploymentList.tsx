'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { usePopupController } from '@/store/usePopupController'
import { useContractList } from '@/hooks/queries/use-contract-queries'
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
    case 'PROGRESS':
      return { className: 'blue', label: ['계약', '하기'] }
    case 'COMPLETE':
      return { className: 'grey', label: ['계약', '완료'] }
    case 'REFUSAL':
      return { className: 'red', label: ['거절'] }
    default:
      return { className: 'grey', label: [status] }
  }
}

export default function EmploymentList() {
  const searchParams = useSearchParams()
  const setEmploymentPopFrame = usePopupController((state) => state.setEmploymentPopFrame)
  const setSelectedContractId = usePopupController((state) => state.setSelectedContractId)
  const { data, isPending: loading, refetch } = useContractList()
  const contracts: ContractListResponse[] = data?.data ?? []

  // 팝업 스토어에 선택된 계약 ID 저장용
  const setContractHistoryPopup = usePopupController((s) => s.setContractHistoryPopup)

  // 팝업 상태 감시 (닫힐 때 목록 갱신)
  const isEmploymentPopFrameOpen = usePopupController((s) => s.EmploymentPopFrame)
  const isContractHistoryPopupOpen = usePopupController((s) => s.ContractHistoryPopup)

  // URL search params에서 contractId가 있으면 자동으로 계약 팝업 열기
  useEffect(() => {
    const contractIdParam = searchParams.get('contractId')
    if (!contractIdParam) return
    const contractId = Number(contractIdParam)
    if (Number.isNaN(contractId)) return
    setSelectedContractId(contractId)
    setEmploymentPopFrame(true)
  }, [searchParams, setSelectedContractId, setEmploymentPopFrame])

  // 팝업이 닫힐 때 목록 갱신 (서명/거절 후)
  useEffect(() => {
    if (!isEmploymentPopFrameOpen && !isContractHistoryPopupOpen) {
      const timer = setTimeout(() => refetch(), 300)
      return () => clearTimeout(timer)
    }
  }, [isEmploymentPopFrameOpen, isContractHistoryPopupOpen, refetch])

  const handleContractClick = (contract: ContractListResponse) => {
    // 전역 스토어에 선택된 계약 ID 저장 (팝업 컴포넌트에서 상세 조회 시 사용)
    setSelectedContractId(contract.id)
    if (contract.status === 'PROGRESS') {
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
