import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'

export default function PhoneChangeSheet() {
  // 필요한 상태와 함수만 선택적으로 구독
  const phoneChangeSheet = useBottomSheetController((state) => state.phoneChangeSheet)
  const setPhoneChangeSheet = useBottomSheetController((state) => state.setPhoneChangeSheet)

  return (
    <Sheet
      isOpen={phoneChangeSheet}
      onClose={() => setPhoneChangeSheet(false)}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>휴대폰 번호 변경</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="filed-wrap">
                <div className="filed-item">
                  <div className="filed-item-tit">
                    이름 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input type="text" className="input-frame" defaultValue="홍길동" />
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">
                    휴대폰 번호 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input type="text" className="input-frame" placeholder="010 1234 4321" />
                  </div>
                  <div className="btn-wrap mt10">
                    <button className="btn-form outline block">인증번호 요청</button>
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">
                    인증번호 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input type="text" className="input-frame" placeholder="인증번호 입력" />
                  </div>
                </div>
              </div>
            </div>
            <div className="sheet-btn-wrap">
              <button className="btn-form login block">인증확인</button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={() => setPhoneChangeSheet(false)} />
    </Sheet>
  )
}
