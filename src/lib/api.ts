// ============================================================
// API 클라이언트 - 인증 토큰 관리 및 Fetch 래퍼
// ============================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// ============================================================
// 토큰 관리
// ============================================================

/** localStorage에서 액세스 토큰을 가져온다 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('accessToken')
}

/** localStorage에서 리프레시 토큰을 가져온다 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('refreshToken')
}

/** 액세스/리프레시 토큰을 localStorage에 저장한다 */
export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)
}

/** localStorage에서 토큰을 모두 제거한다 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

// ============================================================
// API 에러 타입
// ============================================================

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ============================================================
// 메인 Fetch 래퍼
// ============================================================

/**
 * API 요청을 수행하는 메인 클라이언트 함수
 * - 자동으로 Authorization: Bearer 토큰 첨부
 * - 401 응답 시 토큰 삭제 후 /login으로 리다이렉트
 * - JSON 응답 파싱 및 에러 처리
 */
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit & { skipAuth?: boolean },
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options ?? {}

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }

  // 인증이 필요한 경우 Authorization 헤더 추가
  if (!skipAuth) {
    const token = getAccessToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  // 401: 인증 만료 → 토큰 삭제 후 로그인으로 이동 (skipAuth 요청은 제외)
  if (response.status === 401 && !skipAuth) {
    clearTokens()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new ApiError('인증이 만료되었습니다. 다시 로그인해주세요.', 401)
  }

  // 응답 본문 파싱
  let data: unknown
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  // HTTP 에러 처리
  if (!response.ok) {
    const errorMessage =
      (data as { message?: string })?.message ??
      `요청에 실패했습니다. (${response.status})`
    throw new ApiError(errorMessage, response.status)
  }

  return data as T
}

/**
 * 파일 업로드용 API 클라이언트
 * - Content-Type을 설정하지 않음 (FormData가 boundary를 자동 설정)
 * - Authorization 토큰 자동 첨부
 */
export async function apiUpload<T>(
  endpoint: string,
  formData: FormData,
): Promise<T> {
  const headers: Record<string, string> = {}
  const token = getAccessToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  })

  if (response.status === 401) {
    clearTokens()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new ApiError('인증이 만료되었습니다.', 401)
  }

  let data: unknown
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    const errorMessage =
      (data as { message?: string })?.message ?? `파일 업로드에 실패했습니다. (${response.status})`
    throw new ApiError(errorMessage, response.status)
  }

  return data as T
}
