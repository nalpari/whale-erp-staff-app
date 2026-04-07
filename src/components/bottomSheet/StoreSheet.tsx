'use client'

import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { useWorkplaceStore } from '@/store/useWorkplaceStore'

export default function StoreSheet() {
  const storeSheet = useBottomSheetController((state) => state.storeSheet)
  const setStoreSheet = useBottomSheetController((state) => state.setStoreSheet)

  const workplaces = useWorkplaceStore((s) => s.workplaces)
  const selectedWorkplaceId = useWorkplaceStore((s) => s.selectedWorkplaceId)
  const setSelectedWorkplace = useWorkplaceStore((s) => s.setSelectedWorkplace)

  const handleSelect = (id: number | null) => {
    setSelectedWorkplace(id)
    setStoreSheet(false)
  }

  return (
    <Sheet isOpen={storeSheet} onClose={() => setStoreSheet(false)} detent="content" disableScrollLocking={true}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>근무처 선택</h3>
            </div>
            <div className="bottom-sheet-body">
              <ul className="array-list">
                <li className="array-item">
                  <button
                    className={`array-btn ${selectedWorkplaceId === null ? 'active' : ''}`}
                    onClick={() => handleSelect(null)}
                  >
                    전체
                  </button>
                </li>
                {workplaces.map((wp) => (
                  <li key={wp.id} className="array-item">
                    <button
                      className={`array-btn ${selectedWorkplaceId === wp.id ? 'active' : ''}`}
                      onClick={() => handleSelect(wp.id)}
                    >
                      {wp.storeName ? `${wp.workplaceName} - ${wp.storeName}` : wp.workplaceName}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={() => setStoreSheet(false)} />
    </Sheet>
  )
}
