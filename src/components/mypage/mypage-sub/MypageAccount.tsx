'use client'
import { useState, useEffect, useCallback } from 'react'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { salaryAccountApi } from '@/lib/api-endpoints'
import type { SalaryAccountResponse } from '@/types/api'

export default function MypageAccount() {
  const setAccountAddSheet = useBottomSheetController((state) => state.setAccountAddSheet)
  const openAccountSheet = useBottomSheetController((state) => state.openAccountSheet)
  const [accounts, setAccounts] = useState<SalaryAccountResponse[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true)
      const res = await salaryAccountApi.getAccounts()
      setAccounts(res.data ?? [])
    } catch {
      setAccounts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const handleDelete = async (id: number, bankName: string) => {
    if (!confirm(`${bankName} 계좌를 삭제하시겠습니까?`)) return
    try {
      await salaryAccountApi.deleteAccount(id)
      setAccounts((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : '계좌 삭제에 실패했습니다.')
    }
  }

  const handleSetPrimary = async (id: number) => {
    try {
      await salaryAccountApi.setPrimary(id)
      setAccounts((prev) =>
        prev.map((a) => ({ ...a, isPrimary: a.id === id }))
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : '대표 계좌 설정에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="mypage-block-wrap">
        <div className="mypage-block-inner">
          <div className="mypage-block-item">
            <div className="mypage-block-item-empty">
              <span>불러오는 중...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mypage-block-wrap">
      <div className="mypage-block-inner">
        {accounts.length === 0 ? (
          <div className="mypage-block-item">
            <div className="mypage-block-item-empty">
              <span>등록된 계좌정보가 없습니다.</span>
            </div>
          </div>
        ) : (
          accounts.map((account) => (
            <div className="mypage-block-item" key={account.id}>
              <div className="mypage-block-item-header">
                <div className="mypage-block-item-header-tit">
                  {account.bankName}
                  {account.isPrimary && <span className="badge">대표</span>}
                </div>
                <div className="mypage-block-item-header-btn">
                  <button
                    className="sub-edit-btn"
                    onClick={() => openAccountSheet({
                      id: account.id,
                      bankCode: account.bankCode,
                      bankName: account.bankName,
                      accountNumber: account.accountNumber,
                      accountHolder: account.accountHolder,
                      memo: account.memo,
                      isPrimary: account.isPrimary,
                    }, fetchAccounts)}
                    title="수정"
                  >
                  </button>
                  <button
                    className="sub-delete-btn"
                    onClick={() => handleDelete(account.id, account.bankName)}
                  >
                  </button>
                </div>
              </div>
              <div className="mypage-block-item-body">
                <ul className="mypage-block-item-data-list">
                  <li className="mypage-block-item-data-list-item">{account.accountHolder}</li>
                  {account.memo && (
                    <li className="mypage-block-item-data-list-item">{account.memo}</li>
                  )}
                </ul>
                <ul className="mypage-block-item-data-list">
                  <li className="mypage-block-item-data-list-item">{account.accountNumber}</li>
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="add-btn-wrap">
        <button className="btn-form block add-btn" onClick={() => openAccountSheet(undefined, fetchAccounts)}>
          <i className="add-icon"></i> 계좌 정보 추가
        </button>
      </div>
    </div>
  )
}
