'use client'
import Image from 'next/image'

export default function MainEmptyStore() {
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
            <p>근로계약서를 체결하시면</p>
            <p>근무처가 자동으로 추가됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
