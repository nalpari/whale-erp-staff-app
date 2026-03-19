import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import Image from 'next/image'

export default function AvatarSelect() {
  // 필요한 상태와 함수만 선택적으로 구독
  const avatarSelectSheet = useBottomSheetController((state) => state.avatarSelectSheet)
  const setAvatarSelectSheet = useBottomSheetController((state) => state.setAvatarSelectSheet)

  return (
    <Sheet
      isOpen={avatarSelectSheet}
      onClose={() => setAvatarSelectSheet(false)}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>프로필 사진 설정</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="avatar-select-wrap">
                <button className="avatar-select-btn">
                  <Image src="/assets/images/contents/avatar01.svg" alt="avatar" width={62} height={62} />
                </button>
                <button className="avatar-select-btn">
                  <Image src="/assets/images/contents/avatar02.svg" alt="avatar" width={62} height={62} />
                </button>
                <button className="avatar-select-btn act">
                  <Image src="/assets/images/contents/avatar03.svg" alt="avatar" width={62} height={62} />
                </button>
                <button className="avatar-select-btn">
                  <Image src="/assets/images/contents/avatar04.svg" alt="avatar" width={62} height={62} />
                </button>
              </div>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={() => setAvatarSelectSheet(false)} />
    </Sheet>
  )
}
