'use client'
import { useState, useEffect } from 'react'
import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { salaryAccountApi, workplaceApi } from '@/lib/api-endpoints'
import type { SalaryAccountResponse } from '@/types/api'

export default function AccountSelect() {
  const accountSelectSheet = useBottomSheetController((state) => state.accountSelectSheet)
  const setAccountSelectSheet = useBottomSheetController((state) => state.setAccountSelectSheet)
  const selectedWorkplaceForAccount = useBottomSheetController((state) => state.selectedWorkplaceForAccount)

  const [accounts, setAccounts] = useState<SalaryAccountResponse[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (accountSelectSheet) {
      setLoading(true)
      salaryAccountApi.getAccounts()
        .then((res) => {
          setAccounts(res.data ?? [])
          // 대표 계좌를 기본 선택
          const primary = (res.data ?? []).find((a) => a.isPrimary)
          setSelectedId(primary?.id ?? null)
        })
        .catch(() => setAccounts([]))
        .finally(() => setLoading(false))
    }
  }, [accountSelectSheet])

  const handleSave = async () => {
    if (!selectedId || !selectedWorkplaceForAccount) return
    try {
      setSaving(true)
      await workplaceApi.changeSalaryAccount(selectedWorkplaceForAccount, selectedId)
      setAccountSelectSheet(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : '급여계좌 변경에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet
      isOpen={accountSelectSheet}
      onClose={() => setAccountSelectSheet(false)}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>급여계좌 변경</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="filed-wrap">
                <div className="filed-item">
                  <div className="block">
                    {loading ? (
                      <div style={{ padding: '12px', textAlign: 'center', color: '#999' }}>불러오는 중...</div>
                    ) : accounts.length === 0 ? (
                      <div style={{ padding: '12px', textAlign: 'center', color: '#999' }}>
                        등록된 계좌가 없습니다. 급여 계좌 관리에서 먼저 등록해주세요.
                      </div>
                    ) : (
                      <select
                        className="select-form"
                        value={selectedId ?? ''}
                        onChange={(e) => setSelectedId(Number(e.target.value))}
                      >
                        <option value="" disabled>계좌를 선택하세요</option>
                        {accounts.map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            {acc.bankName} {acc.accountNumber} {acc.accountHolder}
                            {acc.isPrimary ? ' (대표)' : ''}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="sheet-btn-wrap">
              <button
                className="btn-form login block"
                onClick={handleSave}
                disabled={saving || !selectedId || accounts.length === 0}
              >
                {saving ? '변경 중...' : '저장'}
              </button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={() => setAccountSelectSheet(false)} />
    </Sheet>
  )
}
