import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'

export default function StoreSheet() {
  // 필요한 상태와 함수만 선택적으로 구독
  const storeSheet = useBottomSheetController((state) => state.storeSheet)
  const setStoreSheet = useBottomSheetController((state) => state.setStoreSheet)

  return (
    <Sheet isOpen={storeSheet} onClose={() => setStoreSheet(false)} detent="content" disableScrollLocking={true}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>근무처 선택</h3>
            </div>
            <div className=" bottom-sheet-body">
              <ul className="array-list">
                <li className="array-item">
                  <button className="array-btn">힘이나는커피생활 을지로3가점</button>
                </li>
                <li className="array-item">
                  <button className="array-btn">메가커피 종로점</button>
                </li>
                <li className="array-item">
                  <button className="array-btn">바나프레소무교점</button>
                </li>
              </ul>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={() => setStoreSheet(false)} />
    </Sheet>
  )
}
