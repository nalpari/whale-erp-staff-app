import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'

export default function CertificateAddSheet() {
  // 필요한 상태와 함수만 선택적으로 구독
  const certificateAddSheet = useBottomSheetController((state) => state.certificateAddSheet)
  const setCertificateAddSheet = useBottomSheetController((state) => state.setCertificateAddSheet)

  return (
    <Sheet
      isOpen={certificateAddSheet}
      onClose={() => setCertificateAddSheet(false)}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>자격증 정보 등록 </h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="filed-wrap">
                <div className="filed-item">
                  <div className="filed-item-tit">
                    자격증명 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input type="text" className="input-frame" defaultValue="홍길동" />
                  </div>
                  <div className="msg error mt10">자격증명을 입력해주세요.</div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">
                    유효기간 <span className="imp">*</span>
                  </div>
                  <div className="filed-flx g8">
                    <div className="date-picker-custom">
                      <input type="text" className="date-picker-input" defaultValue="2025.10.28" />
                    </div>
                    <span>~</span>
                    <div className="date-picker-custom">
                      <input type="text" className="date-picker-input" defaultValue="2025.10.28" />
                    </div>
                  </div>
                  <div className="msg error mt10">유효기간을 선택해주세요.</div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">
                    취득일 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <div className="date-picker-custom">
                      <input type="text" className="date-picker-input" defaultValue="2025.10.28" />
                    </div>
                    <div className="msg error mt10">취득일을 선택해주세요.</div>
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">
                    발급 기관 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input type="text" className="input-frame" defaultValue="한국커피협회(KCA)" />
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">자격증 파일</div>
                  <div className="file-btn">
                    <input type="file" id="file-input" />
                    <label htmlFor="file-input" className="btn-form block outline">
                      파일 선택
                    </label>
                  </div>
                  <div className="block mt10">
                    <input type="text" className="input-frame" defaultValue="홍길동_바리스타1급.pdf" />
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
      <Sheet.Backdrop onTap={() => setCertificateAddSheet(false)} />
    </Sheet>
  )
}
