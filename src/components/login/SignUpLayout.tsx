'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { authApi } from '@/lib/api-endpoints'

// 다음 주소찾기 타입
declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string
          address: string
          roadAddress: string
          jibunAddress: string
          buildingName: string
        }) => void
      }) => { open: () => void }
    }
  }
}

export default function SignUpLayout() {
  const router = useRouter()
  const openBankSelect = useBottomSheetController((state) => state.openBankSelect)

  // 급여계좌
  const [bankName, setBankName] = useState('')

  // 로그인 정보
  const [loginId, setLoginId] = useState('')
  const [loginIdMsg, setLoginIdMsg] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' })
  const [pw, setPw] = useState('')
  const [pwConfirm, setPwConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showPwConfirm, setShowPwConfirm] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' })
  const [pwConfirmMsg, setPwConfirmMsg] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' })

  // 개인정보
  const [name, setName] = useState('')
  const [ssnFront, setSsnFront] = useState('')
  const [ssnGender, setSsnGender] = useState('')
  const [phone, setPhone] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [address, setAddress] = useState('')
  const [addressDetail, setAddressDetail] = useState('')
  const [email, setEmail] = useState('')
  const [emailMsg, setEmailMsg] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' })

  // 직원코드
  const [inviteCode, setInviteCode] = useState('')
  const [inviteCodeMsg, setInviteCodeMsg] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' })
  const [inviteCodeVerified, setInviteCodeVerified] = useState(false)
  const [inviteCodeLoading, setInviteCodeLoading] = useState(false)

  // 프로필 아이콘
  const [selectedAvatar, setSelectedAvatar] = useState(1)

  // 약관 동의
  const [agreements, setAgreements] = useState({ all: false, terms: false, privacy: false, thirdParty: false })

  // 제출 상태
  const [submitting, setSubmitting] = useState(false)

  // 아이디 중복확인 디바운스
  const idCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 다음 주소찾기 스크립트 로드
  useEffect(() => {
    if (document.getElementById('daum-postcode-script')) return
    const script = document.createElement('script')
    script.id = 'daum-postcode-script'
    script.src = '//t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    document.head.appendChild(script)
  }, [])

  // 아이디 유효성 + 중복 체크
  const handleLoginIdChange = useCallback((value: string) => {
    // 영문 소문자, 숫자만 허용
    const cleaned = value.replace(/[^a-z0-9]/g, '')
    setLoginId(cleaned)

    if (idCheckTimer.current) clearTimeout(idCheckTimer.current)

    if (!cleaned) {
      setLoginIdMsg({ type: '', text: '' })
      return
    }

    if (cleaned.length < 6) {
      setLoginIdMsg({ type: 'error', text: '영문/숫자 조합 6~20자로 입력해주세요.' })
      return
    }

    // 입력 멈추면 중복 확인
    idCheckTimer.current = setTimeout(async () => {
      try {
        const res = await authApi.checkLoginId(cleaned)
        if (res.data.available) {
          setLoginIdMsg({ type: 'success', text: '사용 가능한 아이디입니다.' })
        } else {
          setLoginIdMsg({ type: 'error', text: '이미 사용 중인 아이디입니다.' })
        }
      } catch {
        setLoginIdMsg({ type: 'error', text: '중복 확인에 실패했습니다.' })
      }
    }, 500)
  }, [])

  // 비밀번호 유효성
  const validatePassword = useCallback((value: string) => {
    const hasLetter = /[a-zA-Z]/.test(value)
    const hasNumber = /[0-9]/.test(value)
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)
    const validLength = value.length >= 8 && value.length <= 20

    if (!value) {
      setPwMsg({ type: '', text: '영문, 숫자, 특수문자, 8~20자 이내' })
      return
    }

    const conditions = []
    if (!hasLetter) conditions.push('영문')
    if (!hasNumber) conditions.push('숫자')
    if (!hasSpecial) conditions.push('특수문자')
    if (!validLength) conditions.push('8~20자')

    if (conditions.length > 0) {
      setPwMsg({ type: 'error', text: `${conditions.join(', ')} 조건을 충족해주세요.` })
    } else {
      setPwMsg({ type: 'success', text: '사용 가능한 비밀번호입니다.' })
    }
  }, [])

  // 비밀번호 확인 체크
  const checkPwConfirm = useCallback((confirm: string, original: string) => {
    if (!confirm) {
      setPwConfirmMsg({ type: '', text: '' })
      return
    }
    if (confirm !== original) {
      setPwConfirmMsg({ type: 'error', text: '비밀번호가 다릅니다.' })
    } else {
      setPwConfirmMsg({ type: 'success', text: '비밀번호가 일치합니다.' })
    }
  }, [])

  // 이메일 중복확인
  const emailCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleEmailChange = useCallback((value: string) => {
    setEmail(value)
    if (emailCheckTimer.current) clearTimeout(emailCheckTimer.current)

    if (!value) {
      setEmailMsg({ type: '', text: '' })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      setEmailMsg({ type: 'error', text: '올바른 이메일 형식이 아닙니다.' })
      return
    }

    emailCheckTimer.current = setTimeout(async () => {
      try {
        const res = await authApi.checkEmail(value)
        if (res.data.available) {
          setEmailMsg({ type: 'success', text: '사용 가능한 이메일입니다.' })
        } else {
          setEmailMsg({ type: 'error', text: '이미 사용 중인 이메일입니다.' })
        }
      } catch {
        setEmailMsg({ type: 'error', text: '이메일 확인에 실패했습니다.' })
      }
    }, 500)
  }, [])

  // 다음 주소찾기
  const openAddressSearch = () => {
    if (!window.daum) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }
    new window.daum.Postcode({
      oncomplete: (data) => {
        setZipCode(data.zonecode)
        setAddress(data.roadAddress || data.address)
        // 상세주소 입력으로 포커스
        setTimeout(() => {
          document.getElementById('address-detail')?.focus()
        }, 100)
      },
    }).open()
  }

  // 약관 전체 동의
  const handleAllAgreement = (checked: boolean) => {
    setAgreements({ all: checked, terms: checked, privacy: checked, thirdParty: checked })
  }

  // 개별 약관
  const handleAgreement = (key: 'terms' | 'privacy' | 'thirdParty', checked: boolean) => {
    const next = { ...agreements, [key]: checked }
    next.all = next.terms && next.privacy && next.thirdParty
    setAgreements(next)
  }

  // 초대코드 검증
  const handleValidateInviteCode = async () => {
    if (inviteCode.length !== 12) return
    setInviteCodeLoading(true)
    try {
      const res = await authApi.validateInviteCode(inviteCode)
      if (res.data.available) {
        setInviteCodeMsg({ type: 'success', text: res.data.message })
        setInviteCodeVerified(true)
      } else {
        setInviteCodeMsg({ type: 'error', text: res.data.message })
        setInviteCodeVerified(false)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '코드 확인에 실패했습니다.'
      setInviteCodeMsg({ type: 'error', text: message })
      setInviteCodeVerified(false)
    } finally {
      setInviteCodeLoading(false)
    }
  }

  // 가입하기
  const handleSubmit = async () => {
    if (!loginId || loginIdMsg.type !== 'success') {
      alert('아이디를 확인해주세요.')
      return
    }
    if (pwMsg.type !== 'success') {
      alert('비밀번호를 확인해주세요.')
      return
    }
    if (pw !== pwConfirm) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }
    if (!name) {
      alert('이름을 입력해주세요.')
      return
    }
    if (inviteCode && !inviteCodeVerified) {
      alert('초대코드의 확인 버튼을 눌러주세요.')
      return
    }
    if (!agreements.terms || !agreements.privacy || !agreements.thirdParty) {
      alert('필수 약관에 모두 동의해주세요.')
      return
    }

    setSubmitting(true)
    try {
      const signupData = {
        loginId,
        password: pw,
        passwordConfirm: pwConfirm,
        name,
        phone: phone || undefined,
        email: email || undefined,
        zipCode: zipCode || undefined,
        address: address || undefined,
        addressDetail: addressDetail || undefined,
        inviteCode: inviteCodeVerified ? inviteCode : undefined,
        bankName: bankName || undefined,
        accountNumber: (document.querySelector<HTMLInputElement>('input[placeholder*="계좌번호"]')?.value) || undefined,
        accountHolder: (document.querySelector<HTMLInputElement>('input[placeholder*="예금주"]')?.value) || undefined,
      }
      console.log('[회원가입] 전송 데이터:', JSON.stringify(signupData, null, 2))
      await authApi.signup(signupData)
      alert('환영합니다! 회원가입이 완료되었습니다.')
      router.push('/login')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '회원가입에 실패했습니다.'
      alert(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-contents">
      <div className="signup-filed-wrap">
        {/* 로그인 정보 */}
        <div className="signup-filed-form">
          <div className="signup-filed-tit">로그인 정보</div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">
              아이디 <span className="imp">*</span>
            </div>
            <div className="block">
              <input
                type="text"
                className={`input-frame ${loginIdMsg.type === 'error' ? 'error' : ''}`}
                placeholder="영문/숫자 조합 6~20자"
                value={loginId}
                onChange={(e) => handleLoginIdChange(e.target.value)}
                maxLength={20}
              />
            </div>
            {loginIdMsg.text && (
              <div className={`msg ${loginIdMsg.type} mt10`}>{loginIdMsg.text}</div>
            )}
          </div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">
              비밀번호 <span className="imp">*</span>
            </div>
            <div className="block">
              <div className="input-icon-frame">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="영문, 숫자, 특수문자 포함 8~20자"
                  value={pw}
                  onChange={(e) => {
                    setPw(e.target.value)
                    validatePassword(e.target.value)
                    if (pwConfirm) checkPwConfirm(pwConfirm, e.target.value)
                  }}
                  maxLength={20}
                />
                {pw && (
                  <button className="input-icon-btn del mr5" onClick={() => { setPw(''); setPwMsg({ type: '', text: '영문, 숫자, 특수문자, 8~20자 이내' }) }}></button>
                )}
                <button
                  className={`input-icon-btn ${showPw ? 'show' : 'hide'}`}
                  onClick={() => setShowPw(!showPw)}
                ></button>
              </div>
            </div>
            {pwMsg.text && (
              <div className={`msg ${pwMsg.type} mt10`}>{pwMsg.text}</div>
            )}
          </div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">
              비밀번호 재입력 <span className="imp">*</span>
            </div>
            <div className="block">
              <div className="input-icon-frame">
                <input
                  type={showPwConfirm ? 'text' : 'password'}
                  placeholder="비밀번호 재입력"
                  value={pwConfirm}
                  onChange={(e) => {
                    setPwConfirm(e.target.value)
                    checkPwConfirm(e.target.value, pw)
                  }}
                  maxLength={20}
                />
                <button
                  className={`input-icon-btn ${showPwConfirm ? 'show' : 'hide'}`}
                  onClick={() => setShowPwConfirm(!showPwConfirm)}
                ></button>
              </div>
            </div>
            {pwConfirmMsg.text && (
              <div className={`msg ${pwConfirmMsg.type} mt10`}>{pwConfirmMsg.text}</div>
            )}
          </div>
        </div>

        {/* 직원 초대 코드 */}
        <div className="signup-filed-form">
          <div className="signup-filed-tit">직원 초대 코드 입력</div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">코드를 입력하면 가입 즉시 근무처와 연결됩니다.</div>
            <div className="block">
              <input
                type="text"
                className={`input-frame${inviteCodeMsg.type === 'error' ? ' error' : ''}`}
                placeholder="직원 초대 코드 12자리 입력"
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12))
                  setInviteCodeVerified(false)
                  setInviteCodeMsg({ type: '', text: '' })
                }}
                maxLength={12}
                disabled={inviteCodeVerified}
              />
            </div>
            {inviteCode.length === 12 && !inviteCodeMsg.text && (
              <div className="msg mt10">확인 버튼을 눌러 주세요.</div>
            )}
            {inviteCodeMsg.text && (
              <div className={`msg mt10 ${inviteCodeMsg.type === 'success' ? 'success' : 'error'}`}>
                {inviteCodeMsg.text}
              </div>
            )}
            <div className="btn-wrap mt10">
              <button
                className="btn-form outline block"
                disabled={inviteCode.length !== 12 || inviteCodeVerified || inviteCodeLoading}
                onClick={handleValidateInviteCode}
              >
                {inviteCodeLoading ? '확인 중...' : '확인'}
              </button>
            </div>
          </div>
        </div>

        {/* 개인정보 */}
        <div className="signup-filed-form">
          <div className="signup-filed-tit">개인정보</div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">프로필 아이콘 설정</div>
            <div className="avatar-wrap">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  className={`avatar-btn ${selectedAvatar === n ? 'act' : ''}`}
                  onClick={() => setSelectedAvatar(n)}
                >
                  <Image src={`/assets/images/layout/avatar0${n}.svg`} alt={`avatar${n}`} width={62} height={62} />
                </button>
              ))}
            </div>
          </div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">
              이름 <span className="imp">*</span>
            </div>
            <div className="block">
              <input
                type="text"
                className="input-frame"
                placeholder="이름을 입력해주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">
              주민등록 번호 <span className="imp">*</span>
            </div>
            <div className="id-number-wrap">
              <div className="id-number">
                <input
                  type="text"
                  className="input-frame"
                  placeholder="생년월일 6자리"
                  value={ssnFront}
                  onChange={(e) => setSsnFront(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  maxLength={6}
                />
              </div>
              <div className="id-number">
                <div className="back-input">
                  <input
                    type="text"
                    className="input-frame num"
                    placeholder="●"
                    value={ssnGender}
                    onChange={(e) => setSsnGender(e.target.value.replace(/[^0-9]/g, '').slice(0, 1))}
                    maxLength={1}
                  />
                  <input type="text" className="input-frame num" value="*" readOnly />
                  <input type="text" className="input-frame num" value="*" readOnly />
                  <input type="text" className="input-frame num" value="*" readOnly />
                  <input type="text" className="input-frame num" value="*" readOnly />
                  <input type="text" className="input-frame num" value="*" readOnly />
                  <input type="text" className="input-frame num" value="*" readOnly />
                </div>
              </div>
            </div>
            <div className="msg mt10">주민등록 번호 뒷자리는 직접 입력해 주세요. 근로계약서 작성 시 필요합니다.</div>
          </div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">
              휴대폰 번호 <span className="imp">*</span>
            </div>
            <div className="block">
              <input
                type="text"
                className="input-frame"
                placeholder="휴대폰 번호 입력 (숫자만)"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
                maxLength={11}
              />
            </div>
          </div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">
              주소 <span className="imp">*</span>
            </div>
            <div className="block">
              <button className="btn-form outline block" onClick={openAddressSearch}>주소찾기</button>
            </div>
            {address && (
              <div className="block mt10">
                <input
                  type="text"
                  className="input-frame"
                  readOnly
                  value={`(${zipCode}) ${address}`}
                />
              </div>
            )}
            <div className="block mt10">
              <input
                id="address-detail"
                type="text"
                className="input-frame"
                placeholder="상세주소를 입력해주세요 (예: 101동 1205호)"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
              />
            </div>
          </div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">
              이메일 <span className="imp">*</span>
            </div>
            <div className="block">
              <input
                type="text"
                className={`input-frame ${emailMsg.type === 'error' ? 'error' : ''}`}
                placeholder="이메일 입력 (예: user@email.com)"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
              />
            </div>
            {emailMsg.text && (
              <div className={`msg ${emailMsg.type} mt10`}>{emailMsg.text}</div>
            )}
          </div>
        </div>

        {/* 급여 계좌 */}
        <div className="signup-filed-form">
          <div className="signup-filed-tit">급여 계좌</div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">은행 선택</div>
            <div className="block">
              <button
                className="select-form al-l"
                onClick={() => openBankSelect((selected) => setBankName(selected))}
              >
                {bankName || '선택'}
              </button>
            </div>
          </div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">계좌번호 입력</div>
            <div className="block">
              <input type="text" className="input-frame" placeholder="하이픈(-) 없이 숫자만 입력" />
            </div>
          </div>
          <div className="signup-filed-item">
            <div className="signup-filed-item-tit">예금주</div>
            <div className="block">
              <input type="text" className="input-frame" placeholder="예금주 입력" />
            </div>
            <div className="msg mt10">급여계좌 정보를 모두 입력하거나, 모두 지워주세요.</div>
          </div>
        </div>

        {/* 약관 동의 */}
        <div className="signup-filed-form">
          <div className="check-form-warp">
            <div className="check-form-tit">
              서비스 이용약관 동의 <span className="imp">*</span>
            </div>
            <div className="check-form-list">
              <div className="check-form-item">
                <div className="check-form-box">
                  <input
                    type="checkbox"
                    id="check-form-1"
                    checked={agreements.all}
                    onChange={(e) => handleAllAgreement(e.target.checked)}
                  />
                  <label htmlFor="check-form-1">전체 동의</label>
                </div>
              </div>
              <div className="check-form-item">
                <div className="check-form-box">
                  <input
                    type="checkbox"
                    id="check-form-2"
                    checked={agreements.terms}
                    onChange={(e) => handleAgreement('terms', e.target.checked)}
                  />
                  <label htmlFor="check-form-2">[필수] 이용약관</label>
                </div>
                <button className="check-form-btn">보기</button>
              </div>
              <div className="check-form-item">
                <div className="check-form-box">
                  <input
                    type="checkbox"
                    id="check-form-3"
                    checked={agreements.privacy}
                    onChange={(e) => handleAgreement('privacy', e.target.checked)}
                  />
                  <label htmlFor="check-form-3">[필수] 개인정보 수집 이용</label>
                </div>
                <button className="check-form-btn">보기</button>
              </div>
              <div className="check-form-item">
                <div className="check-form-box">
                  <input
                    type="checkbox"
                    id="check-form-4"
                    checked={agreements.thirdParty}
                    onChange={(e) => handleAgreement('thirdParty', e.target.checked)}
                  />
                  <label htmlFor="check-form-4">[필수] 개인정보 제3자 제공</label>
                </div>
                <button className="check-form-btn">보기</button>
              </div>
            </div>
          </div>
        </div>

        {/* 가입 버튼 */}
        <div className="signup-filed-btn">
          <button
            className="btn-form login block"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? '가입 중...' : '가입하기'}
          </button>
        </div>
      </div>
    </div>
  )
}
