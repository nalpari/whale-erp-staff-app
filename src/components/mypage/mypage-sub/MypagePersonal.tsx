'use client'

import { useBottomSheetController } from '@/store/useBottomSheetController'
import { useCareerList, useDeleteCareer } from '@/hooks/queries/use-career-queries'
import type { CareerResponse } from '@/types/api'

export default function MypagePersonal() {
  const openPersonalSheet = useBottomSheetController((s) => s.openPersonalSheet)

  const { data, isPending: loading, refetch } = useCareerList()
  const careers = data?.data ?? []
  const { mutateAsync: deleteCareerMutation } = useDeleteCareer()

  const fetchCareers = () => {
    void refetch()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('해당 경력 정보를 삭제하시겠습니까?')) return
    try {
      await deleteCareerMutation(id)
    } catch (err) {
      const message = err instanceof Error ? err.message : '삭제에 실패했습니다.'
      alert(message)
    }
  }

  const handleAdd = () => {
    openPersonalSheet(undefined, fetchCareers)
  }

  const handleEdit = (career: CareerResponse) => {
    openPersonalSheet(career, fetchCareers)
  }

  if (loading) {
    return (
      <div className="mypage-block-wrap">
        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="mypage-block-wrap">
      <div className="mypage-block-inner">
        {careers.length === 0 ? (
          <div className="mypage-block-item">
            <div className="mypage-block-item-empty">
              <span>등록된 내역이 없습니다.</span>
              <span>경력정보를 추가해주세요.</span>
            </div>
          </div>
        ) : (
          careers.map((career) => (
            <div className="mypage-block-item" key={career.id}>
              <div className="mypage-block-item-header">
                <div className="mypage-block-item-header-tit">{career.companyName}</div>
                <div className="mypage-block-item-header-btn">
                  <button className="sub-edit-btn" onClick={() => handleEdit(career)}></button>
                  <button className="sub-delete-btn" onClick={() => handleDelete(career.id)}></button>
                </div>
              </div>
              <div className="mypage-block-item-body">
                <ul className="mypage-block-item-data-list">
                  <li className="mypage-block-item-data-list-item">{career.startDate}</li>
                  <li className="mypage-block-item-data-list-item">{career.endDate ?? '재직중'}</li>
                </ul>
                {(career.contractClassification || career.rank || career.position) && (
                  <ul className="mypage-block-item-data-list">
                    {career.contractClassification && (
                      <li className="mypage-block-item-data-list-item">{career.contractClassification}</li>
                    )}
                    {career.rank && (
                      <li className="mypage-block-item-data-list-item">{career.rank}</li>
                    )}
                    {career.position && (
                      <li className="mypage-block-item-data-list-item">{career.position}</li>
                    )}
                  </ul>
                )}
                {career.jobDescription && (
                  <ul className="mypage-block-item-data-list">
                    <li className="mypage-block-item-data-list-item">{career.jobDescription}</li>
                  </ul>
                )}
                {career.resignationReason && (
                  <ul className="mypage-block-item-data-list">
                    <li className="mypage-block-item-data-list-item">{career.resignationReason}</li>
                  </ul>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="add-btn-wrap">
        <button className="btn-form block add-btn" onClick={handleAdd}>
          <i className="add-icon"></i> 경력 정보 추가
        </button>
      </div>
    </div>
  )
}
