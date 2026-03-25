'use client'

import { useEffect, useState } from 'react'
import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { careerApi, profileApi } from '@/lib/api-endpoints'
import type { CodeOptions } from '@/types/api'

export default function PersonalAddSheet() {
  const personalAddSheet = useBottomSheetController((s) => s.personalAddSheet)
  const setPersonalAddSheet = useBottomSheetController((s) => s.setPersonalAddSheet)
  const editingCareer = useBottomSheetController((s) => s.editingCareer)
  const onCareerSaved = useBottomSheetController((s) => s.onCareerSaved)

  const isEdit = !!editingCareer

  const [companyName, setCompanyName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [contractClassification, setContractClassification] = useState('')
  const [rank, setRank] = useState('')
  const [position, setPosition] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [resignationReason, setResignationReason] = useState('')
  const [saving, setSaving] = useState(false)

  const [codeOptions, setCodeOptions] = useState<CodeOptions | null>(null)

  // 공통코드 옵션 로드
  useEffect(() => {
    if (personalAddSheet && !codeOptions) {
      profileApi.getCodeOptions().then((res) => setCodeOptions(res.data)).catch(() => {})
    }
  }, [personalAddSheet, codeOptions])

  // 수정 모드일 때 기존 데이터 세팅
  useEffect(() => {
    if (personalAddSheet && editingCareer) {
      setCompanyName(editingCareer.companyName)
      setStartDate(editingCareer.startDate)
      setEndDate(editingCareer.endDate ?? '')
      setContractClassification(editingCareer.contractClassification ?? '')
      setRank(editingCareer.rank ?? '')
      setPosition(editingCareer.position ?? '')
      setJobDescription(editingCareer.jobDescription ?? '')
      setResignationReason(editingCareer.resignationReason ?? '')
    } else if (personalAddSheet && !editingCareer) {
      // 추가 모드 초기화
      setCompanyName('')
      setStartDate('')
      setEndDate('')
      setContractClassification('')
      setRank('')
      setPosition('')
      setJobDescription('')
      setResignationReason('')
    }
  }, [personalAddSheet, editingCareer])

  const handleClose = () => setPersonalAddSheet(false)

  const handleSave = async () => {
    if (!companyName.trim()) {
      alert('근무처를 입력해주세요.')
      return
    }
    if (!startDate) {
      alert('입사일을 선택해주세요.')
      return
    }

    setSaving(true)
    try {
      const data = {
        companyName: companyName.trim(),
        startDate,
        endDate: endDate || undefined,
        contractClassification: contractClassification || undefined,
        rank: rank || undefined,
        position: position || undefined,
        jobDescription: jobDescription.trim() || undefined,
        resignationReason: resignationReason.trim() || undefined,
      }

      if (isEdit && editingCareer) {
        await careerApi.updateCareer(editingCareer.id, data)
        alert('경력 정보가 수정되었습니다.')
      } else {
        await careerApi.createCareer(data)
        alert('경력 정보가 등록되었습니다.')
      }

      onCareerSaved?.()
      handleClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : '저장에 실패했습니다.'
      alert(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet isOpen={personalAddSheet} onClose={handleClose} detent="content" disableScrollLocking={true}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>경력 정보 {isEdit ? '수정' : '등록'}</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="filed-wrap">
                <div className="filed-item">
                  <div className="filed-item-tit">
                    근무처 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      placeholder="근무처를 입력하세요"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">
                    입사일 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">퇴사일</div>
                  <div className="block">
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">계약 분류</div>
                  <div className="block">
                    <select
                      className="select-form"
                      value={contractClassification}
                      onChange={(e) => setContractClassification(e.target.value)}
                    >
                      <option value="">계약 분류를 선택해주세요</option>
                      {codeOptions?.contractClassifications.map((opt) => (
                        <option key={opt.code} value={opt.code}>{opt.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">직급</div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      placeholder="직급을 입력하세요"
                      value={rank}
                      onChange={(e) => setRank(e.target.value)}
                    />
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">직책</div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      placeholder="직책을 입력하세요"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    />
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">업무내용</div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      placeholder="업무내용을 입력하세요"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-item-tit">퇴사 사유</div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      placeholder="퇴사 사유를 입력하세요"
                      value={resignationReason}
                      onChange={(e) => setResignationReason(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="sheet-btn-wrap">
              <button className="btn-form login block" onClick={handleSave} disabled={saving}>
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  )
}
