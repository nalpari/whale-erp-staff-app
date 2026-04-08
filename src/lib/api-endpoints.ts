// ============================================================
// API 엔드포인트 함수 모음 - 도메인별로 그룹화
// ============================================================

import { apiClient, apiUpload, getAccessToken, clearTokens } from '@/lib/api'
import type { CalendarDayData } from '@/types/todo'
import type {
  ApiResponse,
  PageResponse,
  // Auth
  LoginRequest,
  LoginResponse,
  FindIdRequest,
  FindIdResponse,
  FindPasswordRequest,
  FindPasswordResponse,
  ChangePasswordRequest,
  CheckAvailabilityResponse,
  SignupRequest,
  SignupResponse,
  // Profile
  ProfileResponse,
  UpdateProfileRequest,
  UpdateProfileIconRequest,
  CodeOptions,
  // Workplace
  WorkplaceResponse,
  WorkplaceDetailResponse,
  AddWorkplaceRequest,
  // Salary Account
  SalaryAccountResponse,
  CreateSalaryAccountRequest,
  UpdateSalaryAccountRequest,
  // Career
  CareerResponse,
  CreateCareerRequest,
  // Certificate
  CertificateResponse,
  CreateCertificateRequest,
  // Document
  DocumentResponse,
  UploadFileResponse,
  // Attendance
  AttendanceTodayResponse,
  AttendanceCheckRequest,
  AttendanceCheckResponse,
  AttendanceHistoryItem,
  // Contract
  ContractListResponse,
  ContractDetailResponse,
  ContractHistoryResponse,
  ContractSignRequest,
  ContractRejectRequest,
  ContractSnapshotData,
  // Payroll
  PayrollListResponse,
  FullTimePayrollDetailResponse,
  PartTimePayrollDetailResponse,
  // Home
  CalendarResponse,
  DailySummaryResponse,
} from '@/types/api'

// ============================================================
// 인증 API
// ============================================================

export const authApi = {
  /** 회원가입 */
  signup: (data: SignupRequest) =>
    apiClient<ApiResponse<SignupResponse>>('/api/v1/mobile/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    }),

  /** 로그인 */
  login: (data: LoginRequest) =>
    apiClient<ApiResponse<LoginResponse>>('/api/v1/mobile/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    }),

  /** 아이디 찾기 */
  findId: (data: FindIdRequest) =>
    apiClient<ApiResponse<FindIdResponse>>('/api/v1/mobile/auth/find-id', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    }),

  /** 비밀번호 찾기 (재설정 이메일 발송) */
  findPassword: (data: FindPasswordRequest) =>
    apiClient<ApiResponse<FindPasswordResponse>>('/api/v1/mobile/auth/find-password', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    }),

  /** 비밀번호 변경 */
  changePassword: (data: ChangePasswordRequest) =>
    apiClient<ApiResponse<null>>('/api/v1/mobile/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** 회원탈퇴 */
  withdraw: (data: { reasons: string[]; customReason?: string }) =>
    apiClient<ApiResponse<null>>('/api/v1/mobile/auth/withdraw', {
      method: 'DELETE',
      body: JSON.stringify(data),
    }),

  /** 로그인 아이디 중복 확인 */
  checkLoginId: (loginId: string) =>
    apiClient<ApiResponse<CheckAvailabilityResponse>>(
      `/api/v1/mobile/auth/check-login-id?loginId=${encodeURIComponent(loginId)}`,
      { skipAuth: true },
    ),

  /** 이메일 중복 확인 */
  checkEmail: (email: string) =>
    apiClient<ApiResponse<CheckAvailabilityResponse>>(
      `/api/v1/mobile/auth/check-email?email=${encodeURIComponent(email)}`,
      { skipAuth: true },
    ),

  /** 직원 초대코드 검증 */
  validateInviteCode: (code: string) =>
    apiClient<ApiResponse<CheckAvailabilityResponse>>(
      `/api/v1/mobile/auth/validate-invite-code?code=${encodeURIComponent(code)}`,
      { skipAuth: true },
    ),
}

// ============================================================
// 프로필 API
// ============================================================

export const profileApi = {
  /** 내 프로필 조회 */
  getProfile: () =>
    apiClient<ApiResponse<ProfileResponse>>('/api/v1/mobile/employee/profile'),

  /** 프로필 정보 수정 */
  updateProfile: (data: UpdateProfileRequest) =>
    apiClient<ApiResponse<ProfileResponse>>('/api/v1/mobile/employee/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** 프로필 아이콘 변경 */
  updateProfileIcon: (data: UpdateProfileIconRequest) =>
    apiClient<ApiResponse<ProfileResponse>>('/api/v1/mobile/employee/profile/icon', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** 공통코드 옵션 조회 (직급/직책/계약분류) */
  getCodeOptions: () =>
    apiClient<ApiResponse<CodeOptions>>('/api/v1/mobile/employee/profile/code-options'),
}

// ============================================================
// 사업장 API
// ============================================================

export const workplaceApi = {
  /** 내 사업장 목록 조회 */
  getWorkplaces: () =>
    apiClient<ApiResponse<WorkplaceResponse[]>>('/api/v1/mobile/employee/workplaces'),

  /** 사업장 추가 (등록 코드 입력) */
  addWorkplace: (data: AddWorkplaceRequest) =>
    apiClient<ApiResponse<WorkplaceResponse>>('/api/v1/mobile/employee/workplaces', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 근무처 상세 조회 */
  getWorkplaceDetail: (id: number) =>
    apiClient<ApiResponse<WorkplaceDetailResponse>>(`/api/v1/mobile/employee/workplaces/${id}`),

  /** 근무처 급여계좌 변경 */
  changeSalaryAccount: (id: number, salaryAccountId: number) =>
    apiClient<ApiResponse<null>>(`/api/v1/mobile/employee/workplaces/${id}/salary-account`, {
      method: 'PUT',
      body: JSON.stringify({ salaryAccountId }),
    }),
}

// ============================================================
// 급여 계좌 API
// ============================================================

export const salaryAccountApi = {
  /** 급여 계좌 목록 조회 */
  getAccounts: () =>
    apiClient<ApiResponse<SalaryAccountResponse[]>>('/api/v1/mobile/employee/salary-accounts'),

  /** 급여 계좌 상세 조회 (마스킹 없는 원본 - 수정용) */
  getAccountDetail: (id: number) =>
    apiClient<ApiResponse<SalaryAccountResponse>>(`/api/v1/mobile/employee/salary-accounts/${id}`),

  /** 급여 계좌 추가 */
  createAccount: (data: CreateSalaryAccountRequest) =>
    apiClient<ApiResponse<SalaryAccountResponse>>('/api/v1/mobile/employee/salary-accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 급여 계좌 수정 */
  updateAccount: (id: number, data: UpdateSalaryAccountRequest) =>
    apiClient<ApiResponse<SalaryAccountResponse>>(`/api/v1/mobile/employee/salary-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** 급여 계좌 삭제 */
  deleteAccount: (id: number) =>
    apiClient<ApiResponse<null>>(`/api/v1/mobile/employee/salary-accounts/${id}`, {
      method: 'DELETE',
    }),

  /** 주 계좌 설정 */
  setPrimary: (id: number) =>
    apiClient<ApiResponse<null>>(`/api/v1/mobile/employee/salary-accounts/${id}/primary`, {
      method: 'PUT',
    }),
}

// ============================================================
// 경력 API
// ============================================================

export const careerApi = {
  /** 경력 목록 조회 */
  getCareers: () =>
    apiClient<ApiResponse<CareerResponse[]>>('/api/v1/mobile/employee/careers'),

  /** 경력 추가 */
  createCareer: (data: CreateCareerRequest) =>
    apiClient<ApiResponse<CareerResponse>>('/api/v1/mobile/employee/careers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 경력 수정 */
  updateCareer: (id: number, data: Partial<CreateCareerRequest>) =>
    apiClient<ApiResponse<CareerResponse>>(`/api/v1/mobile/employee/careers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** 경력 삭제 */
  deleteCareer: (id: number) =>
    apiClient<ApiResponse<null>>(`/api/v1/mobile/employee/careers/${id}`, {
      method: 'DELETE',
    }),
}

// ============================================================
// 자격증 API
// ============================================================

export const certificateApi = {
  /** 자격증 목록 조회 */
  getCertificates: () =>
    apiClient<ApiResponse<CertificateResponse[]>>('/api/v1/mobile/employee/certificates'),

  /** 자격증 추가 */
  createCertificate: (data: CreateCertificateRequest) =>
    apiClient<ApiResponse<CertificateResponse>>('/api/v1/mobile/employee/certificates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 자격증 수정 */
  updateCertificate: (id: number, data: Partial<CreateCertificateRequest>) =>
    apiClient<ApiResponse<CertificateResponse>>(`/api/v1/mobile/employee/certificates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** 자격증 삭제 */
  deleteCertificate: (id: number) =>
    apiClient<ApiResponse<null>>(`/api/v1/mobile/employee/certificates/${id}`, {
      method: 'DELETE',
    }),
}

// ============================================================
// 서류 API
// ============================================================

export const documentApi = {
  /** 서류 목록 조회 (4종류 전체) */
  getDocuments: () =>
    apiClient<ApiResponse<DocumentResponse[]>>('/api/v1/mobile/employee/documents'),

  /** 파일 업로드 → upload_files에 저장 후 ID 반환 */
  uploadFile: (file: File, category: string, referenceType: string, referenceId: number) => {
    const formData = new FormData()
    formData.append('file', file)
    const params = new URLSearchParams({ category, referenceType, referenceId: String(referenceId) })
    return apiUpload<ApiResponse<UploadFileResponse>>(`/api/v1/files/attachments?${params}`, formData)
  },

  /** 서류 등록 (업로드된 파일 ID를 member_documents에 연결) */
  createDocument: (type: string, fileId: number, expiryDate?: string) =>
    apiClient<ApiResponse<DocumentResponse>>(`/api/v1/mobile/employee/documents/${type}`, {
      method: 'POST',
      body: JSON.stringify({ fileId, expiryDate }),
    }),

  /** 서류 삭제 */
  deleteDocument: (type: string) =>
    apiClient<ApiResponse<null>>(`/api/v1/mobile/employee/documents/${type}`, {
      method: 'DELETE',
    }),
}

// ============================================================
// 출퇴근 API
// ============================================================

export const attendanceApi = {
  /** 오늘 출퇴근 현황 조회 */
  getToday: () =>
    apiClient<ApiResponse<AttendanceTodayResponse>>('/api/v1/mobile/attendance/today'),

  /** 출근 체크 (QR) */
  checkIn: (data: AttendanceCheckRequest) =>
    apiClient<ApiResponse<AttendanceCheckResponse>>('/api/v1/mobile/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 퇴근 체크 (QR) */
  checkOut: (data: AttendanceCheckRequest) =>
    apiClient<ApiResponse<AttendanceCheckResponse>>('/api/v1/mobile/attendance/check-out', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 출퇴근 이력 조회 */
  getHistory: (params?: { yearMonth?: string; workplaceId?: number }) => {
    const query = new URLSearchParams()
    if (params?.yearMonth) query.append('yearMonth', params.yearMonth)
    if (params?.workplaceId != null) query.append('workplaceId', String(params.workplaceId))
    const qs = query.toString()
    return apiClient<ApiResponse<PageResponse<AttendanceHistoryItem>>>(
      `/api/v1/mobile/attendance/history${qs ? `?${qs}` : ''}`,
    )
  },
}

// ============================================================
// 근로계약 API
// ============================================================

export const contractApi = {
  /** 계약 목록 조회 (대기 중) */
  getContracts: () =>
    apiClient<ApiResponse<ContractListResponse[]>>('/api/v1/mobile/employee/contracts'),

  /** 계약 상세 조회 */
  getContractDetail: (id: number) =>
    apiClient<ApiResponse<ContractDetailResponse>>(`/api/v1/mobile/employee/contracts/${id}`),

  /** 계약 서명 */
  signContract: (id: number, data: ContractSignRequest) =>
    apiClient<ApiResponse<null>>(`/api/v1/mobile/employee/contracts/${id}/sign`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 계약 거부 */
  rejectContract: (id: number, data?: ContractRejectRequest) =>
    apiClient<ApiResponse<null>>(`/api/v1/mobile/employee/contracts/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(data ?? {}),
    }),

  /** 계약 스냅샷 조회 (서명/거절 시점 데이터) */
  getContractSnapshot: (id: number) =>
    apiClient<ApiResponse<ContractSnapshotData>>(`/api/v1/mobile/employee/contracts/${id}/snapshot`),

  /** 계약 히스토리 조회 (완료/거부된 계약) */
  getContractHistory: () =>
    apiClient<ApiResponse<ContractHistoryResponse>>('/api/v1/mobile/employee/contracts/history'),

  /** 계약서 다운로드 (미날인 원본 docx) */
  downloadContractDocx: async (id: number) => {
    const token = getAccessToken()
    if (!token) throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.')
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    const res = await fetch(`${baseUrl}/api/v1/mobile/employee/contracts/${id}/download-docx`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (res.status === 401) {
      clearTokens()
      if (typeof window !== 'undefined') window.location.href = '/login'
      throw new Error('인증이 만료되었습니다.')
    }
    if (!res.ok) throw new Error('계약서 다운로드 실패')
    return res
  },
}

// ============================================================
// 급여명세 API
// ============================================================

export const payrollApi = {
  /** 급여명세 목록 조회 (페이징) */
  getPayrolls: (params?: { page?: number; size?: number }) => {
    const query = new URLSearchParams()
    if (params?.page != null) query.append('page', String(params.page))
    if (params?.size != null) query.append('size', String(params.size))
    const qs = query.toString()
    return apiClient<ApiResponse<PageResponse<PayrollListResponse>>>(
      `/api/v1/mobile/employee/payrolls${qs ? `?${qs}` : ''}`,
    )
  },

  /** 급여명세 상세 조회 (REGULAR: 정직원, PART_TIME: 파트타이머) */
  getPayrollDetail: (id: number) =>
    apiClient<ApiResponse<FullTimePayrollDetailResponse | PartTimePayrollDetailResponse>>(
      `/api/v1/mobile/employee/payrolls/${id}`,
    ),

  /** 급여명세서 엑셀 다운로드 (정직원) - blob과 서버 파일명 반환 */
  downloadPayrollExcel: async (id: number): Promise<{ blob: Blob; filename: string }> => {
    const token = getAccessToken()
    if (!token) throw new Error('인증 토큰이 없습니다.')
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    const res = await fetch(`${baseUrl}/api/v1/mobile/employee/payrolls/${id}/download-excel`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.status === 401) {
      clearTokens()
      if (typeof window !== 'undefined') window.location.href = '/login'
      throw new Error('인증이 만료되었습니다.')
    }
    if (!res.ok) throw new Error('엑셀 다운로드에 실패했습니다.')

    // Content-Disposition 헤더에서 파일명 추출
    const disposition = res.headers.get('content-disposition') ?? ''
    const match = disposition.match(/filename[^;=\n]*=(?:UTF-8''([^;\n]+)|['"]?([^'"\n;]+)['"]?)/)
    let filename = `payroll-statement-${id}.xlsx`
    if (match) {
      try {
        filename = decodeURIComponent(match[1] ?? match[2] ?? filename)
      } catch { /* malformed percent-encoding 시 기본 파일명 사용 */ }
    }

    const blob = await res.blob()
    return { blob, filename }
  },
}

// ============================================================
// 홈 API
// ============================================================

export const homeApi = {
  /** 월별 캘린더 데이터 조회 */
  getCalendar: (yearMonth: string) =>
    apiClient<ApiResponse<CalendarResponse>>(
      `/api/v1/mobile/home/calendar?yearMonth=${encodeURIComponent(yearMonth)}`,
    ),

  /** 일별 요약 데이터 조회 */
  getDailySummary: (date: string) =>
    apiClient<ApiResponse<DailySummaryResponse>>(
      `/api/v1/mobile/home/daily-summary?date=${encodeURIComponent(date)}`,
    ),
}

// ============================================================
// TODO API
// ============================================================

export const todoApi = {
  /** 회원별 월별 캘린더 조회 */
  getMonthlyCalendar: (memberId: number, year: number, month: number, employeeInfoId?: number | null) => {
    const params = new URLSearchParams({ memberId: String(memberId), year: String(year), month: String(month) })
    if (employeeInfoId != null) params.set('employeeInfoId', String(employeeInfoId))
    return apiClient<ApiResponse<CalendarDayData[]>>(
      `/api/v1/employee-todos/mobile/calendar/by-employee?${params.toString()}`,
    )
  },

  /** TODO 상태 변경 */
  toggleStatus: (id: number, isCompleted: boolean) =>
    apiClient<ApiResponse<null>>(`/api/v1/employee-todos/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isCompleted }),
    }),
}

