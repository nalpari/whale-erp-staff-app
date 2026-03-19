'use client'
import { useState } from 'react'
import CommuteCheck from './CommuteCheck'
import CommuteWork from './CommuteWork'

export default function CommuteContents() {
  const [commuteTab, setCommuteTab] = useState<'check' | 'work'>('check')
  return (
    <div className="commute-contents">
      <div className="commute-contents-header">
        <div className="commute-tab-wrap">
          <button
            className={`btn-form block outline xs ${commuteTab === 'check' ? 'active' : ''}`}
            onClick={() => setCommuteTab('check')}
          >
            출퇴근 체크
          </button>
          <button
            className={`btn-form block outline xs ${commuteTab === 'work' ? 'active' : ''}`}
            onClick={() => setCommuteTab('work')}
          >
            근무일정
          </button>
        </div>
      </div>
      {commuteTab === 'check' ? <CommuteCheck /> : <CommuteWork />}
    </div>
  )
}
