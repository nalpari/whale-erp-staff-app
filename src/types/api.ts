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
  newPasswordConfirm: string
}

export interface CheckAvailabilityResponse {
  available: boolean
  message: string
  email?: string
  employeeName?: string
  mobilePhone?: string
  zipCode?: string
  address?: string
  addressDetail?: string
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
  bankCode?: string
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
  storeId: number | null
  storeName: string | null
  workplaceType: string
  workStatus: string | null
  workStatusName: string | null
  colorIndex: number
  rank: string | null
  position: string | null
}

export interface AddWorkplaceRequest {
  registrationCode: string
}

export interface ValidateEmployeeRequest {
  employeeNumber: string
}

export interface ValidateEmployeeResponse {
  valid: boolean
  employeeName?: string
  workplaceName?: string
  /** validate 성공 시 서버가 발급하는 단기 연결 토큰 (IDOR 방지) */
  linkToken?: string
}

export interface LinkEmployeeRequest {
  employeeNumber: string
  /** validate 단계에서 발급된 서버 토큰 (재검증용) */
  linkToken?: string
}

export interface LinkEmployeeResponse {
  memberId: number
  employeeNumber: string
}

export interface WorkplaceDetailResponse {
  id: number
  workplace: {
    name: string
    address: string | null
    representativeName: string | null
    storePhone: string | null
  }
  employee: {
    name: string
    employeeNumber: string
    contractClassification: string | null
    rank: string | null
    position: string | null
    workStatusName: string | null
    hireDate: string | null
    resignationDate: string | null
  }
  salaryAccount: {
    bankName: string | null
    accountNumber: string | null
    accountHolder: string | null
  } | null
}

// ============================================================
// 급여 계좌 (Salary Account)
// ============================================================

export interface SalaryAccountResponse {
  id: number
  bankCode: string | null
  bankName: string
  accountNumber: string
  accountHolder: string
  memo: string | null
  sortOrder: number
  isPrimary: boolean
}

export interface CreateSalaryAccountRequest {
  bankCode?: string
  bankName: string
  accountNumber: string
  accountHolder: string
  memo?: string
  isPrimary?: boolean
}

export interface UpdateSalaryAccountRequest {
  bankCode?: string
  bankName?: string
  accountNumber?: string
  accountHolder?: string
  memo?: string
  isPrimary?: boolean
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
  workplaceName: string
  scheduleStartTime: string | null
  scheduleEndTime: string | null
  checkInTime: string | null
  checkOutTime: string | null
  workDuration: number | null
  colorIndex: number
}

export interface AttendanceCheckRequest {
  workplaceId: number
  storeId?: number | null
  /** QR 스캔으로 획득한 일회용 토큰 (서버측 검증용) */
  qrData?: string | null
}

export interface AttendanceCheckResponse {
  checkTime: string
  type: 'CHECK_IN' | 'CHECK_OUT'
}

export interface AttendanceHistoryItem {
  date: string          // "YYYY-MM-DD"
  dayOfWeek: string
  workplaceName: string
  checkInTime: string | null   // "HH:mm"
  checkOutTime: string | null  // "HH:mm"
  workDuration: number | null
  status: string
}

export interface AttendanceHistoryResponse {
  items: AttendanceHistoryItem[]
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

export interface ContractHistoryItem {
  contractId: number
  status: string
  storeName: string | null
  contractClassification: string | null
  contractStartDate: string | null
  contractEndDate: string | null
  signedDocumentFileId: number | null
  contractSendDate: string | null
  contractViewDate: string | null
  signedDate: string | null
  signerName: string | null
  rejectedDate: string | null
}

export interface ContractHistoryResponse {
  items: ContractHistoryItem[]
}

export interface ContractDetailResponse {
  id: number
  status: string
  signedDocumentFileId: number | null
  company: {
    companyName: string | null
    storeName: string | null
    businessRegistrationNumber: string | null
    companyAddress: string | null
    representativeName: string | null
    representativePhone: string | null
  }
  employee: {
    employeeName: string
    employeeNumber: string
    rank: string | null
    position: string | null
    employeeSsn: string | null
    employeeAddress: string | null
  }
  contract: {
    contractClassificationCode: string
    contractClassification: string
    contractStartDate: string
    contractEndDate: string
    jobDescription: string | null
    salaryDay: number
    nationalPensionEnrolled: boolean | null
    healthInsuranceEnrolled: boolean | null
    employmentInsuranceEnrolled: boolean | null
    workersCompensationEnrolled: boolean | null
  }
  workHours: {
    dayType: string
    isWork: boolean
    everySaturdayWork: boolean | null
    everySundayWork: boolean | null
    workStartTime: string | null
    workEndTime: string | null
    breakStartTime: string | null
    breakEndTime: string | null
  }[]
  salary: {
    annualAmount: number
    monthlyTotalAmount: number
    timelyAmount: number
    monthlyTime: number
    monthlyBaseAmount: number
    monthlyOvertimeAllowanceTime: number | null
    monthlyOvertimeAllowanceAmount: number | null
    monthlyNightAllowanceTime: number | null
    monthlyNightAllowanceAmount: number | null
    monthlyHolidayAllowanceTime: number | null
    monthlyHolidayAllowanceAmount: number | null
    monthlyAddHolidayAllowanceTime: number | null
    monthlyAddHolidayAllowanceAmount: number | null
    mealAllowanceAmount: number | null
    vehicleAllowanceAmount: number | null
    childcareAllowanceAmount: number | null
    // 파트타이머 시급 필드
    weekDayAllowanceAmount: number | null
    overtimeDayAllowanceAmount: number | null
    nightDayAllowanceAmount: number | null
    holidayAllowanceTimeAmount: number | null
    bonuses: { bonusType: string; amount: number; memo: string | null }[]
  } | null
  terms: {
    workPlace: string | null
    holidayDefault: string
    holidayAdditional: string | null
    annualLeaveDefault: string
    annualLeaveAdditional: string | null
    resignationDefault: string | null
    resignationAdditional: string | null
    severancePayDefault: string | null
    severancePayAdditional: string | null
    otherItems: string[]
    otherItem1: string
    otherItem2: string
  } | null
  salaryAccount: {
    bankName: string
    accountNumber: string
    accountHolder: string
  } | null
}

export interface ContractSignRequest {
  signatureData: string
  salaryAccountId?: number
}

export interface ContractRejectRequest {
  reason?: string
}

export interface ContractSnapshotData {
  company: {
    companyName: string | null
    storeName: string | null
    businessRegistrationNumber: string | null
    companyAddress: string | null
    representativeName: string | null
    representativePhone: string | null
  }
  employee: {
    employeeName: string
    employeeNumber: string
    rank: string | null
    position: string | null
    employeeSsn: string | null
    employeeAddress: string | null
  }
  contract: {
    contractClassificationCode: string
    contractClassification: string
    contractStartDate: string
    contractEndDate: string
    jobDescription: string | null
    salaryDay: number
    nationalPensionEnrolled: boolean | null
    healthInsuranceEnrolled: boolean | null
    employmentInsuranceEnrolled: boolean | null
    workersCompensationEnrolled: boolean | null
  }
  salary: {
    annualAmount: number
    monthlyTotalAmount: number
    timelyAmount: number
    monthlyTime: number
    monthlyBaseAmount: number
    monthlyOvertimeAllowanceTime: number | null
    monthlyOvertimeAllowanceAmount: number | null
    monthlyNightAllowanceTime: number | null
    monthlyNightAllowanceAmount: number | null
    monthlyHolidayAllowanceTime: number | null
    monthlyHolidayAllowanceAmount: number | null
    monthlyAddHolidayAllowanceTime: number | null
    monthlyAddHolidayAllowanceAmount: number | null
    mealAllowanceAmount: number | null
    vehicleAllowanceAmount: number | null
    childcareAllowanceAmount: number | null
    weekDayAllowanceAmount: number | null
    overtimeDayAllowanceAmount: number | null
    nightDayAllowanceAmount: number | null
    holidayAllowanceTimeAmount: number | null
    bonuses: { bonusType: string; amount: number; memo: string | null }[]
  } | null
  workHours: {
    dayType: string
    isWork: boolean
    everySaturdayWork: boolean | null
    everySundayWork: boolean | null
    workStartTime: string | null
    workEndTime: string | null
    breakStartTime: string | null
    breakEndTime: string | null
  }[]
  salaryAccount: {
    bankCode: string | null
    bankName: string
    accountNumber: string
    accountHolder: string
  } | null
  terms: {
    workPlace: string | null
    holidayDefault: string | null
    holidayAdditional: string | null
    annualLeaveDefault: string
    annualLeaveAdditional: string | null
    resignationDefault: string | null
    resignationAdditional: string | null
    severancePayDefault: string | null
    severancePayAdditional: string | null
    otherItems: string[]
    otherItem1: string
    otherItem2: string
  } | null
  signedDate: string | null
  rejectedDate: string | null
}

// ============================================================
// 급여명세 (Payroll)
// ============================================================

export interface PayrollListResponse {
  id: number
  payrollType: string
  payrollMonth: string
  paymentDate: string
  settlementPeriod: string
  workplaceName: string
}

// 급여 항목 (지급/공제 공통)
export interface PayrollItemResponse {
  name: string
  amount: number
}

// 정직원 급여명세서 상세
export interface FullTimePayrollDetailResponse {
  payrollMonth: string
  workplaceName: string
  employeeName: string
  paymentDate: string
  settlementPeriod: string
  payrollFileUrl: string | null
  actualPayment: number
  totalPayment: number
  totalDeduction: number
  paymentItems: PayrollItemResponse[]
  deductionItems: PayrollItemResponse[]
}

// 파트타이머 - 일별 근무 기록
export interface DailyRecord {
  date: string
  dayOfWeek: string
  workHours: number
  hourlyRate: number
  dailyPay: number
  tax: number
}

// 파트타이머 - 주간 요약
export interface WeeklySummary {
  hours: number
  pay: number
  tax: number
}

// 파트타이머 - 주휴수당
export interface WeeklyPaidHolidayAllowanceResponse {
  hours: number
  hourlyRate: number
  amount: number
  tax: number
}

// 파트타이머 - 주별 상세
export interface WeekDetail {
  weekNumber: number
  dailyRecords: DailyRecord[]
  weeklySubtotal: WeeklySummary
  weeklyPaidHolidayAllowance: WeeklyPaidHolidayAllowanceResponse | null
  weeklyTotal: WeeklySummary
}

// 파트타이머 - 급여 소계
export interface PayrollSubtotal {
  hours: number
  totalPay: number
  totalTax: number
}

// 파트타이머 - 상여금 항목
export interface BonusItemResponse {
  name: string
  amount: number
  tax: number
  netAmount: number
}

// 파트타이머 - 총 합계
export interface GrandTotal {
  totalPayment: number
  totalDeduction: number
  actualPayment: number
}

// 파트타이머 급여명세서 상세
export interface PartTimePayrollDetailResponse {
  payrollMonth: string
  workplaceName: string
  employeeName: string
  paymentDate: string
  settlementPeriod: string
  weeklyDetails: WeekDetail[]
  payrollSubtotal: PayrollSubtotal
  deductions: PayrollItemResponse[]
  bonuses: BonusItemResponse[]
  grandTotal: GrandTotal
}

export type PayrollDetailResponse = FullTimePayrollDetailResponse | PartTimePayrollDetailResponse

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

// ============================================================
// 근무 스케줄 (by-org)
// ============================================================

export interface ScheduleDailyResponse {
  date: string          // "YYYY-MM-DD"
  dayOfWeek: string
  hasWork: boolean
  startTime: string | null   // "HH:mm:ss"
  endTime: string | null
  hasBreak: boolean
  breakStartTime: string | null
  breakEndTime: string | null
  workHours: number | null
  source: 'CONTRACT' | 'SCHEDULE'
  isDeleted: boolean
  scheduleId: number | null
  shiftId: number | null
}

export interface ScheduleGroupResponse {
  workPlace: 'HEAD_OFFICE' | 'FRANCHISE' | 'STORE'
  headOfficeId: number
  headOfficeName: string
  franchiseId: number | null
  franchiseName: string | null
  storeId: number | null
  storeName: string | null
  schedules: ScheduleDailyResponse[]
}

// ============================================================
// 직원 TODO (Employee Todos)
// ============================================================

export interface EmployeeTodoItem {
  id: number
  content: string
  todoDate: string          // "YYYY-MM-DD" 또는 "YYYY-MM-DD ~ YYYY-MM-DD"
  isCompleted: boolean
}

export interface EmployeeTodoOrganization {
  headOfficeId: number
  headOfficeName: string
  franchiseId: number
  franchiseName: string
  storeId: number
  storeName: string
  todos: EmployeeTodoItem[]
}

export interface EmployeeTodoCalendarDay {
  day: number               // 해당 월의 일(day)
  totalCount: number
  completedCount: number
  incompleteCount: number
  organizations: EmployeeTodoOrganization[]
}

export type EmployeeTodoCalendarResponse = EmployeeTodoCalendarDay[]
