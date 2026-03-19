'use client'
import { usePopupController } from '@/store/usePopupController'

export default function EmploymentList() {
  const setEmploymentPopFrame = usePopupController((state) => state.setEmploymentPopFrame)

  return (
    <div className="data-wrap">
      <div className="data-tit">근로계약서</div>
      <div className="data-list">
        <button className="data-item" onClick={() => setEmploymentPopFrame(true)}>
          <div className="employment-item-inner">
            <div className="employment-stemp blue">
              <span>계약</span>
              <span>하기</span>
            </div>
            <div className="employment-info">
              <div className="employment-info-name">힘이나는커피생활 을지로3가점</div>
              <div className="employment-info-desc">
                <span>수신일 2026.02.28</span>
                <span>체결일 2026.02.28</span>
              </div>
            </div>
          </div>
        </button>
        <button className="data-item">
          <div className="employment-item-inner">
            <div className="employment-stemp grey">
              <span>계약</span>
              <span>완료</span>
            </div>
            <div className="employment-info">
              <div className="employment-info-name">힘이나는커피생활 을지로3가점</div>
              <div className="employment-info-desc">
                <span>수신일 2026.02.28</span>
                <span>체결일 2026.02.28</span>
              </div>
            </div>
          </div>
        </button>
        <button className="data-item">
          <div className="employment-item-inner">
            <div className="employment-stemp red">
              <span>거절</span>
            </div>
            <div className="employment-info">
              <div className="employment-info-name">힘이나는커피생활 을지로3가점</div>
              <div className="employment-info-desc">
                <span>수신일 2026.02.28</span>
                <span>체결일 2026.02.28</span>
              </div>
            </div>
          </div>
        </button>
        <div className="data-item">
          <div className="workplace-empty">등록된 근로계약이 없습니다.</div>
        </div>
      </div>
    </div>
  )
}
