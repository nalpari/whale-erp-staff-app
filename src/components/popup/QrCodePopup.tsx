'use client'
import { useEffect, useRef, useState } from 'react'
import { usePopupController } from '@/store/usePopupController'
import { useCheckIn, useCheckOut } from '@/hooks/queries/use-attendance-queries'
import { formatTodayLabel } from '@/lib/date-utils'

function getCameraErrorMessage(err: unknown): string {
  if (err instanceof DOMException) {
    if (err.name === 'NotAllowedError') return '카메라 접근 권한이 거부되었습니다.\n설정에서 카메라 권한을 허용해 주세요.'
    if (err.name === 'NotFoundError')  return '카메라를 찾을 수 없습니다.\n기기에 카메라가 연결되어 있는지 확인해 주세요.'
    if (err.name === 'NotReadableError') return '카메라가 이미 다른 앱에서 사용 중입니다.\n다른 앱을 종료 후 다시 시도해 주세요.'
    if (err.name === 'OverconstrainedError') return '카메라 설정이 지원되지 않습니다.'
    if (err.name === 'SecurityError') return '보안 정책으로 카메라 접근이 차단되었습니다.'
  }
  return '카메라를 시작할 수 없습니다. 다시 시도해 주세요.'
}

export default function QrCodePopup() {
  const setQrCodePopup = usePopupController((state) => state.setQrCodePopup)
  const openAlertPopup = usePopupController((state) => state.openAlertPopup)
  const workplaceId = usePopupController((state) => state.qrCodeWorkplaceId)
  const storeId = usePopupController((state) => state.qrCodeStoreId)
  const storeName = usePopupController((state) => state.qrCodeStoreName)
  const checkInTime = usePopupController((state) => state.qrCodeCheckInTime)
  const checkOutTime = usePopupController((state) => state.qrCodeCheckOutTime)

  // 근태 상태: NONE(미출근) → 출근만 가능 / CHECK_IN(출근 후) → 퇴근만 가능 / CHECK_OUT(퇴근 후) → 재출근 불가
  const canCheckIn = !checkInTime
  const canCheckOut = !!checkInTime && !checkOutTime

  const { mutate: checkIn }  = useCheckIn()
  const { mutate: checkOut } = useCheckOut()

  /** 출근/퇴근 공통 핸들러 — 구조가 동일하므로 type으로 분기 */
  const handleAttendance = (type: 'checkIn' | 'checkOut') => {
    if (!workplaceId) return
    const isCheckIn = type === 'checkIn'
    openAlertPopup({
      message: `${storeName ?? '해당 근무처'}\n${isCheckIn ? '출근' : '퇴근'} 처리하시겠습니까?`,
      confirmLabel: isCheckIn ? '출근하기' : '퇴근하기',
      cancelLabel: '취소',
      onConfirm: () => {
        const mutate = isCheckIn ? checkIn : checkOut
        const label  = isCheckIn ? '출근' : '퇴근'
        mutate(
          { workplaceId, storeId },
          {
            onSuccess: () => setQrCodePopup(false),
            onError: (err) => {
              console.error(`[QrCodePopup] ${label} 체크 실패:`, { workplaceId, storeId, error: err })
              openAlertPopup({
                message: err instanceof Error ? err.message : `${label} 처리 중 오류가 발생했습니다.`,
              })
            },
          },
        )
      },
    })
  }

  // 카메라 스트림
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

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
      .catch((err: unknown) => {
        if (!active) return
        const message = getCameraErrorMessage(err)
        console.error('[QrCodePopup] 카메라 오류:', err)
        setCameraError(message)
      })
    return () => {
      active = false
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [])

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
                <div className="qr-frame-txt">{formatTodayLabel()}</div>
              </div>
              <div className="qr-cam-area" style={{ height: '175px', backgroundColor: '#101010', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cameraError ? (
                  <p style={{ color: '#fff', fontSize: '13px', textAlign: 'center', padding: '0 16px', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                    {cameraError}
                  </p>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>
              <div className="qr-btn-wrap">
                {canCheckIn && (
                  <button className="btn-form login block" onClick={() => handleAttendance('checkIn')}>
                    출근하기
                  </button>
                )}
                {canCheckOut && (
                  <button className="btn-form outline block" onClick={() => handleAttendance('checkOut')}>
                    퇴근하기
                  </button>
                )}
                {!canCheckIn && !canCheckOut && (
                  <p style={{ textAlign: 'center', color: '#999', fontSize: '14px', margin: '8px 0' }}>
                    오늘 출퇴근이 모두 완료되었습니다.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
