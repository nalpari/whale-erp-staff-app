'use client'
import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { usePopupController } from '@/store/usePopupController'
import { useCheckIn, useCheckOut } from '@/hooks/queries/use-attendance-queries'
import { useWorkplaceDetail } from '@/hooks/queries/use-workplace-queries'
import { formatTodayLabel } from '@/lib/date-utils'

import { getCurrentPosition, geocodeAddress, getDistanceFromLatLng } from '@/lib/geo-utils'

const DISTANCE_LIMIT_M = 50

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
  const setQrCodePopup  = usePopupController((state) => state.setQrCodePopup)
  const openAlertPopup  = usePopupController((state) => state.openAlertPopup)
  const workplaceId     = usePopupController((state) => state.qrCodeWorkplaceId)
  const storeId         = usePopupController((state) => state.qrCodeStoreId)
  const storeName       = usePopupController((state) => state.qrCodeStoreName)
  const checkInTime     = usePopupController((state) => state.qrCodeCheckInTime)
  const checkOutTime    = usePopupController((state) => state.qrCodeCheckOutTime)

  const canCheckIn  = !checkInTime
  const canCheckOut = !!checkInTime && !checkOutTime

  const { mutate: checkIn }  = useCheckIn()
  const { mutate: checkOut } = useCheckOut()

  // ── 근무처 상세 (주소 조회용) ────────────────────────────────
  const { data: workplaceDetail } = useWorkplaceDetail(workplaceId)
  const locationCheckedRef = useRef(false)

  useEffect(() => {
    const address = workplaceDetail?.data?.workplace?.address
    if (!address || locationCheckedRef.current) return
    locationCheckedRef.current = true

    void (async () => {
      const [userPos, workplacePos] = await Promise.all([
        getCurrentPosition(),
        geocodeAddress(address),
      ])
      if (!userPos || !workplacePos) return  // 위치 정보 없으면 조용히 스킵

      const distance = getDistanceFromLatLng(
        userPos.lat, userPos.lng,
        workplacePos.lat, workplacePos.lng,
      )
      if (distance > 50) {
        openAlertPopup({
          message: `현재 위치가 근무처와\n약 ${Math.round(distance)}m 떨어져 있습니다.\n\n거리가 멀어 출퇴근 체크가 불가합니다.`,
          confirmLabel: '확인',
          onConfirm: () => setQrCodePopup(false),
        })
      }
    })()
  }, [workplaceDetail, openAlertPopup, setQrCodePopup])


  // ── 카메라 ──────────────────────────────────────────────────
  const videoRef    = useRef<HTMLVideoElement>(null)
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const streamRef   = useRef<MediaStream | null>(null)
  const rafRef      = useRef<number | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  // ── QR 스캔 결과 ─────────────────────────────────────────────
  const [scannedQr, setScannedQr] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    function scanFrame() {
      if (!active) return
      const video  = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        rafRef.current = requestAnimationFrame(scanFrame)
        return
      }
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      canvas.width  = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      })
      if (code) {
        setScannedQr(code.data)
        return  // 스캔 성공 → 루프 종료
      }
      rafRef.current = requestAnimationFrame(scanFrame)
    }

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            rafRef.current = requestAnimationFrame(scanFrame)
          }
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
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [])
  

  useEffect(() => {
    if (locationCheckedRef.current) return

    const address = workplaceDetail?.data?.workplace?.address
    if (!address) return

    locationCheckedRef.current = true

    ;(async () => {
      const [current, workplace] = await Promise.all([
        getCurrentPosition(),
        geocodeAddress(address),
      ])
      if (!current || !workplace) return

      const distance = getDistanceFromLatLng(
        current.lat, current.lng,
        workplace.lat, workplace.lng,
      )
      if (distance > DISTANCE_LIMIT_M) {
        openAlertPopup({
          message: `현재 위치가 근무처와 ${Math.round(distance)}m 떨어져 있습니다.\n출퇴근 체크가 제한될 수 있습니다.`,
          onConfirm: () => setQrCodePopup(false),
        })
      }
    })()
  }, [workplaceDetail, openAlertPopup])

  // ── 출퇴근 핸들러 ────────────────────────────────────────────
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
          { workplaceId, storeId, qrData: scannedQr },
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

  const allDone = !canCheckIn && !canCheckOut

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

              {/* 카메라 뷰 */}
              <div
                className="qr-cam-area"
                style={{ height: '175px', backgroundColor: '#101010', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}
              >
                {cameraError ? (
                  <p style={{ color: '#fff', fontSize: '13px', textAlign: 'center', padding: '0 16px', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                    {cameraError}
                  </p>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {/* 스캔 성공 오버레이 */}
                    {scannedQr && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: '8px',
                      }}>
                        <div style={{ fontSize: '28px' }}>✅</div>
                        <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>QR 스캔 완료</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* 숨김 캔버스 (jsQR 분석용) */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {/* 스캔 안내 */}
              {!cameraError && !scannedQr && !allDone && (
                <p style={{ textAlign: 'center', color: '#666', fontSize: '13px', margin: '8px 0 4px' }}>
                  QR 코드를 카메라에 비춰주세요
                </p>
              )}

              {/* 출퇴근 버튼 (QR 스캔 없이도 항상 활성화) */}
              <div className="qr-btn-wrap">
                {allDone ? (
                  <p style={{ textAlign: 'center', color: '#999', fontSize: '14px', margin: '8px 0' }}>
                    오늘 출퇴근이 모두 완료되었습니다.
                  </p>
                ) : (
                  <>
                    {canCheckIn && (
                      <button
                        className="btn-form login block"
                        onClick={() => handleAttendance('checkIn')}
                      >
                        출근하기
                      </button>
                    )}
                    {canCheckOut && (
                      <button
                        className="btn-form outline block"
                        onClick={() => handleAttendance('checkOut')}
                      >
                        퇴근하기
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
