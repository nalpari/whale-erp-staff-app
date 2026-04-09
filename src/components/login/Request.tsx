'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Request() {
  const router = useRouter()
  return (
    <div className="request-wrap">
      <div className="request-contents">
        <div className="request-img">
          <Image src="/assets/images/layout/request_img.svg" alt="request" width={200} height={200} />
        </div>
        <div className="request-comment">
          <div className="request-comment-tit">회원가입을 진행합니다.</div>
          <div className="request-comment-desc">
            아래 버튼을 눌러 회원가입을 시작하세요.
            <br />
            <span style={{ fontSize: '12px', color: '#999' }}>(본인인증은 추후 연동 예정입니다)</span>
          </div>
        </div>
      </div>
      <div className="request-btn">
        <button className="btn-form login block" onClick={() => router.push('/signup')}>
          회원가입 진행
        </button>
      </div>
    </div>
  )
}
