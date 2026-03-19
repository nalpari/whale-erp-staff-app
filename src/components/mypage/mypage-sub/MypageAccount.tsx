'use client'
import { useBottomSheetController } from '@/store/useBottomSheetController'

export default function MypageAccount() {
  const setAccountAddSheet = useBottomSheetController((state) => state.setAccountAddSheet)
  return (
    <div className="mypage-block-wrap">
      <div className="mypage-block-inner">
        <div className="mypage-block-item">
          <div className="mypage-block-item-header">
            <div className="mypage-block-item-header-tit">
              국민은행<span className="badge">대표</span>
            </div>
            <div className="mypage-block-item-header-btn">
              <button className="sub-edit-btn"></button>
              <button className="sub-delete-btn"></button>
            </div>
          </div>
          <div className="mypage-block-item-body">
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">홍길동</li>
              <li className="mypage-block-item-data-list-item">급여</li>
            </ul>
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">**** - **** - **** - ****</li>
            </ul>
          </div>
        </div>
        <div className="mypage-block-item">
          <div className="mypage-block-item-header">
            <div className="mypage-block-item-header-tit">신한은행</div>
            <div className="mypage-block-item-header-btn">
              <button className="sub-edit-btn"></button>
              <button className="sub-delete-btn"></button>
            </div>
          </div>
          <div className="mypage-block-item-body">
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">홍길동</li>
              <li className="mypage-block-item-data-list-item">급여</li>
            </ul>
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">**** - **** - **** - ****</li>
            </ul>
          </div>
        </div>
        <div className="mypage-block-item">
          <div className="mypage-block-item-header">
            <div className="mypage-block-item-header-tit">하나은행</div>
            <div className="mypage-block-item-header-btn">
              <button className="sub-edit-btn"></button>
              <button className="sub-delete-btn"></button>
            </div>
          </div>
          <div className="mypage-block-item-body">
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">홍길동</li>
              <li className="mypage-block-item-data-list-item">급여</li>
            </ul>
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">**** - **** - **** - ****</li>
            </ul>
          </div>
        </div>
        <div className="mypage-block-item">
          <div className="mypage-block-item-empty">
            <span>등록된 계좌정보가 없습니다.</span>
          </div>
        </div>
      </div>
      <div className="add-btn-wrap">
        <button className="btn-form block add-btn" onClick={() => setAccountAddSheet(true)}>
          <i className="add-icon"></i> 계좌 정보 추가
        </button>
      </div>
    </div>
  )
}
