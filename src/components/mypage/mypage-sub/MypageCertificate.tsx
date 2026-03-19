'use client'
import { useBottomSheetController } from '@/store/useBottomSheetController'
export default function MypageCertificate() {
  const setCertificateAddSheet = useBottomSheetController((state) => state.setCertificateAddSheet)

  return (
    <div className="mypage-block-wrap">
      <div className="mypage-block-inner">
        <div className="mypage-block-item">
          <div className="mypage-block-item-header">
            <div className="mypage-block-item-header-tit">바리스타1급 자격증</div>
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
              <li className="mypage-block-item-data-list-item">취득일 : 2020-05-05</li>
            </ul>
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">발급기관 : 한국커피협회(KCA)</li>
            </ul>
            <button className="item-file-down">홍길동_바리스타1급.pdf </button>
          </div>
        </div>
        <div className="mypage-block-item">
          <div className="mypage-block-item-header">
            <div className="mypage-block-item-header-tit">바리스타1급 자격증</div>
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
              <li className="mypage-block-item-data-list-item">취득일 : 2020-05-05</li>
            </ul>
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">발급기관 : 한국커피협회(KCA)</li>
            </ul>
            <button className="item-file-down">홍길동_바리스타1급.pdf </button>
          </div>
        </div>
        <div className="mypage-block-item">
          <div className="mypage-block-item-header">
            <div className="mypage-block-item-header-tit">바리스타1급 자격증</div>
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
              <li className="mypage-block-item-data-list-item">취득일 : 2020-05-05</li>
            </ul>
            <ul className="mypage-block-item-data-list">
              <li className="mypage-block-item-data-list-item">발급기관 : 한국커피협회(KCA)</li>
            </ul>
            <button className="item-file-down">홍길동_바리스타1급.pdf </button>
          </div>
        </div>

        <div className="mypage-block-item">
          <div className="mypage-block-item-empty">
            <span>등록된 내역이 없습니다. </span>
            <span>자격증 정보를 추가해주세요.</span>
          </div>
        </div>
      </div>
      <div className="add-btn-wrap">
        <button className="btn-form block add-btn" onClick={() => setCertificateAddSheet(true)}>
          <i className="add-icon"></i> 자격증 정보 추가
        </button>
      </div>
    </div>
  )
}
