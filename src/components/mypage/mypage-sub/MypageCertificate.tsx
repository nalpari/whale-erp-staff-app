'use client'

import { useBottomSheetController } from '@/store/useBottomSheetController'
import { useCertificateList, useDeleteCertificate } from '@/hooks/queries/use-certificate-queries'

export default function MypageCertificate() {
  const setCertificateAddSheet = useBottomSheetController((s) => s.setCertificateAddSheet)

  const { data, isPending: loading } = useCertificateList()
  const certificates = data?.data ?? []
  const { mutateAsync: deleteCertificateMutation } = useDeleteCertificate()

  const handleDelete = async (id: number) => {
    if (!confirm('해당 자격증 정보를 삭제하시겠습니까?')) return
    try {
      await deleteCertificateMutation(id)
    } catch (err) {
      const message = err instanceof Error ? err.message : '삭제에 실패했습니다.'
      alert(message)
    }
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
        {certificates.length === 0 ? (
          <div className="mypage-block-item">
            <div className="mypage-block-item-empty">
              <span>등록된 내역이 없습니다.</span>
              <span>자격증 정보를 추가해주세요.</span>
            </div>
          </div>
        ) : (
          certificates.map((cert) => (
            <div className="mypage-block-item" key={cert.id}>
              <div className="mypage-block-item-header">
                <div className="mypage-block-item-header-tit">{cert.certificateName}</div>
                <div className="mypage-block-item-header-btn">
                  <button className="sub-edit-btn"></button>
                  <button className="sub-delete-btn" onClick={() => handleDelete(cert.id)}></button>
                </div>
              </div>
              <div className="mypage-block-item-body">
                {(cert.validityStartDate || cert.validityEndDate) && (
                  <ul className="mypage-block-item-data-list">
                    {cert.validityStartDate && (
                      <li className="mypage-block-item-data-list-item">{cert.validityStartDate}</li>
                    )}
                    {cert.validityEndDate && (
                      <li className="mypage-block-item-data-list-item">{cert.validityEndDate}</li>
                    )}
                  </ul>
                )}
                <ul className="mypage-block-item-data-list">
                  <li className="mypage-block-item-data-list-item">취득일 : {cert.acquisitionDate ?? '-'}</li>
                </ul>
                {cert.issuingOrganization && (
                  <ul className="mypage-block-item-data-list">
                    <li className="mypage-block-item-data-list-item">발급기관 : {cert.issuingOrganization}</li>
                  </ul>
                )}
                {cert.certificateFileName && (
                  <button className="item-file-down">{cert.certificateFileName}</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="add-btn-wrap">
        <button className="btn-form block add-btn" onClick={() => setCertificateAddSheet(true)}>
          <i className="add-icon"></i> 자격증 정보 추가
        </button>
      </div>
    </div>
  )
}
