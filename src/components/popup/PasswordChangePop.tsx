import { usePopupController } from '@/store/usePopupController'

export default function PasswordChangePop() {
  // 함수만 구독
  const setPasswordChangePopup = usePopupController((state) => state.setPasswordChangePopup)
  return (
    <div className="modal-popup">
      <div className="modal-dialog password">
        <div className="modal-content">
          <div className="modal-header">
            <h1></h1>
            <button className="modal-close" onClick={() => setPasswordChangePopup(false)}></button>
          </div>
          <div className="modal-body">
            <div className="pop-frame">
              <div className="pop-frame-tit">비밀번호 변경</div>
              <div className="filed-wrap">
                <div className="filed-item">
                  <div className="filed-item-tit">
                    현재 비밀번호 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <div className="input-icon-frame">
                      <input type="password" placeholder="Password" />
                      <button className="input-icon-btn del mr5"></button>
                      <button className="input-icon-btn hide"></button>
                    </div>
                  </div>
                  <div className="msg error mt10">현재 비밀번호가 일치하지 않습니다.</div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">
                    변경 비밀번호 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <div className="input-icon-frame">
                      <input type="password" placeholder="Password" />
                      <button className="input-icon-btn del mr5"></button>
                      <button className="input-icon-btn hide"></button>
                    </div>
                  </div>
                  <div className="msg error mt10">변경 비밀번호가 일치하지 않습니다.</div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">
                    변경 비밀번호 재입력 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <div className="input-icon-frame">
                      <input type="password" placeholder="Password" />
                      <button className="input-icon-btn del mr5"></button>
                      <button className="input-icon-btn hide"></button>
                    </div>
                  </div>
                  <div className="msg error mt10">변경 비밀번호가 일치하지 않습니다.</div>
                </div>
              </div>
              <div className="pop-btn-wrap">
                <button className="btn-form outline block">취소</button>
                <button className="btn-form login block">변경하기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
