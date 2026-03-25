import { create } from 'zustand'
import type { CareerResponse } from '@/types/api'

type BottomSheetControllerState = {
  storeSheet: boolean
  setStoreSheet: (isOpen: boolean) => void
  bankSelectSheet: boolean
  setBankSelectSheet: (isOpen: boolean) => void
  onBankSelect: ((bankName: string) => void) | null
  openBankSelect: (callback: (bankName: string) => void) => void
  workPlaceAddSheet: boolean
  setWorkPlaceAddSheet: (isOpen: boolean) => void
  accountSelectSheet: boolean
  setAccountSelectSheet: (isOpen: boolean) => void
  employmentNotificationSheet: boolean
  setEmploymentNotificationSheet: (isOpen: boolean) => void
  commuteDaySelectSheet: boolean
  setCommuteDaySelectSheet: (isOpen: boolean) => void
  avatarSelectSheet: boolean
  setAvatarSelectSheet: (isOpen: boolean) => void
  phoneChangeSheet: boolean
  setPhoneChangeSheet: (isOpen: boolean) => void
  personalAddSheet: boolean
  setPersonalAddSheet: (isOpen: boolean) => void
  // 경력 수정용: 수정 대상 데이터 + 저장 후 콜백
  editingCareer: CareerResponse | null
  onCareerSaved: (() => void) | null
  openPersonalSheet: (career?: CareerResponse, onSaved?: () => void) => void
  certificateAddSheet: boolean
  setCertificateAddSheet: (isOpen: boolean) => void
  accountAddSheet: boolean
  setAccountAddSheet: (isOpen: boolean) => void
  documentAddSheet: boolean
  setDocumentAddSheet: (isOpen: boolean) => void
  // 서류 업로드용: type, label, 저장 후 콜백
  documentType: string | null
  documentLabel: string | null
  onDocumentSaved: (() => void) | null
  openDocumentSheet: (type: string, label: string, onSaved?: () => void) => void
}

export const useBottomSheetController = create<BottomSheetControllerState>((set) => ({
  storeSheet: false,
  bankSelectSheet: false,
  workPlaceAddSheet: false,
  accountSelectSheet: false,
  employmentNotificationSheet: false,
  commuteDaySelectSheet: false,
  avatarSelectSheet: false,
  phoneChangeSheet: false,
  personalAddSheet: false,
  editingCareer: null,
  onCareerSaved: null,
  certificateAddSheet: false,
  accountAddSheet: false,
  documentAddSheet: false,
  documentType: null,
  documentLabel: null,
  onDocumentSaved: null,
  onBankSelect: null,
  setStoreSheet: (isOpen: boolean) => set((state) => ({ ...state, storeSheet: isOpen })),
  setBankSelectSheet: (isOpen: boolean) => set((state) => ({ ...state, bankSelectSheet: isOpen })),
  openBankSelect: (callback: (bankName: string) => void) => set((state) => ({ ...state, bankSelectSheet: true, onBankSelect: callback })),
  setWorkPlaceAddSheet: (isOpen: boolean) => set((state) => ({ ...state, workPlaceAddSheet: isOpen })),
  setAccountSelectSheet: (isOpen: boolean) => set((state) => ({ ...state, accountSelectSheet: isOpen })),
  setEmploymentNotificationSheet: (isOpen: boolean) => set((state) => ({ ...state, employmentNotificationSheet: isOpen })),
  setCommuteDaySelectSheet: (isOpen: boolean) => set((state) => ({ ...state, commuteDaySelectSheet: isOpen })),
  setAvatarSelectSheet: (isOpen: boolean) => set((state) => ({ ...state, avatarSelectSheet: isOpen })),
  setPhoneChangeSheet: (isOpen: boolean) => set((state) => ({ ...state, phoneChangeSheet: isOpen })),
  setPersonalAddSheet: (isOpen: boolean) => set((state) => ({
    ...state,
    personalAddSheet: isOpen,
    ...(isOpen ? {} : { editingCareer: null, onCareerSaved: null }),
  })),
  openPersonalSheet: (career?: CareerResponse, onSaved?: () => void) => set((state) => ({
    ...state,
    personalAddSheet: true,
    editingCareer: career ?? null,
    onCareerSaved: onSaved ?? null,
  })),
  setCertificateAddSheet: (isOpen: boolean) => set((state) => ({ ...state, certificateAddSheet: isOpen })),
  setAccountAddSheet: (isOpen: boolean) => set((state) => ({ ...state, accountAddSheet: isOpen })),
  setDocumentAddSheet: (isOpen: boolean) => set((state) => ({
    ...state,
    documentAddSheet: isOpen,
    ...(isOpen ? {} : { documentType: null, documentLabel: null, onDocumentSaved: null }),
  })),
  openDocumentSheet: (type: string, label: string, onSaved?: () => void) => set((state) => ({
    ...state,
    documentAddSheet: true,
    documentType: type,
    documentLabel: label,
    onDocumentSaved: onSaved ?? null,
  })),
}))
