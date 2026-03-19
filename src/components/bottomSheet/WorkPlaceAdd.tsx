import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'

export default function WorkPlaceAddSheet() {
  // 필요한 상태와 함수만 선택적으로 구독
  const workPlaceAddSheet = useBottomSheetController((state) => state.workPlaceAddSheet)
  const setWorkPlaceAddSheet = useBottomSheetController((state) => state.setWorkPlaceAddSheet)

  return (
    <Sheet
      isOpen={workPlaceAddSheet}
      onClose={() => setWorkPlaceAddSheet(false)}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>근무처 추가</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="filed-wrap">
                <div className="filed-item">
                  <div className="filed-item-tit">
                    사장님께 받은 직원 코드 입력 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input type="text" className="input-frame" placeholder="직원 코드를 입력하세요." />
                  </div>
                  <div className="msg error mt10">유효하지 않은 직원코드입니다.</div>
                </div>
              </div>
            </div>
            <div className="sheet-btn-wrap">
              <button className="btn-form login block">저장</button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={() => setWorkPlaceAddSheet(false)} />
    </Sheet>
  )
}
