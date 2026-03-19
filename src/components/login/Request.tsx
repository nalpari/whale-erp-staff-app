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
          <div className="request-comment-tit">인증 후 회원가입이 진행 됩니다.</div>
          <div className="request-comment-desc">
            안전한 서비스 이용을 위해 본인 인증을
            <br /> 진행해주세요.
          </div>
        </div>
      </div>
      <div className="request-btn">
        <button className="btn-form login block" onClick={() => router.push('/signup')}>
          본인 인증
        </button>
      </div>
    </div>
  )
}
