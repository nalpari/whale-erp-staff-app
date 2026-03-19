'use client'
import Image from 'next/image'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { usePopupController } from '@/store/usePopupController'

export default function SignUpLayout() {
  const setBankSelectSheet = useBottomSheetController((state) => state.setBankSelectSheet)
  const setAlertPopup = usePopupController((state) => state.setAlertPopup)
  return (
    <div className="login-contents">
      <div className="signup-filed-wrap">
        <div className="signup-filed-form">
          <div className="signup-filed-tit">로그인 정보</div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">
              아이디 <span className="imp">*</span>
            </div>
            <div className="block">
              <input type="text" className="input-frame" placeholder="이름" />
            </div>
            <div className="msg success mt10">사용 가능한 아이디입니다.</div>
            <div className="msg error mt10">이미 사용 중인 아이디입니다.</div>
          </div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">
              비밀번호 <span className="imp">*</span>
            </div>
            <div className="block">
              <div className="input-icon-frame">
                <input type="password" placeholder="Password" />
                <button className="input-icon-btn del mr5"></button>
                <button className="input-icon-btn hide"></button>
              </div>
            </div>
            <div className="msg mt10">영문, 숫자, 특수문자, 8~20자 이내</div>
          </div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">
              비밀번호 재입력 <span className="imp">*</span>
            </div>
            <div className="block">
              <div className="input-icon-frame">
                <input type="password" placeholder="Password" />
                <button className="input-icon-btn hide"></button>
              </div>
            </div>
            <div className="msg error mt10">이미 사용 중인 아이디입니다.</div>
          </div>
        </div>
        <div className="signup-filed-form">
          <div className="signup-filed-tit">직원 초대 코드 입력</div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">코드 입력하면 가입 즉시 근무처와 연결됩니다.</div>
            <div className="block">
              <input type="text" className="input-frame" placeholder="" />
            </div>
            <div className="msg mt10">확인 버튼을 눌러 주세요.</div>
            <div className="btn-wrap mt10">
              <button className="btn-form outline block">확인</button>
            </div>
          </div>
        </div>
        <div className="signup-filed-form">
          <div className="signup-filed-tit">개인정보</div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">프로필 아이콘 설정</div>
            <div className="avatar-wrap">
              <button className="avatar-btn">
                <Image src="/assets/images/layout/avatar01.svg" alt="avatar" width={62} height={62} />
              </button>
              <button className="avatar-btn">
                <Image src="/assets/images/layout/avatar02.svg" alt="avatar" width={62} height={62} />
              </button>
              <button className="avatar-btn act">
                <Image src="/assets/images/layout/avatar03.svg" alt="avatar" width={62} height={62} />
              </button>
              <button className="avatar-btn">
                <Image src="/assets/images/layout/avatar04.svg" alt="avatar" width={62} height={62} />
              </button>
            </div>
          </div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">
              이름 <span className="imp">*</span>
            </div>
            <div className="block">
              <input type="text" className="input-frame" placeholder="이름" readOnly defaultValue="홍길동" />
            </div>
          </div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">
              주민등록 번호 <span className="imp">*</span>
            </div>
            <div className="id-number-wrap">
              <div className="id-number">
                <input type="text" className="input-frame" placeholder="주민등록 앞자리" readOnly />
              </div>
              <div className="id-number">
                <div className="back-input">
                  <input type="text" className="input-frame num" defaultValue="2" readOnly />
                  <input type="text" className="input-frame num" defaultValue="*" />
                  <input type="text" className="input-frame num" defaultValue="*" />
                  <input type="text" className="input-frame num" defaultValue="*" />
                  <input type="text" className="input-frame num" defaultValue="*" />
                  <input type="text" className="input-frame num" defaultValue="*" />
                  <input type="text" className="input-frame num" defaultValue="*" />
                </div>
              </div>
            </div>
            <div className="msg mt10">주민등록 번호 뒷자리는 직접 입력해 주세요. 근로계약서 작성 시 필요합니다</div>
          </div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">
              휴대폰 번호 <span className="imp">*</span>
            </div>
            <div className="block">
              <input type="text" className="input-frame" placeholder="" readOnly defaultValue="01088884444" />
            </div>
          </div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">
              주소 <span className="imp">*</span>
            </div>
            <div className="block">
              <button className="btn-form outline block">주소찿기</button>
            </div>
            <div className="block mt10">
              <input
                type="text"
                className="input-frame"
                placeholder=""
                readOnly
                defaultValue="(13529) 경기도 성남시 분당구 판교역로 123"
              />
            </div>
            <div className="block mt10">
              <input type="text" className="input-frame" placeholder="상세주소" />
            </div>
          </div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">
              이메일 <span className="imp">*</span>
            </div>
            <div className="block">
              <input
                type="text"
                className="input-frame"
                placeholder="이메일"
                defaultValue="Honggildong@interplug.co.kr"
              />
            </div>
            <div className="msg success mt10">사용 가능한 이메일입니다.</div>
          </div>
        </div>
        <div className="signup-filed-form">
          <div className="signup-filed-tit">급여 계좌</div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">은행 선택</div>
            <div className="block">
              <button className="select-form al-l" onClick={() => setBankSelectSheet(true)}>
                선택
              </button>
            </div>
          </div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">계좌번호 입력</div>
            <div className="block">
              <input type="text" className="input-frame" placeholder="숫자만 입력하세요" />
            </div>
          </div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">예금주</div>
            <div className="block">
              <input type="text" className="input-frame" placeholder="숫자만 입력하세요" />
            </div>
            <div className="msg mt10">급여계좌 정보들 모두 입력하거나, 모두 지워주세요.</div>
          </div>
        </div>
        <div className="signup-filed-form">
          <div className="check-form-warp">
            <div className="check-form-tit">
              서비스 이용약관 동의 <span className="imp">*</span>
            </div>
            <div className="check-form-list">
              <div className="check-form-item">
                <div className="check-form-box">
                  <input type="checkbox" id="check-form-1" />
                  <label htmlFor="check-form-1">전체 동의</label>
                </div>
              </div>
              <div className="check-form-item">
                <div className="check-form-box">
                  <input type="checkbox" id="check-form-2" />
                  <label htmlFor="check-form-2">[필수] 이용약관</label>
                </div>
                <button className="check-form-btn">보기</button>
              </div>
              <div className="check-form-item">
                <div className="check-form-box">
                  <input type="checkbox" id="check-form-3" />
                  <label htmlFor="check-form-3">[필수] 개인정보 수집 이용</label>
                </div>
                <button className="check-form-btn">보기</button>
              </div>
              <div className="check-form-item">
                <div className="check-form-box">
                  <input type="checkbox" id="check-form-4" />
                  <label htmlFor="check-form-4">[필수] 개인정보 제3자 제공</label>
                </div>
                <button className="check-form-btn">보기</button>
              </div>
            </div>
          </div>
        </div>
        <div className="signup-filed-btn">
          <button className="btn-form login block" onClick={() => setAlertPopup(true)}>
            가입하기
          </button>
        </div>
      </div>
    </div>
  )
}
