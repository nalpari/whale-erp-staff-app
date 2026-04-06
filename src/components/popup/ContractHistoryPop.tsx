'use client'

import { usePopupController } from '@/store/usePopupController'
import { useEffect, useState } from 'react'
import { useContractHistory } from '@/hooks/queries/use-contract-queries'
import type { ContractHistoryItem } from '@/types/api'

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-'
  return dateStr.replace(/-/g, '.')
}

export default function ContractHistoryPop() {
  const [active, setActive] = useState(false)
  const ContractHistoryPopup = usePopupController((state) => state.ContractHistoryPopup)
  const setContractHistoryPopup = usePopupController((state) => state.setContractHistoryPopup)
  const { data, isPending } = useContractHistory(ContractHistoryPopup)
  const historyItems: ContractHistoryItem[] = data?.data?.items ?? []
  const loading = ContractHistoryPopup && isPending

  // 계약 상세 팝업 열기
  const setEmploymentPopFrame = usePopupController((state) => state.setEmploymentPopFrame)
  const setSelectedContractId = usePopupController((state) => state.setSelectedContractId)
  const setEmploymentStep = usePopupController((state) => state.setEmploymentStep)

  useEffect(() => {
    const t = setTimeout(() => {
      setActive(ContractHistoryPopup)
    }, 100)
    return () => clearTimeout(t)
  }, [ContractHistoryPopup])

  const handleClose = () => {
    setActive(false)
    setTimeout(() => {
      setContractHistoryPopup(false)
    }, 250)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETE': return '계약완료'
      case 'REFUSAL': return '거절'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETE': return '#2563eb'
      case 'REFUSAL': return '#dc2626'
      default: return '#666'
    }
  }

  const handleViewDetail = (item: ContractHistoryItem) => {
    setSelectedContractId(item.contractId)
    // COMPLETE/REFUSAL은 체결완료 화면(EmploySuccess)으로 표시
    setEmploymentStep(true)
    setEmploymentPopFrame(true)
  }

  return (
    <div className={`modal-popup full ${active ? 'act' : ''}`}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header min">
            <h3>계약 이력</h3>
            <button className="modal-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="pop-cont-wrap">
              {loading && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>로딩 중...</div>
              )}
              {!loading && historyItems.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>계약 이력이 없습니다.</div>
              )}
              {!loading && historyItems.map((item, idx) => (
                <div
                  className="pop-cont-item"
                  key={item.contractId}
                  style={{ cursor: 'pointer', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}
                  onClick={() => handleViewDetail(item)}
                >
                  {/* 요약 정보 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '15px' }}>{item.storeName ?? '-'}</span>
                      <span style={{ fontSize: '12px', color: getStatusColor(item.status), fontWeight: 600, padding: '2px 8px', backgroundColor: item.status === 'COMPLETE' ? '#eff6ff' : '#fef2f2', borderRadius: '4px' }}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#999' }}>{historyItems.length - idx}</span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#666' }}>
                    {item.contractClassification && <span>{item.contractClassification} · </span>}
                    {item.contractStartDate && item.contractEndDate && (
                      <span>{formatDate(item.contractStartDate)} ~ {formatDate(item.contractEndDate)}</span>
                    )}
                  </div>

                  {/* 상세 정보 (항상 펼침) */}
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                    <div className="contract-info">
                      <div className="contract-info-item">
                        <div className="contract-info-item-tit">계약서 전송일시</div>
                        <div className="contract-info-item-desc">{formatDateTime(item.contractSendDate)}</div>
                      </div>
                      <div className="contract-info-item">
                        <div className="contract-info-item-tit">계약서 열람일시</div>
                        <div className="contract-info-item-desc">{formatDateTime(item.contractViewDate)}</div>
                      </div>
                      {item.status === 'COMPLETE' && (
                        <>
                          <div className="contract-info-item">
                            <div className="contract-info-item-tit">전자서명 일시</div>
                            <div className="contract-info-item-desc">{formatDateTime(item.signedDate)}</div>
                          </div>
                          <div className="contract-info-item">
                            <div className="contract-info-item-tit">서명자 정보</div>
                            <div className="contract-info-item-desc">{item.signerName ?? '-'}</div>
                          </div>
                        </>
                      )}
                      {item.status === 'REFUSAL' && (
                        <div className="contract-info-item">
                          <div className="contract-info-item-tit">거절일시</div>
                          <div className="contract-info-item-desc">{formatDateTime(item.rejectedDate)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
