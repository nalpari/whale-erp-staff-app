import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'

export default function AccountSelect() {
  // 필요한 상태와 함수만 선택적으로 구독
  const accountSelectSheet = useBottomSheetController((state) => state.accountSelectSheet)
  const setAccountSelectSheet = useBottomSheetController((state) => state.setAccountSelectSheet)

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
                    <select className="select-form">
                      <option value="1">한국은행 ******1234 홍*동</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="sheet-btn-wrap">
              <button className="btn-form login block">저장</button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={() => setAccountSelectSheet(false)} />
    </Sheet>
  )
}
