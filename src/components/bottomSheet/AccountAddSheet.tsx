'use client'
import { useState, useEffect } from 'react'
import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { salaryAccountApi } from '@/lib/api-endpoints'

export default function AccountAddSheet() {
  const accountAddSheet = useBottomSheetController((state) => state.accountAddSheet)
  const setAccountAddSheet = useBottomSheetController((state) => state.setAccountAddSheet)
  const openBankSelect = useBottomSheetController((state) => state.openBankSelect)
  const editingAccount = useBottomSheetController((state) => state.editingAccount)
  const onAccountSaved = useBottomSheetController((state) => state.onAccountSaved)

  const isEditMode = !!editingAccount

  const [bankCode, setBankCode] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountHolder, setAccountHolder] = useState('')
  const [memo, setMemo] = useState('')
  const [isPrimary, setIsPrimary] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<{ bank?: string; number?: string; holder?: string }>({})

  // 수정 모드일 때 상세 API로 원본 데이터 조회
  useEffect(() => {
    if (editingAccount && accountAddSheet) {
      salaryAccountApi.getAccountDetail(editingAccount.id).then((res) => {
        const raw = res.data
        setBankCode(raw.bankCode ?? '')
        setBankName(raw.bankName)
        setAccountNumber(raw.accountNumber)
        setAccountHolder(raw.accountHolder)
        setMemo(raw.memo ?? '')
        setIsPrimary(raw.isPrimary)
      }).catch(() => {
        // fallback: 목록 데이터 사용
        setBankCode(editingAccount.bankCode ?? '')
        setBankName(editingAccount.bankName)
        setAccountNumber(editingAccount.accountNumber)
        setAccountHolder(editingAccount.accountHolder)
        setMemo(editingAccount.memo ?? '')
        setIsPrimary(editingAccount.isPrimary)
      })
    }
  }, [editingAccount, accountAddSheet])

  const resetForm = () => {
    setBankCode('')
    setBankName('')
    setAccountNumber('')
    setAccountHolder('')
    setMemo('')
    setIsPrimary(false)
    setErrors({})
  }

  const handleClose = () => {
    setAccountAddSheet(false)
    resetForm()
  }

  const validate = () => {
    const errs: typeof errors = {}
    if (!bankName) errs.bank = '은행을 선택해주세요.'
    if (!accountNumber.trim()) errs.number = '계좌번호를 입력해주세요.'
    if (!accountHolder.trim()) errs.holder = '예금주를 입력해주세요.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    try {
      setSaving(true)

      if (isEditMode) {
        await salaryAccountApi.updateAccount(editingAccount.id, {
          bankCode: bankCode || undefined,
          bankName,
          accountNumber: accountNumber.replace(/-/g, ''),
          accountHolder,
          memo: memo.trim() || undefined,
        })
      } else {
        await salaryAccountApi.createAccount({
          bankCode: bankCode || undefined,
          bankName,
          accountNumber: accountNumber.replace(/-/g, ''),
          accountHolder,
          memo: memo.trim() || undefined,
          isPrimary,
        })
      }

      onAccountSaved?.()
      handleClose()
    } catch (err) {
      alert(err instanceof Error ? err.message : (isEditMode ? '계좌 수정에 실패했습니다.' : '계좌 등록에 실패했습니다.'))
    } finally {
      setSaving(false)
    }
  }

  const handleBankSelect = () => {
    openBankSelect((code, name) => {
      setBankCode(code)
      setBankName(name)
      setErrors((prev) => ({ ...prev, bank: undefined }))
    })
  }

  return (
    <Sheet
      isOpen={accountAddSheet}
      onClose={handleClose}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>{isEditMode ? '계좌 수정' : '계좌 등록'}</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="filed-wrap">
                <div className="filed-item">
                  <div className="filed-item-tit">
                    은행명 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <button
                      type="button"
                      className="input-frame"
                      onClick={handleBankSelect}
                      style={{ textAlign: 'left', cursor: 'pointer' }}
                    >
                      {bankName || '은행을 선택해주세요'}
                    </button>
                  </div>
                  {errors.bank && <div className="msg error mt10">{errors.bank}</div>}
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">
                    계좌번호 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      placeholder="- 없이 숫자만 입력해주세요"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                  </div>
                  {errors.number && <div className="msg error mt10">{errors.number}</div>}
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">
                    예금주 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      placeholder="예금주명을 입력해주세요"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                    />
                  </div>
                  {errors.holder && <div className="msg error mt10">{errors.holder}</div>}
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">메모</div>
                  <div className="block">
                    <textarea
                      className="textarea-form"
                      placeholder="메모를 입력해주세요 (선택)"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                    />
                  </div>
                </div>
                <div className="filed-item">
                  <div className="check-form-box">
                    <input
                      type="checkbox"
                      id="check-primary-account"
                      checked={isPrimary}
                      onChange={(e) => setIsPrimary(e.target.checked)}
                    />
                    <label htmlFor="check-primary-account">대표 계좌로 설정</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="sheet-btn-wrap">
              <button
                className="btn-form login block"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? '저장 중...' : (isEditMode ? '수정' : '저장')}
              </button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  )
}
