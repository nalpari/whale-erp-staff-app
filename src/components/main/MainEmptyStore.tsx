'use client'
import Image from 'next/image'
import { useBottomSheetController } from '@/store/useBottomSheetController'

export default function MainEmptyStore() {
  const setWorkPlaceAddSheet = useBottomSheetController((state) => state.setWorkPlaceAddSheet)
  return (
    <div className="container main">
      <div className="empty-store-contents">
        <div className="empty-store-inner">
          <div className="empty-store-img">
            <Image src="/assets/images/contents/empty_store_img.svg" alt="empty-store" width={200} height={200} />
          </div>
          <div className="empty-store-tit">
            <p>등록된 매장 정보가 없습니다.</p>
            <p>근무처를 추가해 주세요.</p>
          </div>
          <div className="empty-store-txt">
            <p>근무지를 추가하시면 출퇴근 체크와</p>
            <p>근로계약서를 확인 할 수 있습니다.</p>
          </div>
        </div>
        <div className="empty-store-btn">
          <button className="btn-form login block" onClick={() => setWorkPlaceAddSheet(true)}>
            근무지 추가
          </button>
        </div>
      </div>
    </div>
  )
}
