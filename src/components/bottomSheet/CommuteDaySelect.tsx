import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'

export default function CommuteDaySelect() {
  // 필요한 상태와 함수만 선택적으로 구독
  const commuteDaySelectSheet = useBottomSheetController((state) => state.commuteDaySelectSheet)
  const setCommuteDaySelectSheet = useBottomSheetController((state) => state.setCommuteDaySelectSheet)

  return (
    <Sheet
      isOpen={commuteDaySelectSheet}
      onClose={() => setCommuteDaySelectSheet(false)}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>기간 설정</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="filed-wrap">
                <div className="filed-item">
                  <div className="filed-flx g8">
                    <button className="btn-form outline s block active">최근 7일</button>
                    <button className="btn-form outline s block">이번달</button>
                    <button className="btn-form outline s block">지난달</button>
                    <button className="btn-form outline s block">직접입력</button>
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-flx g8">
                    <div className="date-picker-custom">
                      <input type="text" className="date-picker-input" defaultValue="2025.10.28" />
                    </div>
                    <span>~</span>
                    <div className="date-picker-custom">
                      <input type="text" className="date-picker-input" defaultValue="2025.10.28" />
                    </div>
                  </div>
                  <div className="msg txt mt10">※ 최대 3개월까지 조회가 가능합니다.</div>
                </div>
              </div>
            </div>
            <div className="sheet-btn-wrap">
              <button className="btn-form outline block">초기화</button>
              <button className="btn-form login block">적용</button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={() => setCommuteDaySelectSheet(false)} />
    </Sheet>
  )
}
