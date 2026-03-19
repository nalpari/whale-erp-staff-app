'use client'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { usePopupController } from '@/store/usePopupController'

export default function EmploySuccess() {
  const setAccountSelectSheet = useBottomSheetController((state) => state.setAccountSelectSheet)
  const setContractHistoryPopup = usePopupController((state) => state.setContractHistoryPopup)

  return (
    <div className="employcont-container">
      <div className="employ-success-btn-wrap">
        <button className="btn-form login block" onClick={() => setContractHistoryPopup(true)}>
          계약이력
        </button>
        <button className="btn-form outline block">
          계약서 다운로드 <i className="download"></i>
        </button>
      </div>
      <div className="employcont-wrap">
        <div className="employcont-item">
          <div className="employcont-item-tit">점포명</div>
          <div className="employcont-item-desc">
            <span>힘이나는커피생활 을지로3가점</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">사업자등록번호</div>
          <div className="employcont-item-desc">
            <span>105-88-88888</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">점포 주소</div>
          <div className="employcont-item-desc">
            <span>서울시 서대문구 연세로5다길 22-3, 1층</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">대표자명</div>
          <div className="employcont-item-desc">
            <span>홍길동</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">대표자 연락처</div>
          <div className="employcont-item-desc">
            <span>
              <div className="call-number">
                <i className="phone"></i>010-2222-3333
              </div>
            </span>
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
          <div className="employcont-item-tit">근로계약기간</div>
          <div className="employcont-item-desc">
            <span>2025-01-01 ~ 2025-12-31  (종료기간 없음)</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">취업장소</div>
          <div className="employcont-item-desc">
            <span>힘이나는커피생활 을지로3가점</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">업무 내용</div>
          <div className="employcont-item-desc">
            <span>매장관리 및 메뉴제조, 고객응대</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">평일근무/시급</div>
          <div className="employcont-item-desc">
            <span>평일(월,화,수,목,금) 11,000원/시간</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">토요일근무/시급</div>
          <div className="employcont-item-desc">
            <span>토요일 근무 없음</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">일요일근무/시급</div>
          <div className="employcont-item-desc">
            <span>일요일(일요일전체) 15,000원/시간</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">임금지급일</div>
          <div className="employcont-item-desc">
            <span>매달 익월 05일</span>
            <span>※ 다만, 임금지급일이 공휴일인 경우에는 전일에 지급</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">지급방법</div>
          <div className="employcont-item-desc">
            <span>예금통장에 입금</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-account-wrap">
            <div className="employcont-item-tit-wrap">
              <div className="employcont-item-tit">급여 계좌 은행명</div>
              <div className="employcont-item-desc">
                <span>한국은행</span>
              </div>
            </div>
            <div className="employcont-item-btn">
              <button className="employcont-btn" onClick={() => setAccountSelectSheet(true)}>
                계좌 변경
              </button>
            </div>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">급여 계좌 번호</div>
          <div className="employcont-item-desc">
            <span>22222222-3333333</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">급여 계좌 예금주</div>
          <div className="employcont-item-desc">
            <span>김길수</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">연차휴가</div>
          <div className="employcont-item-desc">
            <span>
              근로기준법 제 60조의 연차유급휴가는 하계 및 동계휴가, 관공서 휴일에 관한 규정에 따른 공휴일에 갈음하여
              사용함
            </span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">퇴직금</div>
          <div className="employcont-item-desc">
            <span>계속근로기간 1년에 대하여 30일분의 퇴직금을 지급함</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">기타1</div>
          <div className="employcont-item-desc">
            <span>‘사원’은 ‘회사‘가 정한 취업규칙을 성실히 준수할 의무를 부담한다.</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">계약일</div>
          <div className="employcont-item-desc">
            <span>2025-01-01</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-tit">날인일시</div>
          <div className="employcont-item-desc">
            <span>2025-01-01  02:28:42</span>
          </div>
        </div>
        <div className="employcont-item">
          <div className="employcont-item-txt">이 계약이 정함이 없는 사항은 근로기준법이 정하는 바에 의한다.</div>
        </div>
      </div>
    </div>
  )
}
