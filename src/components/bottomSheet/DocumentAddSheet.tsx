'use client'
import { useState, useRef } from 'react'
import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { useAuthStore } from '@/store/useAuthStore'
import { documentApi } from '@/lib/api-endpoints'

export default function DocumentAddSheet() {
  const documentAddSheet = useBottomSheetController((state) => state.documentAddSheet)
  const setDocumentAddSheet = useBottomSheetController((state) => state.setDocumentAddSheet)
  const documentType = useBottomSheetController((state) => state.documentType)
  const documentLabel = useBottomSheetController((state) => state.documentLabel)
  const onDocumentSaved = useBottomSheetController((state) => state.onDocumentSaved)
  const user = useAuthStore((state) => state.user)

  const [file, setFile] = useState<File | null>(null)
  const [expiryDate, setExpiryDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isHealthCheck = documentType === 'HEALTH_CHECK'

  const handleClose = () => {
    setDocumentAddSheet(false)
    setFile(null)
    setExpiryDate('')
    setError('')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setError('')
    }
  }

  const handleSave = async () => {
    if (!file) {
      setError('파일을 선택해주세요.')
      return
    }
    if (isHealthCheck && !expiryDate) {
      setError('건강진단 결과서 만료일을 선택해주세요.')
      return
    }
    if (!documentType) return

    setSaving(true)
    setError('')
    try {
      // 1. 파일을 upload_files에 업로드
      const memberId = user?.memberId ?? 0
      const uploadRes = await documentApi.uploadFile(file, documentType, 'MEMBER_DOCUMENT', memberId)
      const uploadFileId = uploadRes.data.id

      // 2. member_documents에 등록
      await documentApi.createDocument(
        documentType,
        uploadFileId,
        isHealthCheck ? expiryDate : undefined
      )

      alert('서류가 등록되었습니다.')
      onDocumentSaved?.()
      handleClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '서류 등록에 실패했습니다.'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet
      isOpen={documentAddSheet}
      onClose={handleClose}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>{documentLabel ?? '서류'} 등록</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="filed-wrap">
                <div className="filed-item">
                  <div className="filed-item-tit">
                    파일 <span className="imp">*</span>
                  </div>
                  <div className="file-btn">
                    <input
                      type="file"
                      id="doc-file-input"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.hwp"
                      style={{ display: 'none' }}
                    />
                    <label
                      htmlFor="doc-file-input"
                      className="btn-form block outline"
                      style={{ cursor: 'pointer' }}
                    >
                      파일 선택
                    </label>
                  </div>
                  {file && (
                    <div className="block mt10">
                      <input
                        type="text"
                        className="input-frame"
                        value={file.name}
                        readOnly
                      />
                    </div>
                  )}
                </div>

                {isHealthCheck && (
                  <div className="filed-item">
                    <div className="filed-item-tit">
                      만료일 <span className="imp">*</span>
                    </div>
                    <div className="block">
                      <div className="date-picker-custom">
                        <input
                          type="date"
                          className="date-picker-input"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {error && <div className="msg error mt10">{error}</div>}
              </div>
            </div>
            <div className="sheet-btn-wrap">
              <button
                className="btn-form login block"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? '등록 중...' : '저장'}
              </button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  )
}
