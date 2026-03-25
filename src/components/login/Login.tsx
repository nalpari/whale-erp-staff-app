"use client"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api-endpoints"
import { useAuthStore } from "@/store/useAuthStore"

export default function Login() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)

  const [loginId, setLoginId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!loginId || !password) {
      setError("아이디와 비밀번호를 입력해주세요.")
      return
    }

    setError("")
    setLoading(true)

    try {
      const res = await authApi.login({ loginId, password })
      login(res.data)
      router.push("/")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "로그인에 실패했습니다."
      setError(message)
      setPassword("")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <div className="login-contents">
      <div className="login-header">
        <div className="logo">
          <Image src="/assets/images/layout/login_logo.svg" alt="logo" width={60} height={60} />
        </div>
        <div className="login-b-tit">WHALE ERP</div>
        <div className="login-s-tit">FOR RESTAURANT&CAFE</div>
      </div>
      <div className="login-form">
        <div className="login-form-tit">직원 전용 Smart Application</div>
        <div className="block mb8">
          <input
            type="text"
            className="input-frame"
            placeholder="ID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="block mb8">
          <div className="input-icon-frame">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className={`input-icon-btn ${showPassword ? "show" : "hide"}`}
              onClick={() => setShowPassword(!showPassword)}
            ></button>
          </div>
        </div>
        {error && <div className="login-error-msg" style={{ color: "#e74c3c", fontSize: "13px", marginBottom: "8px" }}>{error}</div>}
        <div className="login-form-btn">
          <button className="btn-form login" onClick={handleLogin} disabled={loading}>
            {loading ? "로그인 중..." : "LOGIN"}
          </button>
        </div>
      </div>
      <div className="login-check-wrap">
        <div className="check-form-box">
          <input type="checkbox" id="login-check" />
          <label htmlFor="login-check">ID 저장</label>
        </div>
        <div className="find-btn-wrap">
          <button className="find-btn">ID 찿기 / 비밀번호 찿기</button>
        </div>
      </div>
      <div className="login-signup-wrap">
        <div className="login-signup-tit">처음 오셨나요?</div>
        <button className="btn-form outline" onClick={() => router.push("/request")}>회원가입</button>
      </div>
      <div className="another-login-wrap">
        <div className="another-login-tit">다른 방법으로 로그인</div>
        <div className="another-login-btn-wrap">
          <button className="btn-form outline-g block">
            <i className="kakao"></i>
            <span>카카오 계정으로 회원 등록</span>
          </button>
          <button className="btn-form outline-g block">
            <i className="naver"></i>
            <span>네이버 계정으로 회원 등록</span>
          </button>
          <button className="btn-form outline-g block">
            <i className="google"></i>
            <span>구글 계정으로 회원 등록</span>
          </button>
        </div>
      </div>
    </div>
  )
}
