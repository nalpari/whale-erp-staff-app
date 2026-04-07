'use client'
import { useState } from 'react'
import { Sheet } from 'react-modal-sheet'
import { useBottomSheetController } from '@/store/useBottomSheetController'

type Preset = 'recent7' | 'thisMonth' | 'lastMonth' | 'custom'

function dotToHyphen(s: string): string {
  return s.replace(/\./g, '-')
}
function hyphenToDot(s: string): string {
  return s.replace(/-/g, '.')
}

function fmt(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}`
}

function calcPreset(preset: Preset): { from: string; to: string } {
  const today = new Date()
  if (preset === 'recent7') {
    const from = new Date(today)
    from.setDate(today.getDate() - 6)
    return { from: fmt(from), to: fmt(today) }
  }
  if (preset === 'thisMonth') {
    const from = new Date(today.getFullYear(), today.getMonth(), 1)
    const to = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    return { from: fmt(from), to: fmt(to) }
  }
  if (preset === 'lastMonth') {
    const from = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const to = new Date(today.getFullYear(), today.getMonth(), 0)
    return { from: fmt(from), to: fmt(to) }
  }
  return { from: fmt(today), to: fmt(today) }
}

function getDefaultWeek(): { from: string; to: string } {
  const today = new Date()
  const end = new Date(today)
  end.setDate(today.getDate() + 6)
  return { from: fmt(today), to: fmt(end) }
}

function isOver3Months(from: string, to: string): boolean {
  const f = new Date(dotToHyphen(from))
  const t = new Date(dotToHyphen(to))
  const limit = new Date(f)
  limit.setMonth(limit.getMonth() + 3)
  return t > limit
}

const PRESETS: { key: Preset; label: string }[] = [
  { key: 'recent7', label: '최근 7일' },
  { key: 'thisMonth', label: '이번달' },
  { key: 'lastMonth', label: '지난달' },
  { key: 'custom', label: '직접입력' },
]

export default function CommuteDaySelect() {
  const commuteDaySelectSheet = useBottomSheetController((s) => s.commuteDaySelectSheet)
  const setCommuteDaySelectSheet = useBottomSheetController((s) => s.setCommuteDaySelectSheet)
  const setCommuteDateRange = useBottomSheetController((s) => s.setCommuteDateRange)
  const commuteFrom = useBottomSheetController((s) => s.commuteFrom)
  const commuteTo = useBottomSheetController((s) => s.commuteTo)

  const [preset, setPreset] = useState<Preset | null>(null)
  const [customFrom, setCustomFrom] = useState(commuteFrom)
  const [customTo, setCustomTo] = useState(commuteTo)
  const [error, setError] = useState<string | null>(null)

  const handlePreset = (p: Preset) => {
    setPreset(p)
    setError(null)
    if (p !== 'custom') {
      const range = calcPreset(p)
      setCustomFrom(range.from)
      setCustomTo(range.to)
    }
  }

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomFrom(hyphenToDot(e.target.value))
    setPreset('custom')
    setError(null)
  }

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTo(hyphenToDot(e.target.value))
    setPreset('custom')
    setError(null)
  }

  const handleApply = () => {
    if (!customFrom || !customTo) {
      setError('시작일과 종료일을 입력해주세요.')
      return
    }
    if (new Date(dotToHyphen(customFrom)) > new Date(dotToHyphen(customTo))) {
      setError('시작일은 종료일보다 이전이어야 합니다.')
      return
    }
    if (isOver3Months(customFrom, customTo)) {
      setError('최대 3개월까지 조회가 가능합니다.')
      return
    }
    setError(null)
    setCommuteDateRange(customFrom, customTo)
  }

  const handleReset = () => {
    setPreset(null)
    setError(null)
    const def = getDefaultWeek()
    setCustomFrom(def.from)
    setCustomTo(def.to)
  }

  const handleClose = () => setCommuteDaySelectSheet(false)

  return (
    <Sheet
      isOpen={commuteDaySelectSheet}
      onClose={handleClose}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>기간 설정</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="filed-wrap">
                <div className="filed-item">
                  <div className="filed-flx g8">
                    {PRESETS.map(({ key, label }) => (
                      <button
                        key={key}
                        className={`btn-form outline s block${preset === key ? ' active' : ''}`}
                        onClick={() => handlePreset(key)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="filed-item">
                  <div className="filed-flx g8" style={{ alignItems: 'center' }}>
                    <input
                      type="date"
                      className="date-picker-input"
                      style={{ flex: 1 }}
                      value={dotToHyphen(customFrom)}
                      onChange={handleFromChange}
                    />
                    <span>~</span>
                    <input
                      type="date"
                      className="date-picker-input"
                      style={{ flex: 1 }}
                      value={dotToHyphen(customTo)}
                      onChange={handleToChange}
                    />
                  </div>
                  {error
                    ? <div className="msg txt mt10" style={{ color: 'var(--color-red, #e53e3e)' }}>{error}</div>
                    : <div className="msg txt mt10">※ 최대 3개월까지 조회가 가능합니다.</div>
                  }
                </div>
              </div>
            </div>
            <div className="sheet-btn-wrap">
              <button className="btn-form outline block" onClick={handleReset}>초기화</button>
              <button className="btn-form login block" onClick={handleApply}>적용</button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  )
}
