'use client'
import { useState } from 'react'
import { usePopupController } from '@/store/usePopupController'
import { authApi } from '@/lib/api-endpoints'

export default function PasswordChangePop() {
  const setPasswordChangePopup = usePopupController((state) => state.setPasswordChangePopup)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  // 유효성 검사
  const pwRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,20}$/
  const isNewPwValid = newPassword === '' || pwRegex.test(newPassword)
  const isConfirmMatch = newPasswordConfirm === '' || newPassword === newPasswordConfirm

  const handleClose = () => {
    setCurrentPassword('')
    setNewPassword('')
    setNewPasswordConfirm('')
    setPasswordChangePopup(false)
  }

  const handleSubmit = async () => {
    if (!currentPassword) {
      alert('현재 비밀번호를 입력해주세요.')
      return
    }
    if (!newPassword) {
      alert('변경 비밀번호를 입력해주세요.')
      return
    }
    if (!pwRegex.test(newPassword)) {
      alert('비밀번호는 영문, 숫자, 특수문자를 포함하여 8~20자로 입력해주세요.')
      return
    }
    if (newPassword !== newPasswordConfirm) {
      alert('변경 비밀번호가 일치하지 않습니다.')
      return
    }
    if (currentPassword === newPassword) {
      alert('현재 비밀번호와 동일한 비밀번호로 변경할 수 없습니다.')
      return
    }

    setLoading(true)
    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
        newPasswordConfirm,
      })
      alert('비밀번호가 변경되었습니다.')
      handleClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '비밀번호 변경에 실패했습니다.'
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-popup">
      <div className="modal-dialog password">
        <div className="modal-content">
          <div className="modal-header">
            <h1></h1>
            <button className="modal-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="pop-frame">
              <div className="pop-frame-tit">비밀번호 변경</div>
              <div className="filed-wrap">
                {/* 현재 비밀번호 */}
                <div className="filed-item">
                  <div className="filed-item-tit">
                    현재 비밀번호 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <div className="input-icon-frame">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        placeholder="현재 비밀번호 입력"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      {currentPassword && (
                        <button
                          className="input-icon-btn del mr5"
                          onClick={() => setCurrentPassword('')}
                        ></button>
                      )}
                      <button
                        className={`input-icon-btn ${showCurrent ? 'show' : 'hide'}`}
                        onClick={() => setShowCurrent(!showCurrent)}
                      ></button>
                    </div>
                  </div>
                </div>

                {/* 변경 비밀번호 */}
                <div className="filed-item">
                  <div className="filed-item-tit">
                    변경 비밀번호 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <div className="input-icon-frame">
                      <input
                        type={showNew ? 'text' : 'password'}
                        placeholder="영문+숫자+특수문자 8~20자"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      {newPassword && (
                        <button
                          className="input-icon-btn del mr5"
                          onClick={() => setNewPassword('')}
                        ></button>
                      )}
                      <button
                        className={`input-icon-btn ${showNew ? 'show' : 'hide'}`}
                        onClick={() => setShowNew(!showNew)}
                      ></button>
                    </div>
                  </div>
                  {newPassword && !isNewPwValid && (
                    <div className="msg error mt10">영문, 숫자, 특수문자를 포함하여 8~20자로 입력해주세요.</div>
                  )}
                </div>

                {/* 변경 비밀번호 재입력 */}
                <div className="filed-item">
                  <div className="filed-item-tit">
                    변경 비밀번호 재입력 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <div className="input-icon-frame">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="변경 비밀번호 재입력"
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      />
                      {newPasswordConfirm && (
                        <button
                          className="input-icon-btn del mr5"
                          onClick={() => setNewPasswordConfirm('')}
                        ></button>
                      )}
                      <button
                        className={`input-icon-btn ${showConfirm ? 'show' : 'hide'}`}
                        onClick={() => setShowConfirm(!showConfirm)}
                      ></button>
                    </div>
                  </div>
                  {newPasswordConfirm && !isConfirmMatch && (
                    <div className="msg error mt10">변경 비밀번호가 일치하지 않습니다.</div>
                  )}
                  {newPasswordConfirm && isConfirmMatch && newPasswordConfirm.length > 0 && (
                    <div className="msg success mt10" style={{ color: '#2ecc71' }}>비밀번호가 일치합니다.</div>
                  )}
                </div>
              </div>
              <div className="pop-btn-wrap">
                <button className="btn-form outline block" onClick={handleClose}>취소</button>
                <button className="btn-form login block" onClick={handleSubmit} disabled={loading}>
                  {loading ? '변경 중...' : '변경하기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
