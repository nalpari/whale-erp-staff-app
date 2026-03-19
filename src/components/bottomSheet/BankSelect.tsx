import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'

export default function BankSelectSheet() {
  // 필요한 상태와 함수만 선택적으로 구독
  const bankSelectSheet = useBottomSheetController((state) => state.bankSelectSheet)
  const setBankSelectSheet = useBottomSheetController((state) => state.setBankSelectSheet)

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
                <div className="bank-item">
                  <button className="bank-btn">현대</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn">신한</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn">비씨(페이북)</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn">KB국민</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn act">삼성</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn">롯데</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn">하나(외환)</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn">NH채움</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn">우리</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn">수협</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn">시티</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn">광주</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn">전북</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn">제주</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn">신협체크</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn">MG새마을체크</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn">저축은행체크</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn">우체국카드</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn">KDB산업은행</button>
                </div>
                <div className="bank-item">
                  <button className="bank-btn">카카오뱅크</button>
                </div>
              </div>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={() => setBankSelectSheet(false)} />
    </Sheet>
  )
}
