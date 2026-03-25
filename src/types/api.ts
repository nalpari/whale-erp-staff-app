// ============================================================
// 공통 응답 타입
// ============================================================

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
}

// ============================================================
// 인증 (Auth)
// ============================================================

export interface LoginRequest {
  loginId: string
  password: string
}

export interface LoginResponse {
  memberId: number
  accessToken: string
  refreshToken: string
  name: string
  loginId: string
  passwordChangeRequired: boolean
  tokenType: string
  expiresIn: number
  rank: string | null
  position: string | null
}

export interface FindIdRequest {
  name: string
  email: string
}

export interface FindIdResponse {
  loginId: string
  memberName: string
}

export interface FindPasswordRequest {
  name: string
  loginId: string
  email: string
}

export interface FindPasswordResponse {
  message: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface CheckAvailabilityResponse {
  available: boolean
  message: string
}

export interface SignupRequest {
  loginId: string
  password: string
  passwordConfirm: string
  name: string
  phone?: string
  email?: string
  zipCode?: string
  address?: string
  addressDetail?: string
  inviteCode?: string
  bankName?: string
  accountNumber?: string
  accountHolder?: string
}

export interface SignupResponse {
  memberId: number
  loginId: string
  name: string
  message: string
}

// ============================================================
// 프로필 (Profile)
// ============================================================

export interface ProfileResponse {
  id: number
  name: string
  loginId: string
  email: string | null
  birthDate: string | null
  mobilePhone: string | null
  zipCode: string | null
  address: string | null
  addressDetail: string | null
  residentRegistrationNumber: string | null
  profileIconId: number | null
}

export interface UpdateProfileRequest {
  email?: string
  zipCode?: string
  address?: string
  addressDetail?: string
}

export interface UpdateProfileIconRequest {
  profileIconId: number
}

export interface CodeOption {
  code: string
  name: string
}

export interface CodeOptions {
  contractClassifications: CodeOption[]
}

// ============================================================
// 사업장 (Workplace)
// ============================================================

export interface WorkplaceResponse {
  id: number
  workplaceName: string
  workplaceColor: string
  contractStatus: string
}

export interface AddWorkplaceRequest {
  registrationCode: string
}

// ============================================================
// 급여 계좌 (Salary Account)
// ============================================================

export interface SalaryAccountResponse {
  id: number
  bankName: string
  maskedAccountNumber: string
  maskedAccountHolder: string
  isPrimary: boolean
  memo?: string
}

export interface CreateSalaryAccountRequest {
  bankName: string
  accountNumber: string
  accountHolder: string
  memo?: string
  isPrimary?: boolean
}

export interface UpdateSalaryAccountRequest {
  bankName?: string
  accountNumber?: string
  accountHolder?: string
  memo?: string
}

// ============================================================
// 경력 (Career)
// ============================================================

export interface CareerResponse {
  id: number
  companyName: string
  startDate: string
  endDate: string | null
  contractClassification: string | null
  contractClassificationName: string | null
  rank: string | null
  position: string | null
  jobDescription: string | null
  resignationReason: string | null
}

export interface CreateCareerRequest {
  companyName: string
  startDate: string
  endDate?: string
  contractClassification?: string
  rank?: string
  position?: string
  jobDescription?: string
  resignationReason?: string
}

// ============================================================
// 자격증 (Certificate)
// ============================================================

export interface CertificateResponse {
  id: number
  certificateName: string
  acquisitionDate: string
  issuingOrganization: string | null
  validityStartDate: string | null
  validityEndDate: string | null
  certificateFileId: number | null
  certificateFileName: string | null
}

export interface CreateCertificateRequest {
  certificateName: string
  acquisitionDate: string
  issuingOrganization?: string
  validityStartDate?: string
  validityEndDate?: string
  certificateFileId?: number
}

// ============================================================
// 서류 (Document)
// ============================================================

export interface DocumentResponse {
  id: number | null
  type: string              // RESIDENT_REGISTRATION, FAMILY_RELATION, HEALTH_CHECK, RESUME
  fileName: string | null
  fileId: number | null     // upload_files ID
  expiryDate: string | null
}

// 파일 업로드 응답 (upload_files)
export interface UploadFileResponse {
  id: number
  originalFileName: string
  storedFileName: string
  fileSize: number
  fileType: string
}

// ============================================================
// 출퇴근 (Attendance)
// ============================================================

export interface AttendanceTodayResponse {
  date: string
  workplaces: WorkplaceAttendance[]
}

export interface WorkplaceAttendance {
  workplaceId: number
  workplaceName: string
  workplaceColor: string
  scheduledStart?: string
  scheduledEnd?: string
  clockIn?: string
  clockOut?: string
  status: string
}

export interface AttendanceCheckRequest {
  qrData: string
  workplaceId: number
}

export interface AttendanceCheckResponse {
  checkTime: string
  type: 'CHECK_IN' | 'CHECK_OUT'
}

export interface AttendanceHistoryItem {
  date: string
  dayOfWeek: string
  workplaceName: string
  workplaceColor: string
  clockIn?: string
  clockOut?: string
  status: string
}

// ============================================================
// 근로계약 (Contract)
// ============================================================

export interface ContractListResponse {
  id: number
  storeName: string
  status: string
  receivedDate: string
  completedDate?: string
}

export interface ContractDetailResponse {
  id: number
  status: string
  storeName: string
  companyInfo: {
    companyName: string
    representative: string
    address: string
    businessNumber: string
  }
  employeeInfo: {
    name: string
    birthDate: string
    address: string
    phone: string
  }
  contractInfo: {
    contractType: string
    startDate: string
    endDate?: string
    position: string
  }
  workHourInfo: {
    workDays: string
    startTime: string
    endTime: string
    breakTime: string
  }
  salaryInfo: {
    salaryType: string
    amount: number
    paymentDate: string
    items?: { name: string; amount: number }[]
  }
}

export interface ContractSignRequest {
  signatureData: string
}

export interface ContractRejectRequest {
  reason?: string
}

// ============================================================
// 급여명세 (Payroll)
// ============================================================

export interface PayrollListResponse {
  id: number
  yearMonth: string
  storeName: string
  paymentDate: string
  totalAmount: number
  contractType: string
}

export interface PayrollDetailResponse {
  id: number
  yearMonth: string
  storeName: string
  employeeName: string
  paymentDate: string
  items: { name: string; amount: number; type: string }[]
  totalPayment: number
  totalDeduction: number
  netAmount: number
}

// ============================================================
// 홈 (Home)
// ============================================================

export interface CalendarResponse {
  yearMonth: string
  days: CalendarDay[]
}

export interface CalendarDay {
  date: string
  markers: { workplaceId: number; workplaceColor: string; type: string }[]
}

export interface DailySummaryResponse {
  date: string
  dayOfWeek: string
  workCount: number
  workplaces: WorkplaceDailySummary[]
}

export interface WorkplaceDailySummary {
  workplaceId: number
  workplaceName: string
  workplaceColor: string
  scheduledStart?: string
  scheduledEnd?: string
  clockIn?: string
  clockOut?: string
}
