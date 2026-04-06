'use client'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { useDocumentList, useDeleteDocument } from '@/hooks/queries/use-document-queries'

const DOCUMENT_TYPES = [
  { type: 'RESIDENT_REGISTRATION', label: '주민등록 등본' },
  { type: 'FAMILY_RELATION', label: '가족관계 증명서' },
  { type: 'HEALTH_CHECK', label: '건강진단 결과서' },
  { type: 'RESUME', label: '이력서' },
]

export default function MypageDocument() {
  const openDocumentSheet = useBottomSheetController((state) => state.openDocumentSheet)
  const { data, isPending: loading, refetch } = useDocumentList()
  const documents = data?.data ?? []
  const { mutateAsync: deleteDocumentMutation } = useDeleteDocument()

  const fetchDocuments = () => {
    void refetch()
  }

  const handleDelete = async (type: string) => {
    if (!confirm('서류를 삭제하시겠습니까?')) return
    try {
      await deleteDocumentMutation(type)
    } catch {
      alert('삭제에 실패했습니다.')
    }
  }

  const getDocByType = (type: string) => documents.find((d) => d.type === type)

  if (loading) {
    return <div className="mypage-block-wrap"><div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div></div>
  }

  return (
    <div className="mypage-block-wrap">
      <div className="document-list-wrap">
        {DOCUMENT_TYPES.map(({ type, label }) => {
          const doc = getDocByType(type)
          const hasFile = doc?.fileId != null

          return (
            <div className="document-list-item" key={type}>
              <div className="document-list-item-header">
                <div className="document-list-item-header-tit">{label}</div>
                <div className="document-list-item-header-btn">
                  <button
                    className="sub-add-btn"
                    onClick={() => openDocumentSheet(type, label, fetchDocuments)}
                  ></button>
                </div>
              </div>
              <div className="document-list-item-body">
                {hasFile ? (
                  <ul className="file-list-wrap">
                    <li className="file-list-item">
                      <div className="file-item-wrap">
                        <div className="file-name">{doc.fileName ?? '파일'}</div>
                        <button
                          className="file-delete-btn"
                          onClick={() => handleDelete(type)}
                        ></button>
                      </div>
                      {type === 'HEALTH_CHECK' && doc.expiryDate && (
                        <div className="file-end-date">만료일 {doc.expiryDate}</div>
                      )}
                    </li>
                  </ul>
                ) : (
                  <div style={{ padding: '8px 0', color: '#999', fontSize: '13px' }}>
                    등록된 서류가 없습니다.
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
