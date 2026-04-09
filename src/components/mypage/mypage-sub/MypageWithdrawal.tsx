'use client'
import { useState } from 'react'
import { authApi } from '@/lib/api-endpoints'
import { useAuthStore } from '@/store/useAuthStore'

const REASON_OPTIONS = [
  '근무처가 없음',
  '앱 사용이 불편하거나 어려움',
  '유사한 타 서비스 이용',
  '개인정보 변경으로 인한 재가입',
]

function maskName(name: string): string {
  if (!name) return ''
  const len = name.length
  if (len === 2) return name[0] + '*'
  if (len === 3) return name[0] + '*' + name[2]
  if (len >= 4) return name[0] + '*'.repeat(len - 2) + name[len - 1]
  return name
}

export default function MypageWithdrawal() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const [selectedReasons, setSelectedReasons] = useState<string[]>([])
  const [customReason, setCustomReason] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const maskedName = maskName(user?.memberName ?? '사용자')

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    )
  }

  const handleCustomReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, 200)
    setCustomReason(value)
    // 직접 입력 시 해당 항목 자동 선택
    if (value.trim() && !selectedReasons.includes('직접입력')) {
      setSelectedReasons((prev) => [...prev, '직접입력'])
    } else if (!value.trim()) {
      setSelectedReasons((prev) => prev.filter((r) => r !== '직접입력'))
    }
  }

  const handleWithdraw = async () => {
    if (!agreed) return

    if (!confirm('정말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) return

    setLoading(true)
    try {
      await authApi.withdraw({
        reasons: selectedReasons.filter((r) => r !== '직접입력'),
        customReason: customReason.trim() || undefined,
      })
      alert('회원탈퇴가 완료되었습니다.')
      logout()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '탈퇴 처리에 실패했습니다.'
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mypage-block-wrap">
      <div className="withdrawal-header">
        <h1>
          {maskedName}님,
          <br />
          탈퇴 이유를 알려주세요.
        </h1>
        <div className="withdrawal-header-desc">
          더 좋은 서비스를 제공하기 위해 노력하겠습니다.
        </div>
      </div>
      <div className="withdrawal-check-list">
        {REASON_OPTIONS.map((reason) => (
          <button
            key={reason}
            className={`withdrawal-check-item ${selectedReasons.includes(reason) ? 'act' : ''}`}
            onClick={() => toggleReason(reason)}
          >
            <div className="withdrawal-check-item-label">{reason}</div>
            <i className="withdrawal-check-item-icon"></i>
          </button>
        ))}
      </div>
      <div className="withdrawal-textarea-wrap">
        <div className="withdrawal-textarea-tit">
          직접입력 ({customReason.length} / 200)
        </div>
        <div className="block">
          <textarea
            maxLength={200}
            className="textarea-form"
            placeholder="소중한 의견을 들려주세요."
            value={customReason}
            onChange={handleCustomReasonChange}
          ></textarea>
        </div>
      </div>
      <div className="withdrawal-warning-wrap">
        <div className="withdrawal-warning-tit">탈퇴 전 꼭 확인해주세요.</div>
        <div className="withdrawal-warning-desc">
          회원 탈퇴 시 개인정보 및 근로계약서/급여명세서 등의 정보가 모두 삭제됩니다. 추후
          재가입하여도 해당 정보는 복구되지 않습니다.
        </div>
      </div>
      <div className="withdrawal-check">
        <div className="check-form-box">
          <input
            type="checkbox"
            id="check-form-1"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <label htmlFor="check-form-1">탈퇴 유의사항을 확인했습니다.</label>
        </div>
      </div>
      <div className="withdrawal-btn-wrap">
        <button
          className="btn-form withdrawal block"
          disabled={!agreed || loading}
          onClick={handleWithdraw}
        >
          {loading ? '처리 중...' : '회원탈퇴 및 데이터 삭제하기'}
        </button>
      </div>
    </div>
  )
}
