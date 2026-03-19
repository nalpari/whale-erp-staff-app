'use client'
import { useBottomSheetController } from '@/store/useBottomSheetController'
export default function MypageDocument() {
  const setDocumentAddSheet = useBottomSheetController((state) => state.setDocumentAddSheet)

  return (
    <div className="mypage-block-wrap">
      <div className="document-list-wrap">
        <div className="document-list-item">
          <div className="document-list-item-header">
            <div className="document-list-item-header-tit">주민등록 등본</div>
            <div className="document-list-item-header-btn">
              <button className="sub-add-btn" onClick={() => setDocumentAddSheet(true)}></button>
            </div>
          </div>
          <div className="document-list-item-body">
            <ul className="file-list-wrap">
              <li className="file-list-item">
                <div className="file-item-wrap">
                  <div className="file-name">홍길동_주민등록등본.pdf</div>
                  <button className="file-delete-btn"></button>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="document-list-item">
          <div className="document-list-item-header">
            <div className="document-list-item-header-tit">가족관계 증명서</div>
            <div className="document-list-item-header-btn">
              <button className="sub-add-btn"></button>
            </div>
          </div>
          <div className="document-list-item-body">
            <ul className="file-list-wrap">
              <li className="file-list-item">
                <div className="file-item-wrap">
                  <div className="file-name">홍길동_주민등록등본.pdf</div>
                  <button className="file-delete-btn"></button>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="document-list-item">
          <div className="document-list-item-header">
            <div className="document-list-item-header-tit">건강진단 결과서</div>
            <div className="document-list-item-header-btn">
              <button className="sub-add-btn"></button>
            </div>
          </div>
          <div className="document-list-item-body">
            <ul className="file-list-wrap">
              <li className="file-list-item">
                <div className="file-item-wrap">
                  <div className="file-name">홍길동_주민등록등본.pdf</div>
                  <button className="file-delete-btn"></button>
                </div>
                <div className="file-end-date">만료일 2026-05-05</div>
              </li>
            </ul>
          </div>
        </div>
        <div className="document-list-item">
          <div className="document-list-item-header">
            <div className="document-list-item-header-tit">이력서</div>
            <div className="document-list-item-header-btn">
              <button className="sub-add-btn"></button>
            </div>
          </div>
          <div className="document-list-item-body">
            <ul className="file-list-wrap">
              <li className="file-list-item">
                <div className="file-item-wrap">
                  <div className="file-name">홍길동_주민등록등본.pdf</div>
                  <button className="file-delete-btn"></button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
