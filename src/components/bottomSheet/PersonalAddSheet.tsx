import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'

export default function PersonalAddSheet() {
  // 필요한 상태와 함수만 선택적으로 구독
  const personalAddSheet = useBottomSheetController((state) => state.personalAddSheet)
  const setPersonalAddSheet = useBottomSheetController((state) => state.setPersonalAddSheet)

  return (
    <Sheet
      isOpen={personalAddSheet}
      onClose={() => setPersonalAddSheet(false)}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>경력 정보 등록 </h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="filed-wrap">
                <div className="filed-item">
                  <div className="filed-item-tit">
                    근무처 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input type="text" className="input-frame" defaultValue="홍길동" />
                  </div>
                  <div className="msg error mt10">근무처를 선택해주세요.</div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">
                    입사일 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <div className="date-picker-custom">
                      <input type="text" className="date-picker-input" defaultValue="2025.10.28" />
                    </div>
                  </div>
                  <div className="msg error mt10">입사일을 선택해주세요.</div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">
                    퇴사일 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <div className="date-picker-custom">
                      <input type="text" className="date-picker-input" defaultValue="2025.10.28" />
                    </div>
                    <div className="msg error mt10">퇴사일을 선택해주세요.</div>
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">계약 분류</div>
                  <div className="block">
                    <select name="" id="" className="select-form">
                      <option value="">계약 분류를 선택해주세요.</option>
                    </select>
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">직급</div>
                  <div className="block">
                    <select name="" id="" className="select-form">
                      <option value="">계약 분류를 선택해주세요.</option>
                    </select>
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">직책</div>
                  <div className="block">
                    <select name="" id="" className="select-form">
                      <option value="">계약 분류를 선택해주세요.</option>
                    </select>
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">업무내용</div>
                  <div className="block">
                    <input type="text" className="input-frame" defaultValue="메뉴 제조 및 홀서빙" />
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">퇴사 사유</div>
                  <div className="block">
                    <input type="text" className="input-frame" defaultValue="메뉴 제조 및 홀서빙" />
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
      <Sheet.Backdrop onTap={() => setPersonalAddSheet(false)} />
    </Sheet>
  )
}
