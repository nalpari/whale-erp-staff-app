// ============================================================
// API 엔드포인트 함수 모음 - 도메인별로 그룹화
// ============================================================

import { apiClient, apiUpload } from '@/lib/api'
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
  ContractSignRequest,
  ContractRejectRequest,
  // Payroll
  PayrollListResponse,
  PayrollDetailResponse,
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
    apiClient<ApiResponse<SignupResponse>>('/api/mobile/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    }),

  /** 로그인 */
  login: (data: LoginRequest) =>
    apiClient<ApiResponse<LoginResponse>>('/api/mobile/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    }),

  /** 아이디 찾기 */
  findId: (data: FindIdRequest) =>
    apiClient<ApiResponse<FindIdResponse>>('/api/mobile/auth/find-id', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    }),

  /** 비밀번호 찾기 (재설정 이메일 발송) */
  findPassword: (data: FindPasswordRequest) =>
    apiClient<ApiResponse<FindPasswordResponse>>('/api/mobile/auth/find-password', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    }),

  /** 비밀번호 변경 */
  changePassword: (data: ChangePasswordRequest) =>
    apiClient<ApiResponse<null>>('/api/mobile/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** 회원탈퇴 */
  withdraw: (data: { reasons: string[]; customReason?: string }) =>
    apiClient<ApiResponse<null>>('/api/mobile/auth/withdraw', {
      method: 'DELETE',
      body: JSON.stringify(data),
    }),

  /** 로그인 아이디 중복 확인 */
  checkLoginId: (loginId: string) =>
    apiClient<ApiResponse<CheckAvailabilityResponse>>(
      `/api/mobile/auth/check-login-id?loginId=${encodeURIComponent(loginId)}`,
      { skipAuth: true },
    ),

  /** 이메일 중복 확인 */
  checkEmail: (email: string) =>
    apiClient<ApiResponse<CheckAvailabilityResponse>>(
      `/api/mobile/auth/check-email?email=${encodeURIComponent(email)}`,
      { skipAuth: true },
    ),

  /** 직원 초대코드 검증 */
  validateInviteCode: (code: string) =>
    apiClient<ApiResponse<CheckAvailabilityResponse>>(
      `/api/mobile/auth/validate-invite-code?code=${encodeURIComponent(code)}`,
      { skipAuth: true },
    ),
}

// ============================================================
// 프로필 API
// ============================================================

export const profileApi = {
  /** 내 프로필 조회 */
  getProfile: () =>
    apiClient<ApiResponse<ProfileResponse>>('/api/mobile/employee/profile'),

  /** 프로필 정보 수정 */
  updateProfile: (data: UpdateProfileRequest) =>
    apiClient<ApiResponse<ProfileResponse>>('/api/mobile/employee/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** 프로필 아이콘 변경 */
  updateProfileIcon: (data: UpdateProfileIconRequest) =>
    apiClient<ApiResponse<ProfileResponse>>('/api/mobile/employee/profile/icon', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** 공통코드 옵션 조회 (직급/직책/계약분류) */
  getCodeOptions: () =>
    apiClient<ApiResponse<CodeOptions>>('/api/mobile/employee/profile/code-options'),
}

// ============================================================
// 사업장 API
// ============================================================

export const workplaceApi = {
  /** 내 사업장 목록 조회 */
  getWorkplaces: () =>
    apiClient<ApiResponse<WorkplaceResponse[]>>('/api/mobile/workplaces'),

  /** 사업장 추가 (등록 코드 입력) */
  addWorkplace: (data: AddWorkplaceRequest) =>
    apiClient<ApiResponse<WorkplaceResponse>>('/api/mobile/workplaces', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// ============================================================
// 급여 계좌 API
// ============================================================

export const salaryAccountApi = {
  /** 급여 계좌 목록 조회 */
  getAccounts: () =>
    apiClient<ApiResponse<SalaryAccountResponse[]>>('/api/mobile/salary-accounts'),

  /** 급여 계좌 추가 */
  createAccount: (data: CreateSalaryAccountRequest) =>
    apiClient<ApiResponse<SalaryAccountResponse>>('/api/mobile/salary-accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 급여 계좌 수정 */
  updateAccount: (id: number, data: UpdateSalaryAccountRequest) =>
    apiClient<ApiResponse<SalaryAccountResponse>>(`/api/mobile/salary-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** 급여 계좌 삭제 */
  deleteAccount: (id: number) =>
    apiClient<ApiResponse<null>>(`/api/mobile/salary-accounts/${id}`, {
      method: 'DELETE',
    }),

  /** 주 계좌 설정 */
  setPrimary: (id: number) =>
    apiClient<ApiResponse<SalaryAccountResponse>>(`/api/mobile/salary-accounts/${id}/primary`, {
      method: 'PUT',
    }),
}

// ============================================================
// 경력 API
// ============================================================

export const careerApi = {
  /** 경력 목록 조회 */
  getCareers: () =>
    apiClient<ApiResponse<CareerResponse[]>>('/api/mobile/employee/careers'),

  /** 경력 추가 */
  createCareer: (data: CreateCareerRequest) =>
    apiClient<ApiResponse<CareerResponse>>('/api/mobile/employee/careers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 경력 수정 */
  updateCareer: (id: number, data: Partial<CreateCareerRequest>) =>
    apiClient<ApiResponse<CareerResponse>>(`/api/mobile/employee/careers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** 경력 삭제 */
  deleteCareer: (id: number) =>
    apiClient<ApiResponse<null>>(`/api/mobile/employee/careers/${id}`, {
      method: 'DELETE',
    }),
}

// ============================================================
// 자격증 API
// ============================================================

export const certificateApi = {
  /** 자격증 목록 조회 */
  getCertificates: () =>
    apiClient<ApiResponse<CertificateResponse[]>>('/api/mobile/employee/certificates'),

  /** 자격증 추가 */
  createCertificate: (data: CreateCertificateRequest) =>
    apiClient<ApiResponse<CertificateResponse>>('/api/mobile/employee/certificates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 자격증 수정 */
  updateCertificate: (id: number, data: Partial<CreateCertificateRequest>) =>
    apiClient<ApiResponse<CertificateResponse>>(`/api/mobile/employee/certificates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** 자격증 삭제 */
  deleteCertificate: (id: number) =>
    apiClient<ApiResponse<null>>(`/api/mobile/employee/certificates/${id}`, {
      method: 'DELETE',
    }),
}

// ============================================================
// 서류 API
// ============================================================

export const documentApi = {
  /** 서류 목록 조회 (4종류 전체) */
  getDocuments: () =>
    apiClient<ApiResponse<DocumentResponse[]>>('/api/mobile/employee/documents'),

  /** 파일 업로드 → upload_files에 저장 후 ID 반환 */
  uploadFile: (file: File, category: string, referenceType: string, referenceId: number) => {
    const formData = new FormData()
    formData.append('file', file)
    const params = new URLSearchParams({ category, referenceType, referenceId: String(referenceId) })
    return apiUpload<ApiResponse<UploadFileResponse>>(`/api/v1/files/attachments?${params}`, formData)
  },

  /** 서류 등록 (업로드된 파일 ID를 member_documents에 연결) */
  createDocument: (type: string, fileId: number, expiryDate?: string) =>
    apiClient<ApiResponse<DocumentResponse>>(`/api/mobile/employee/documents/${type}`, {
      method: 'POST',
      body: JSON.stringify({ fileId, expiryDate }),
    }),

  /** 서류 삭제 */
  deleteDocument: (type: string) =>
    apiClient<ApiResponse<null>>(`/api/mobile/employee/documents/${type}`, {
      method: 'DELETE',
    }),
}

// ============================================================
// 출퇴근 API
// ============================================================

export const attendanceApi = {
  /** 오늘 출퇴근 현황 조회 */
  getToday: () =>
    apiClient<ApiResponse<AttendanceTodayResponse>>('/api/mobile/attendance/today'),

  /** 출근 체크 (QR) */
  checkIn: (data: AttendanceCheckRequest) =>
    apiClient<ApiResponse<AttendanceCheckResponse>>('/api/mobile/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 퇴근 체크 (QR) */
  checkOut: (data: AttendanceCheckRequest) =>
    apiClient<ApiResponse<AttendanceCheckResponse>>('/api/mobile/attendance/check-out', {
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
      `/api/mobile/attendance/history${qs ? `?${qs}` : ''}`,
    )
  },
}

// ============================================================
// 근로계약 API
// ============================================================

export const contractApi = {
  /** 계약 목록 조회 (대기 중) */
  getContracts: () =>
    apiClient<ApiResponse<ContractListResponse[]>>('/api/mobile/contracts'),

  /** 계약 상세 조회 */
  getContractDetail: (id: number) =>
    apiClient<ApiResponse<ContractDetailResponse>>(`/api/mobile/contracts/${id}`),

  /** 계약 서명 */
  signContract: (id: number, data: ContractSignRequest) =>
    apiClient<ApiResponse<null>>(`/api/mobile/contracts/${id}/sign`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 계약 거부 */
  rejectContract: (id: number, data?: ContractRejectRequest) =>
    apiClient<ApiResponse<null>>(`/api/mobile/contracts/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(data ?? {}),
    }),

  /** 계약 히스토리 조회 (완료/거부된 계약) */
  getContractHistory: () =>
    apiClient<ApiResponse<ContractListResponse[]>>('/api/mobile/contracts/history'),
}

// ============================================================
// 급여명세 API
// ============================================================

export const payrollApi = {
  /** 급여명세 목록 조회 */
  getPayrolls: (params?: { workplaceId?: number }) => {
    const query = new URLSearchParams()
    if (params?.workplaceId != null) query.append('workplaceId', String(params.workplaceId))
    const qs = query.toString()
    return apiClient<ApiResponse<PayrollListResponse[]>>(
      `/api/mobile/payrolls${qs ? `?${qs}` : ''}`,
    )
  },

  /** 급여명세 상세 조회 */
  getPayrollDetail: (id: number) =>
    apiClient<ApiResponse<PayrollDetailResponse>>(`/api/mobile/payrolls/${id}`),
}

// ============================================================
// 홈 API
// ============================================================

export const homeApi = {
  /** 월별 캘린더 데이터 조회 */
  getCalendar: (yearMonth: string) =>
    apiClient<ApiResponse<CalendarResponse>>(
      `/api/mobile/home/calendar?yearMonth=${encodeURIComponent(yearMonth)}`,
    ),

  /** 일별 요약 데이터 조회 */
  getDailySummary: (date: string) =>
    apiClient<ApiResponse<DailySummaryResponse>>(
      `/api/mobile/home/daily-summary?date=${encodeURIComponent(date)}`,
    ),
}

