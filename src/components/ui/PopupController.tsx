'use client'

import { useEffect } from 'react'

import { usePopupController } from '@/store/usePopupController'
import QrCodePopup from '../popup/QrCodePopup'
import Alert from '../popup/Alert'
import PasswordChangePop from '../popup/PasswordChangePop'
import AIChat from '../popup/AIChat'
import EmploymentNotificationPop from '../popup/EmploymentNotificationPop'
import EmploymentPopFrame from '../popup/employment/EmploymentPopFrame'
import SignPopup from '../popup/SignPopup'
import ContractHistoryPop from '../popup/ContractHistoryPop'
import SalaryDetailFullTime from '../popup/SalaryDetailFullTime'

export default function PopupController() {
  // 필요한 상태만 선택적으로 구독
  const isQrCodePopupOpen = usePopupController((state) => state.QrCodePopup)
  const isAlertPopupOpen = usePopupController((state) => state.AlertPopup)
  const isPasswordChangePopupOpen = usePopupController((state) => state.PasswordChangePopup)
  const isAIChatPopupOpen = usePopupController((state) => state.AIChatPopup)
  const isEmploymentNotificationPopupOpen = usePopupController((state) => state.EmploymentNotificationPopup)
  const isEmploymentPopFrameOpen = usePopupController((state) => state.EmploymentPopFrame)
  const isSignPopupOpen = usePopupController((state) => state.SignPopup)
  const isContractHistoryPopupOpen = usePopupController((state) => state.ContractHistoryPopup)
  const isSalaryDetailFullTimePopupOpen = usePopupController((state) => state.SalaryDetailFullTimePopup)

  useEffect(() => {
    // body 클래스 토글
    if (isQrCodePopupOpen || isAlertPopupOpen || isPasswordChangePopupOpen || isAIChatPopupOpen || isEmploymentNotificationPopupOpen || isEmploymentPopFrameOpen || isSignPopupOpen || isContractHistoryPopupOpen || isSalaryDetailFullTimePopupOpen) {
      document.body.classList.add('open')
    } else {
      document.body.classList.remove('open')
    }

    // 컴포넌트 언마운트 시 클래스 제거
    return () => {
      document.body.classList.remove('open')
    }
  }, [isQrCodePopupOpen, isAlertPopupOpen, isPasswordChangePopupOpen, isAIChatPopupOpen, isEmploymentNotificationPopupOpen, isEmploymentPopFrameOpen, isSignPopupOpen, isContractHistoryPopupOpen, isSalaryDetailFullTimePopupOpen])

  return (
    <>
      {isQrCodePopupOpen && <QrCodePopup />}
      {isAlertPopupOpen && <Alert />}
      {isPasswordChangePopupOpen && <PasswordChangePop />}
      {isAIChatPopupOpen && <AIChat />}
      {isEmploymentNotificationPopupOpen && <EmploymentNotificationPop />}
      {isEmploymentPopFrameOpen && <EmploymentPopFrame />}
      {isSignPopupOpen && <SignPopup />}
      {isContractHistoryPopupOpen && <ContractHistoryPop />}
      {isSalaryDetailFullTimePopupOpen && <SalaryDetailFullTime />}
    </>
  )
}
