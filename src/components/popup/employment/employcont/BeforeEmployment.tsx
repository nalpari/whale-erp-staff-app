import { usePopupController } from '@/store/usePopupController'

export default function BeforeEmployment() {
  const setSignPopup = usePopupController((state) => state.setSignPopup)
  return (
    <div className="employcont-container">
      <div className="employcont-wrap">
        <div className="employcont-item">
          <div className="employcont-item-tit">회사명</div>
          <div className="employcont-item-desc">
            <span>주식회사 따름인</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">사업자등록번호</div>
          <div className="employcont-item-desc">
            <span>105-88-88888</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">회사 주소</div>
          <div className="employcont-item-desc">
            <span>서울시 서대문구 연세로5다길 22-3, 1층</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">취업자명</div>
          <div className="employcont-item-desc">
            <span>김길수</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">주민등록번호</div>
          <div className="employcont-item-desc">
            <span>050101-2******</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">주소</div>
          <div className="employcont-item-desc">
            <span>서울시 서대문구 연세로5다길 22-3, 1층</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">근로 장소</div>
          <div className="employcont-item-desc">
            <span>
              회사 및 기타 업무상 필요가 있을 경우 ‘사원’의 근무장소 또는 업무내용을 변경할 수 있으며, 이 경우 ‘사원’은
              특별한 사정이 없는 한 이에 따라야 한다.
            </span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">근로계약기간</div>
          <div className="employcont-item-desc">
            <span>2025-01-01 ~ 2025-12-31  (종료기간 없음)</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">계약 분류</div>
          <div className="employcont-item-desc">
            <span>정직원</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">평일 근무시간</div>
          <div className="employcont-item-desc">
            <span>1주일 5일 평일(월,화,수,목,금)</span>
            <span>근무시간 : 09:00 ~  18:00</span>
            <span>휴게시간 : 12:00 ~ 13:00</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">토요일 근무시간</div>
          <div className="employcont-item-desc">
            <span>1주일 1일 토요일(격주)</span>
            <span>근무시간 : 09:00 ~  18:00</span>
            <span>휴게시간 : 12:00 ~ 13:00</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">일요일 근무시간</div>
          <div className="employcont-item-desc">
            <span>1주 1일 일요일</span>
            <span>근무시간 : 09:00 ~  18:00</span>
            <span>휴게시간 : 12:00 ~ 13:00</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">근로시간 기타</div>
          <div className="employcont-item-desc">
            <span>‘사원’은 업무상 필요한 경우 연장근로시간, 휴일근로, 야간근로를 실시하는데 동의한다.</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">휴일</div>
          <div className="employcont-item-desc">
            <span>주휴일(매주 토요일, 일요일), 근로자의 날은 유급휴일로 한다.</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">연차 휴가</div>
          <div className="employcont-item-desc">
            <span>‘회사’는 ‘사원’에게 근로기준법에 따른 연차휴가를 준다.</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">퇴사 시 업무인수인계</div>
          <div className="employcont-item-desc">
            <span>
              ‘사원’은 근속기간 중 근로계약을 해지하고자 할 때에는 퇴직 예정일 1개월전까지 ‘회사’에 통보하고
              업무인수인계를 모두 마친 후에 퇴사하여야 하며, 사직서가 수리되기 전에 퇴사하는 경우 무단 결근으로
              처리한다.
            </span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">기타1</div>
          <div className="employcont-item-desc">
            <span>이 계약에 정함이 없는 사항은 근로기준법 등 노동관계법령 및 취업규칙에 의한다.</span>
          </div>
        </div>
      </div>
      <div className="employcont-check-warp">
        <div className="check-form-box">
          <input type="checkbox" id="check-form-2" />
          <label htmlFor="check-form-2">
            본인은 근로기준법 제17조에 따른 주요 근로조건이 서면으로 명시되었음을 확인하였으며, 근로계약서를 교부
            받았습니다.
          </label>
        </div>
      </div>
      <div className="employcont-btn-wrap">
        <button className="btn-form outline block">거절 하기</button>
        <button className="btn-form login block" onClick={() => setSignPopup(true)}>
          동의하기 (SIGN)
        </button>
      </div>
    </div>
  )
}
