'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { usePopupController } from '@/store/usePopupController'
import { contractApi } from '@/lib/api-endpoints'

export default function SignPopup() {
  const setSignPopup = usePopupController((state) => state.setSignPopup)
  const setEmploymentStep = usePopupController((state) => state.setEmploymentStep)
  const selectedContractId = usePopupController((state) => state.selectedContractId)
  const selectedSalaryAccountId = usePopupController((state) => state.selectedSalaryAccountId)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [saving, setSaving] = useState(false)

  // Canvas 초기화
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 고해상도 대응
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  const getPos = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      const touch = e.touches[0]
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top }
  }, [])

  const startDraw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    setIsDrawing(true)
  }, [getPos])

  const draw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    if (!isDrawing) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const pos = getPos(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    setHasDrawn(true)
  }, [isDrawing, getPos])

  const endDraw = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const handleReset = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }

  const handleSave = async () => {
    if (!hasDrawn) {
      alert('서명을 입력해 주세요.')
      return
    }
    if (!selectedContractId) return

    const canvas = canvasRef.current
    if (!canvas) return

    setSaving(true)
    try {
      const signatureData = canvas.toDataURL('image/png')
      await contractApi.signContract(selectedContractId, {
        signatureData,
        salaryAccountId: selectedSalaryAccountId ?? undefined,
      })
      setEmploymentStep(true)
      setSignPopup(false)
    } catch (err) {
      console.error('계약 서명 실패:', err)
      alert('서명 저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setSignPopup(false)
  }

  return (
    <div className="modal-popup">
      <div className="modal-dialog min">
        <div className="modal-content">
          <div className="modal-header">
            <h1></h1>
            <button className="modal-close" onClick={handleCancel}></button>
          </div>
          <div className="modal-body">
            <div className="pop-frame">
              <div className="sign-frame-header">
                <div className="sign-frame-tit">SIGN을 해주세요</div>
                <button className="sign-reset" onClick={handleReset}></button>
              </div>
              <div
                style={{
                  height: '175px',
                  backgroundColor: '#FFF',
                  border: '1px solid #EBEBEB',
                  borderRadius: '4px',
                  touchAction: 'none',
                  cursor: 'crosshair',
                }}
              >
                <canvas
                  ref={canvasRef}
                  style={{ width: '100%', height: '100%', display: 'block' }}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={endDraw}
                />
              </div>
              <div className="qr-btn-wrap">
                <button className="btn-form outline block" onClick={handleCancel}>
                  취소
                </button>
                <button className="btn-form login block" onClick={handleSave} disabled={saving}>
                  {saving ? '저장중...' : '저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
