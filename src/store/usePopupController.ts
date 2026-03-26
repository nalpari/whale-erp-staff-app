import { create } from 'zustand'
import type { ContractListResponse } from '@/types/api'

type PopupControllerState = {
  QrCodePopup: boolean
  setQrCodePopup: (isOpen: boolean) => void
  AlertPopup: boolean
  setAlertPopup: (isOpen: boolean) => void
  PasswordChangePopup: boolean
  setPasswordChangePopup: (isOpen: boolean) => void
  AIChatPopup: boolean
  setAIChatPopup: (isOpen: boolean) => void
  EmploymentNotificationPopup: boolean
  setEmploymentNotificationPopup: (isOpen: boolean) => void
  EmploymentPopFrame: boolean
  setEmploymentPopFrame: (isOpen: boolean) => void
  SignPopup: boolean
  setSignPopup: (isOpen: boolean) => void
  EmploymentStep: boolean
  setEmploymentStep: (step: boolean) => void
  ContractHistoryPopup: boolean
  setContractHistoryPopup: (isOpen: boolean) => void
  SalaryDetailFullTimePopup: boolean
  setSalaryDetailFullTimePopup: (isOpen: boolean) => void
  // PROGRESS 상태 근로계약서 목록
  pendingContracts: ContractListResponse[]
  setPendingContracts: (contracts: ContractListResponse[]) => void
  // 계약 팝업 열기 시 선택된 계약 ID
  selectedContractId: number | null
  setSelectedContractId: (id: number | null) => void
}

export const usePopupController = create<PopupControllerState>((set) => ({
  QrCodePopup: false,
  AlertPopup: false,
  PasswordChangePopup: false,
  AIChatPopup: false,
  EmploymentNotificationPopup: false,
  EmploymentPopFrame: false,
  SignPopup: false,
  EmploymentStep: false,
  ContractHistoryPopup: false,
  SalaryDetailFullTimePopup: false,
  pendingContracts: [],
  selectedContractId: null,
  setQrCodePopup: (isOpen: boolean) => set((state) => ({ ...state, QrCodePopup: isOpen })),
  setAlertPopup: (isOpen: boolean) => set((state) => ({ ...state, AlertPopup: isOpen })),
  setPasswordChangePopup: (isOpen: boolean) => set((state) => ({ ...state, PasswordChangePopup: isOpen })),
  setAIChatPopup: (isOpen: boolean) => set((state) => ({ ...state, AIChatPopup: isOpen })),
  setEmploymentNotificationPopup: (isOpen: boolean) => set((state) => ({ ...state, EmploymentNotificationPopup: isOpen })),
  setEmploymentPopFrame: (isOpen: boolean) => set((state) => ({ ...state, EmploymentPopFrame: isOpen })),
  setSignPopup: (isOpen: boolean) => set((state) => ({ ...state, SignPopup: isOpen })),
  setEmploymentStep: (step: boolean) => set((state) => ({ ...state, EmploymentStep: step })),
  setContractHistoryPopup: (isOpen: boolean) => set((state) => ({ ...state, ContractHistoryPopup: isOpen })),
  setSalaryDetailFullTimePopup: (isOpen: boolean) => set((state) => ({ ...state, SalaryDetailFullTimePopup: isOpen })),
  setPendingContracts: (contracts: ContractListResponse[]) => set((state) => ({ ...state, pendingContracts: contracts })),
  setSelectedContractId: (id: number | null) => set((state) => ({ ...state, selectedContractId: id })),
}))
