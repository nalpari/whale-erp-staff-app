import { create } from 'zustand'

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
}

type InitialStateType = {
  QrCodePopup: boolean
  AlertPopup: boolean
  PasswordChangePopup: boolean
  AIChatPopup: boolean
  EmploymentNotificationPopup: boolean
  EmploymentPopFrame: boolean
  SignPopup: boolean
  EmploymentStep: boolean
  ContractHistoryPopup: boolean
  SalaryDetailFullTimePopup: boolean
}

const initialState: InitialStateType = {
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
}

export const usePopupController = create<PopupControllerState>((set) => ({
  ...initialState,
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
}))
