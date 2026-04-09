'use client'
import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'

const BANK_LIST = [
  { code: 'BNKCD_004', name: 'KB국민은행' },
  { code: 'BNKCD_088', name: '신한은행' },
  { code: 'BNKCD_020', name: '우리은행' },
  { code: 'BNKCD_081', name: '하나은행' },
  { code: 'BNKCD_003', name: 'IBK기업은행' },
  { code: 'BNKCD_011', name: 'NH농협은행' },
  { code: 'BNKCD_023', name: 'SC제일은행' },
  { code: 'BNKCD_027', name: '한국씨티은행' },
  { code: 'BNKCD_089', name: '케이뱅크' },
  { code: 'BNKCD_090', name: '카카오뱅크' },
  { code: 'BNKCD_092', name: '토스뱅크' },
  { code: 'BNKCD_007', name: '수협은행' },
  { code: 'BNKCD_031', name: '대구은행' },
  { code: 'BNKCD_032', name: '부산은행' },
  { code: 'BNKCD_034', name: '광주은행' },
  { code: 'BNKCD_035', name: '제주은행' },
  { code: 'BNKCD_037', name: '전북은행' },
  { code: 'BNKCD_039', name: '경남은행' },
  { code: 'BNKCD_045', name: '새마을금고' },
  { code: 'BNKCD_048', name: '신협중앙회' },
  { code: 'BNKCD_071', name: '우체국' },
]

export default function BankSelectSheet() {
  const bankSelectSheet = useBottomSheetController((state) => state.bankSelectSheet)
  const setBankSelectSheet = useBottomSheetController((state) => state.setBankSelectSheet)
  const onBankSelect = useBottomSheetController((state) => state.onBankSelect)

  const handleSelect = (bankCode: string, bankName: string) => {
    onBankSelect?.(bankCode, bankName)
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
                  <div className="bank-item" key={bank.code}>
                    <button className="bank-btn" onClick={() => handleSelect(bank.code, bank.name)}>
                      {bank.name}
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
