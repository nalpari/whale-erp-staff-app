'use client'
import { useEffect, useRef } from 'react'
import { usePopupController } from '@/store/usePopupController'
import { useCheckIn, useCheckOut } from '@/hooks/queries/use-attendance-queries'

function getTodayLabel(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
  return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`
}

export default function QrCodePopup() {
  const setQrCodePopup = usePopupController((state) => state.setQrCodePopup)
  const openAlertPopup = usePopupController((state) => state.openAlertPopup)
  const workplaceId = usePopupController((state) => state.qrCodeWorkplaceId)
  const storeId = usePopupController((state) => state.qrCodeStoreId)
  const storeName = usePopupController((state) => state.qrCodeStoreName)

  const { mutate: checkIn } = useCheckIn()
  const { mutate: checkOut } = useCheckOut()

  // 카메라 스트림
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    let active = true
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
      .catch(() => { /* 카메라 권한 거부 시 무시 */ })
    return () => {
      active = false
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [])

  const handleCheckIn = () => {
    if (!workplaceId) return
    openAlertPopup({
      message: `${storeName ?? '해당 근무처'}\n출근 처리하시겠습니까?`,
      confirmLabel: '출근하기',
      cancelLabel: '취소',
      onConfirm: () => {
        checkIn(
          { workplaceId, storeId },
          {
            onSuccess: () => setQrCodePopup(false),
            onError: (err) =>
              openAlertPopup({
                message: err instanceof Error ? err.message : '출근 처리 중 오류가 발생했습니다.',
              }),
          },
        )
      },
    })
  }

  const handleCheckOut = () => {
    if (!workplaceId) return
    openAlertPopup({
      message: `${storeName ?? '해당 근무처'}\n퇴근 처리하시겠습니까?`,
      confirmLabel: '퇴근하기',
      cancelLabel: '취소',
      onConfirm: () => {
        checkOut(
          { workplaceId, storeId },
          {
            onSuccess: () => setQrCodePopup(false),
            onError: (err) =>
              openAlertPopup({
                message: err instanceof Error ? err.message : '퇴근 처리 중 오류가 발생했습니다.',
              }),
          },
        )
      },
    })
  }

  return (
    <div className="modal-popup">
      <div className="modal-dialog min">
        <div className="modal-content">
          <div className="modal-header">
            <h1></h1>
            <button className="modal-close" onClick={() => setQrCodePopup(false)}></button>
          </div>
          <div className="modal-body">
            <div className="pop-frame">
              <div className="qr-frame-header">
                <div className="qr-frame-tit">{storeName ?? '출퇴근 체크'}</div>
                <div className="qr-frame-txt">{getTodayLabel()}</div>
              </div>
              <div className="qr-cam-area" style={{ height: '175px', backgroundColor: '#101010' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="qr-btn-wrap">
                <button className="btn-form login block" onClick={handleCheckIn}>
                  출근하기
                </button>
                <button className="btn-form outline block" onClick={handleCheckOut}>
                  퇴근하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
