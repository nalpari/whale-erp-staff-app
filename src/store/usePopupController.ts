import { create } from 'zustand'
import type { ContractListResponse } from '@/types/api'

type PopupControllerState = {
  QrCodePopup: boolean
  setQrCodePopup: (isOpen: boolean) => void
  /** QR팝업 오픈 시 컨텍스트 */
  qrCodeWorkplaceId: number | null
  qrCodeStoreId: number | null
  qrCodeStoreName: string | null
  /** 팝업 오픈 시 전달된 현재 출퇴근 시간 (근태 상태 판단용) */
  qrCodeCheckInTime: string | null
  qrCodeCheckOutTime: string | null
  openQrCodePopup: (
    workplaceId: number,
    storeName: string,
    storeId?: number | null,
    checkInTime?: string | null,
    checkOutTime?: string | null,
  ) => void
  AlertPopup: boolean
  setAlertPopup: (isOpen: boolean) => void
  /** Alert 팝업 동적 콘텐츠 */
  alertMessage: string
  alertConfirmLabel: string
  alertCancelLabel: string | null
  alertOnConfirm: (() => void) | null
  openAlertPopup: (options: {
    message: string
    confirmLabel?: string
    cancelLabel?: string | null
    onConfirm?: () => void
  }) => void
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
  // 계약 서명 시 선택된 급여 계좌 ID
  selectedSalaryAccountId: number | null
  setSelectedSalaryAccountId: (id: number | null) => void
  // 급여명세서 상세 팝업 시 선택된 급여 ID와 타입
  selectedPayrollId: number | null
  setSelectedPayrollId: (id: number | null) => void
  selectedPayrollType: string | null
  setSelectedPayrollType: (type: string | null) => void
}

export const usePopupController = create<PopupControllerState>((set) => ({
  QrCodePopup: false,
  qrCodeWorkplaceId: null,
  qrCodeStoreId: null,
  qrCodeStoreName: null,
  qrCodeCheckInTime: null,
  qrCodeCheckOutTime: null,
  AlertPopup: false,
  alertMessage: '',
  alertConfirmLabel: '확인',
  alertCancelLabel: null,
  alertOnConfirm: null,
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
  selectedSalaryAccountId: null,
  selectedPayrollId: null,
  selectedPayrollType: null,
  setQrCodePopup: (isOpen: boolean) => set((state) => ({ ...state, QrCodePopup: isOpen })),
  openQrCodePopup: (workplaceId, storeName, storeId, checkInTime, checkOutTime) =>
    set((state) => ({
      ...state,
      QrCodePopup: true,
      qrCodeWorkplaceId: workplaceId,
      qrCodeStoreId: storeId ?? null,
      qrCodeStoreName: storeName,
      qrCodeCheckInTime: checkInTime ?? null,
      qrCodeCheckOutTime: checkOutTime ?? null,
    })),
  setAlertPopup: (isOpen: boolean) => set((state) => ({
    ...state,
    AlertPopup: isOpen,
    // 팝업 닫을 때 stale closure·GC 방해 방지를 위해 콜백 참조 즉시 해제
    ...(!isOpen && { alertOnConfirm: null }),
  })),
  openAlertPopup: ({ message, confirmLabel = '확인', cancelLabel = null, onConfirm }) =>
    set((state) => ({
      ...state,
      AlertPopup: true,
      alertMessage: message,
      alertConfirmLabel: confirmLabel,
      alertCancelLabel: cancelLabel,
      alertOnConfirm: onConfirm ?? null,
    })),
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
  setSelectedSalaryAccountId: (id: number | null) => set((state) => ({ ...state, selectedSalaryAccountId: id })),
  setSelectedPayrollId: (id: number | null) => set((state) => ({ ...state, selectedPayrollId: id })),
  setSelectedPayrollType: (type: string | null) => set((state) => ({ ...state, selectedPayrollType: type })),
}))
