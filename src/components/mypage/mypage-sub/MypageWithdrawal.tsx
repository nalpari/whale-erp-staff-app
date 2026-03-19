export default function MypageWithdrawal() {
  return (
    <div className="mypage-block-wrap">
      <div className="withdrawal-header">
        <h1>
          홍*동님,
          <br />
          탈퇴 이유를 알려주세요.
        </h1>
        <div className="withdrawal-header-desc">더 좋은 서비스를 제공하기 위해 노력하겠습니다.</div>
      </div>
      <div className="withdrawal-check-list">
        <button className="withdrawal-check-item act">
          <div className="withdrawal-check-item-label">이용할 수 있는 점포 부족</div>
          <i className="withdrawal-check-item-icon"></i>
        </button>
        <button className="withdrawal-check-item ">
          <div className="withdrawal-check-item-label">앱 사용이 불편하거나 어려움</div>
          <i className="withdrawal-check-item-icon"></i>
        </button>
        <button className="withdrawal-check-item act">
          <div className="withdrawal-check-item-label">유사한 타 서비스 이용</div>
          <i className="withdrawal-check-item-icon"></i>
        </button>
        <button className="withdrawal-check-item ">
          <div className="withdrawal-check-item-label">개인정보 변경으로 인한 재가입</div>
          <i className="withdrawal-check-item-icon"></i>
        </button>
      </div>
      <div className="withdrawal-textarea-wrap">
        <div className="withdrawal-textarea-tit">직접입력 (0 / 200)</div>
        <div className="block">
          <textarea
            name=""
            id=""
            maxLength={200}
            className="textarea-form"
            placeholder="소중한 의견을 들려주세요."
          ></textarea>
        </div>
      </div>
      <div className="withdrawal-warning-wrap">
        <div className="withdrawal-warning-tit">탈퇴 전 꼭 확인해주세요.</div>
        <div className="withdrawal-warning-desc">
          회원 탈퇴 시 개인정보 및 근로계약서/급여명세서 등의 정보가 모두 삭제됩니다. 추후 재가입해도 해당 정보는
          복구되지 않습니다.
        </div>
      </div>
      <div className="withdrawal-check">
        <div className="check-form-box">
          <input type="checkbox" id="check-form-1" />
          <label htmlFor="check-form-1">탈퇴 유의사항을 확인했습니다.</label>
        </div>
      </div>
      <div className="withdrawal-btn-wrap">
        <button className="btn-form withdrawal block">회원탈퇴 및 데이터 삭제하기</button>
      </div>
    </div>
  )
}
