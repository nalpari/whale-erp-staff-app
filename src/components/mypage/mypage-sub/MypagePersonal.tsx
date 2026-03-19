'use client'
import { useBottomSheetController } from '@/store/useBottomSheetController'

export default function MypagePersonal() {
  const setPersonalAddSheet = useBottomSheetController((state) => state.setPersonalAddSheet)

  return (
    <div className="mypage-block-wrap">
      <div className="mypage-block-inner">
        <div className="mypage-block-item">
          <div className="mypage-block-item-header">
            <div className="mypage-block-item-header-tit">메가커피</div>
            <div className="mypage-block-item-header-btn">
              <button className="sub-edit-btn"></button>
              <button className="sub-delete-btn"></button>
            </div>
          </div>
          <div className="mypage-block-item-body">
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">2020-05-05</li>
              <li className="mypage-block-item-data-list-item">2021-01-01</li>
            </ul>
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">정직원</li>
              <li className="mypage-block-item-data-list-item">과장</li>
              <li className="mypage-block-item-data-list-item">매니저</li>
            </ul>
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">메뉴 제조 및 홀서빙</li>
            </ul>
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">계약 만료</li>
            </ul>
          </div>
        </div>
        <div className="mypage-block-item">
          <div className="mypage-block-item-header">
            <div className="mypage-block-item-header-tit">힘이나는 커피생활</div>
            <div className="mypage-block-item-header-btn">
              <button className="sub-edit-btn"></button>
              <button className="sub-delete-btn"></button>
            </div>
          </div>
          <div className="mypage-block-item-body">
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">2020-05-05</li>
              <li className="mypage-block-item-data-list-item">2021-01-01</li>
            </ul>
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">정직원</li>
              <li className="mypage-block-item-data-list-item">과장</li>
              <li className="mypage-block-item-data-list-item">매니저</li>
            </ul>
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">메뉴 제조 및 홀서빙</li>
            </ul>
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">계약 만료</li>
            </ul>
          </div>
        </div>
        <div className="mypage-block-item">
          <div className="mypage-block-item-header">
            <div className="mypage-block-item-header-tit">메가커피</div>
            <div className="mypage-block-item-header-btn">
              <button className="sub-edit-btn"></button>
              <button className="sub-delete-btn"></button>
            </div>
          </div>
          <div className="mypage-block-item-body">
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">2020-05-05</li>
              <li className="mypage-block-item-data-list-item">2021-01-01</li>
            </ul>
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">정직원</li>
              <li className="mypage-block-item-data-list-item">과장</li>
              <li className="mypage-block-item-data-list-item">매니저</li>
            </ul>
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">메뉴 제조 및 홀서빙</li>
            </ul>
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">계약 만료</li>
            </ul>
          </div>
        </div>
        <div className="mypage-block-item">
          <div className="mypage-block-item-empty">
            <span>등록된 내역이 없습니다. </span>
            <span>경력정보를 추가해주세요.</span>
          </div>
        </div>
      </div>
      <div className="add-btn-wrap">
        <button className="btn-form block add-btn" onClick={() => setPersonalAddSheet(true)}>
          <i className="add-icon"></i> 경력 정보 추가
        </button>
      </div>
    </div>
  )
}
