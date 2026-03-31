'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authApi } from '@/lib/api-endpoints'

type Tab = 'findId' | 'findPw'

export default function FindAccount() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get('tab') === 'findPw' ? 'findPw' : 'findId') as Tab

  const [activeTab, setActiveTab] = useState<Tab>(initialTab)

  // ID 찾기 상태
  const [idName, setIdName] = useState('')
  const [idEmail, setIdEmail] = useState('')
  const [idLoading, setIdLoading] = useState(false)
  const [idError, setIdError] = useState('')
  const [foundId, setFoundId] = useState<string | null>(null)
  const [foundName, setFoundName] = useState('')

  // 비밀번호 찾기 상태
  const [pwName, setPwName] = useState('')
  const [pwLoginId, setPwLoginId] = useState('')
  const [pwEmail, setPwEmail] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)

  const goLogin = () => router.push('/login')

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setIdError('')
    setPwError('')
    setPwSuccess(false)
    setFoundId(null)
  }

  // ID 찾기 실행
  const handleFindId = async () => {
    if (!idName || !idEmail) return

    setIdError('')
    setIdLoading(true)
    try {
      const res = await authApi.findId({ name: idName, email: idEmail })
      setFoundId(res.data.loginId)
      setFoundName(res.data.memberName)
    } catch {
      setIdError('일치하는 결과를 찾을 수 없습니다!')
    } finally {
      setIdLoading(false)
    }
  }

  // 비밀번호 찾기 실행
  const handleFindPw = async () => {
    if (!pwName || !pwLoginId || !pwEmail) return

    setPwError('')
    setPwLoading(true)
    try {
      await authApi.findPassword({ name: pwName, loginId: pwLoginId, email: pwEmail })
      setPwSuccess(true)
    } catch {
      setPwError('입력하신 내용을 다시 확인해 주세요.')
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <div style={{ padding: '32px 24px 22px' }}>
      {/* 탭 */}
      <div style={{ display: 'flex', gap: 0, marginBottom: '24px' }}>
        <button
          style={{
            flex: 1,
            height: '48px',
            fontSize: '16px',
            fontWeight: activeTab === 'findId' ? 600 : 400,
            color: activeTab === 'findId' ? '#1a1a1a' : '#999',
            borderBottom: activeTab === 'findId' ? '2px solid #1a1a1a' : '2px solid #e5e5e5',
            background: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease-in-out',
          }}
          onClick={() => handleTabChange('findId')}
        >
          ID 찾기
        </button>
        <button
          style={{
            flex: 1,
            height: '48px',
            fontSize: '16px',
            fontWeight: activeTab === 'findPw' ? 600 : 400,
            color: activeTab === 'findPw' ? '#1a1a1a' : '#999',
            borderBottom: activeTab === 'findPw' ? '2px solid #1a1a1a' : '2px solid #e5e5e5',
            background: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease-in-out',
          }}
          onClick={() => handleTabChange('findPw')}
        >
          비밀번호 찾기
        </button>
      </div>

      {/* ID 찾기 탭 */}
      {activeTab === 'findId' && (
        <div>
          {!foundId ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="block">
                  <input
                    type="text"
                    className="input-frame"
                    placeholder="이름"
                    value={idName}
                    onChange={(e) => setIdName(e.target.value)}
                  />
                </div>
                <div className="block">
                  <input
                    type="email"
                    className="input-frame"
                    placeholder="이메일"
                    value={idEmail}
                    onChange={(e) => setIdEmail(e.target.value)}
                  />
                </div>
              </div>
              {idError && (
                <div style={{ color: '#ff3838', fontSize: '13px', marginTop: '10px' }}>
                  {idError}
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                <button className="btn-form outline block" onClick={goLogin} style={{ flex: 1 }}>
                  취소
                </button>
                <button
                  className="btn-form login block"
                  onClick={handleFindId}
                  disabled={idLoading || !idName || !idEmail}
                  style={{ flex: 1 }}
                >
                  {idLoading ? '확인 중...' : 'ID 찾기'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: '#f5f5f5',
                borderRadius: '12px',
              }}>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a', marginBottom: '12px' }}>
                  ID 찾기 완료
                </div>
                <div style={{ fontSize: '15px', color: '#666', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, color: '#2379e4' }}>{foundName}</span>님의 아이디
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#1a1a1a',
                  fontFamily: "'Courier New', Courier, monospace",
                  background: '#fff',
                  display: 'inline-block',
                  padding: '8px 20px',
                  borderRadius: '6px',
                  letterSpacing: '1px',
                }}>
                  {foundId}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                <button
                  className="btn-form outline block"
                  onClick={() => handleTabChange('findPw')}
                  style={{ flex: 1 }}
                >
                  비밀번호 찾기
                </button>
                <button className="btn-form login block" onClick={goLogin} style={{ flex: 1 }}>
                  로그인
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 비밀번호 찾기 탭 */}
      {activeTab === 'findPw' && (
        <div>
          {!pwSuccess ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="block">
                  <input
                    type="text"
                    className="input-frame"
                    placeholder="이름"
                    value={pwName}
                    onChange={(e) => setPwName(e.target.value)}
                  />
                </div>
                <div className="block">
                  <input
                    type="text"
                    className="input-frame"
                    placeholder="아이디"
                    value={pwLoginId}
                    onChange={(e) => setPwLoginId(e.target.value)}
                  />
                </div>
                <div className="block">
                  <input
                    type="email"
                    className="input-frame"
                    placeholder="이메일"
                    value={pwEmail}
                    onChange={(e) => setPwEmail(e.target.value)}
                  />
                </div>
              </div>
              {pwError && (
                <div style={{ color: '#ff3838', fontSize: '13px', marginTop: '10px' }}>
                  {pwError}
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                <button className="btn-form outline block" onClick={goLogin} style={{ flex: 1 }}>
                  취소
                </button>
                <button
                  className="btn-form login block"
                  onClick={handleFindPw}
                  disabled={pwLoading || !pwName || !pwLoginId || !pwEmail}
                  style={{ flex: 1 }}
                >
                  {pwLoading ? '확인 중...' : '비밀번호 찾기'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: '#f5f5f5',
                borderRadius: '12px',
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#2379e4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px' }}>
                  임시 비밀번호 발송 완료
                </div>
                <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                  입력하신 이메일로 임시 비밀번호를<br />전송하였습니다.
                </div>
                <div style={{ fontSize: '13px', color: '#999', marginTop: '12px' }}>
                  임시 비밀번호로 로그인 후<br />비밀번호를 변경해 주세요.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                <button className="btn-form login block" onClick={goLogin} style={{ flex: 1 }}>
                  로그인 하러 가기
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
