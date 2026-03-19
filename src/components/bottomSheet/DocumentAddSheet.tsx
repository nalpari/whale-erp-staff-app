import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'

export default function DocumentAddSheet() {
  // 필요한 상태와 함수만 선택적으로 구독
  const documentAddSheet = useBottomSheetController((state) => state.documentAddSheet)
  const setDocumentAddSheet = useBottomSheetController((state) => state.setDocumentAddSheet)

  return (
    <Sheet
      isOpen={documentAddSheet}
      onClose={() => setDocumentAddSheet(false)}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>서류 등록 </h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="filed-wrap">
                <div className="filed-item">
                  <div className="filed-item-tit">
                    파일 <span className="imp">*</span>
                  </div>
                  <div className="file-btn">
                    <input type="file" id="file-input" />
                    <label htmlFor="file-input" className="btn-form block outline">
                      파일 선택
                    </label>
                  </div>
                  <div className="block mt10">
                    <input type="text" className="input-frame" defaultValue="홍길동_바리스타1급.pdf" />
                  </div>
                  <div className="msg error mt10">파일을 선택해주세요.</div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">
                    건강진단 결과서 만료일 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <div className="date-picker-custom">
                      <input type="text" className="date-picker-input" defaultValue="2025.10.28" />
                    </div>
                  </div>
                  <div className="msg error mt10">건강진단 결과서 만료일을 선택해주세요.</div>
                </div>
              </div>
            </div>
            <div className="sheet-btn-wrap">
              <button className="btn-form login block">저장</button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={() => setDocumentAddSheet(false)} />
    </Sheet>
  )
}
