'use client'
import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'

const BANK_LIST = [
  '국민은행', '신한은행', '우리은행', '하나은행', 'NH농협은행',
  'IBK기업은행', 'SC제일은행', '씨티은행', 'KDB산업은행',
  '수협은행', '대구은행', '부산은행', '광주은행', '전북은행',
  '제주은행', '경남은행', '새마을금고', '신협', '저축은행',
  '우체국', '카카오뱅크', '토스뱅크', 'K뱅크',
]

export default function BankSelectSheet() {
  const bankSelectSheet = useBottomSheetController((state) => state.bankSelectSheet)
  const setBankSelectSheet = useBottomSheetController((state) => state.setBankSelectSheet)
  const onBankSelect = useBottomSheetController((state) => state.onBankSelect)

  const handleSelect = (bankName: string) => {
    onBankSelect?.(bankName)
    setBankSelectSheet(false)
  }

  return (
    <Sheet
      isOpen={bankSelectSheet}
      onClose={() => setBankSelectSheet(false)}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>은행 선택</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="bank-list">
                {BANK_LIST.map((bank) => (
                  <div className="bank-item" key={bank}>
                    <button className="bank-btn" onClick={() => handleSelect(bank)}>
                      {bank}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={() => setBankSelectSheet(false)} />
    </Sheet>
  )
}
