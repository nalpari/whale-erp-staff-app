import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'

export default function AccountAddSheet() {
  // 필요한 상태와 함수만 선택적으로 구독
  const accountAddSheet = useBottomSheetController((state) => state.accountAddSheet)
  const setAccountAddSheet = useBottomSheetController((state) => state.setAccountAddSheet)

  return (
    <Sheet
      isOpen={accountAddSheet}
      onClose={() => setAccountAddSheet(false)}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>계좌 등록</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="filed-wrap">
                <div className="filed-item">
                  <div className="filed-item-tit">
                    은행명 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input type="text" className="input-frame" defaultValue="신한은행" />
                  </div>
                  <div className="msg error mt10">은행명을 입력해주세요.</div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">
                    계좌번호 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input type="text" className="input-frame" defaultValue="12345678123456" />
                  </div>
                  <div className="msg txt mt10">- 없이 숫자만 입력해주세요.</div>
                  <div className="msg error mt10">계좌번호를 입력해주세요.</div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">
                    예금주 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input type="text" className="input-frame" defaultValue="홍길동" />
                  </div>
                  <div className="msg error mt10">예금주를 입력해주세요.</div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">메모</div>
                  <div className="block">
                    <textarea name="" id="" className="textarea-form"></textarea>
                  </div>
                </div>
                <div className="filed-item">
                  <div className="check-form-box">
                    <input type="checkbox" id="check-form-1" />
                    <label htmlFor="check-form-1">대표 계좌로 설정</label>
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
      <Sheet.Backdrop onTap={() => setAccountAddSheet(false)} />
    </Sheet>
  )
}
