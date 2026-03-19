import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'

export default function EmploymentNotificationSheet() {
  // 필요한 상태와 함수만 선택적으로 구독
  const employmentNotificationSheet = useBottomSheetController((state) => state.employmentNotificationSheet)
  const setEmploymentNotificationSheet = useBottomSheetController((state) => state.setEmploymentNotificationSheet)

  return (
    <Sheet
      isOpen={employmentNotificationSheet}
      onClose={() => setEmploymentNotificationSheet(false)}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>
                <span>힘이나는 커피생활 을지로3가점</span>
                에서 <br />
                직원초대 요청을 하셨습니다.
              </h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="filed-wrap">
                <div className="filed-item">
                  <div className="filed-item-tit">
                    직원 코드 입력 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input type="text" className="input-frame" placeholder="매장에서 전달 받은 직원 코드 입력" />
                  </div>
                  <div className="msg error mt10">유효하지 않은 직원코드입니다.</div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">근무처</div>
                  <div className="block">
                    <input type="text" className="input-frame" readOnly defaultValue="힘이나는 커피생활 을지로3가점" />
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">대표자명</div>
                  <div className="block">
                    <input type="text" className="input-frame" readOnly defaultValue="홍길동" />
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">대표자 연락처</div>
                  <div className="block">
                    <input type="text" className="input-frame" readOnly defaultValue="010 2222 3333" />
                  </div>
                </div>
              </div>
            </div>
            <div className="sheet-btn-wrap">
              <button className="btn-form login block">추가 및 근로계약 체결</button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={() => setEmploymentNotificationSheet(false)} />
    </Sheet>
  )
}
