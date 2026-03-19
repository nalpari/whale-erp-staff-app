'use client'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import Image from 'next/image'

export default function MypageProfile() {
  const setAvatarSelectSheet = useBottomSheetController((state) => state.setAvatarSelectSheet)
  const setPhoneChangeSheet = useBottomSheetController((state) => state.setPhoneChangeSheet)
  return (
    <div className="mypage-sub-wrap">
      <div className="profile-wrap">
        <div className="profile-img">
          <Image src="/assets/images/contents/avatar_profile01.png" alt="profile-img" fill />
          <button className="img-edit-btn" onClick={() => setAvatarSelectSheet(true)}></button>
        </div>
        <div className="profile-info">
          <div className="profile-info-name">홍길동</div>
          <div className="profile-info-id">Blackcat280</div>
        </div>
      </div>
      <div className="profile-form-wrap">
        <div className="profile-form-item">
          <div className="profile-form-item-tit">ID</div>
          <div className="block">
            <input type="text" className="input-frame" defaultValue="Blackcat280" readOnly />
          </div>
        </div>
        <div className="profile-form-item">
          <div className="profile-form-item-tit">이메일</div>
          <div className="block">
            <input type="text" className="input-frame" defaultValue="Interplug@interplug.co.kr" readOnly />
          </div>
        </div>
        <div className="profile-form-item">
          <div className="profile-form-item-tit">이름</div>
          <div className="block">
            <input type="text" className="input-frame" defaultValue="홍길동" />
          </div>
          <div className="msg error mt10">이름을 입력해 주세요.</div>
        </div>
        <div className="profile-form-item">
          <div className="profile-form-item-tit">주민등록 번호</div>
          <div className="block">
            <input type="text" className="input-frame" defaultValue="200505 – 1******" readOnly />
          </div>
        </div>
        <div className="profile-form-item">
          <div className="profile-form-item-tit">생년월일 </div>
          <div className="block">
            <input type="text" className="input-frame" defaultValue="2020.05.05" readOnly />
          </div>
        </div>
        <div className="profile-form-item">
          <div className="profile-form-item-tit">
            휴대폰 번호 <span className="imp">*</span>
          </div>
          <div className="block">
            <input type="text" className="input-frame" defaultValue="010 1234 4321" readOnly />
          </div>
          <div className="block mt10">
            <button className="btn-form outline block" onClick={() => setPhoneChangeSheet(true)}>
              변경
            </button>
          </div>
        </div>
        <div className="profile-form-item">
          <div className="profile-form-item-tit">주소</div>
          <div className="block">
            <input type="text" className="input-frame" defaultValue="서울시 서대문구 연세로5다길 22-3" readOnly />
          </div>
          <div className="block mt10">
            <button className="btn-form outline block">검색</button>
          </div>
          <div className="block mt10">
            <input type="text" className="input-frame" defaultValue="1004동 1204호" />
          </div>
        </div>
        <div className="profile-form-item">
          <div className="block">
            <button className="btn-form login block">저장</button>
          </div>
        </div>
      </div>
    </div>
  )
}
