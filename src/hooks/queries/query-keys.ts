export const queryKeys = {
  all: ['staff'] as const,

  payroll: {
    all: () => [...queryKeys.all, 'payroll'] as const,
    lists: () => [...queryKeys.payroll.all(), 'list'] as const,
    list: (params?: { page?: number; size?: number }) =>
      [...queryKeys.payroll.lists(), params] as const,
    details: () => [...queryKeys.payroll.all(), 'detail'] as const,
    detail: (id: number) => [...queryKeys.payroll.details(), id] as const,
  },

  workplace: {
    all: () => [...queryKeys.all, 'workplace'] as const,
    lists: () => [...queryKeys.workplace.all(), 'list'] as const,
    details: () => [...queryKeys.workplace.all(), 'detail'] as const,
    detail: (id: number) => [...queryKeys.workplace.details(), id] as const,
  },

  contract: {
    all: () => [...queryKeys.all, 'contract'] as const,
    lists: () => [...queryKeys.contract.all(), 'list'] as const,
    details: () => [...queryKeys.contract.all(), 'detail'] as const,
    detail: (id: number) => [...queryKeys.contract.details(), id] as const,
    snapshots: () => [...queryKeys.contract.all(), 'snapshot'] as const,
    snapshot: (id: number) => [...queryKeys.contract.snapshots(), id] as const,
    history: () => [...queryKeys.contract.all(), 'history'] as const,
  },

  attendance: {
    all: () => [...queryKeys.all, 'attendance'] as const,
    today: () => [...queryKeys.attendance.all(), 'today'] as const,
    histories: () => [...queryKeys.attendance.all(), 'history'] as const,
    history: (params: { from: string; to: string }) =>
      [...queryKeys.attendance.histories(), params] as const,
  },

  profile: {
    all: () => [...queryKeys.all, 'profile'] as const,
    me: () => [...queryKeys.profile.all(), 'me'] as const,
    codeOptions: () => [...queryKeys.profile.all(), 'code-options'] as const,
  },

  account: {
    all: () => [...queryKeys.all, 'account'] as const,
    lists: () => [...queryKeys.account.all(), 'list'] as const,
    details: () => [...queryKeys.account.all(), 'detail'] as const,
    detail: (id: number) => [...queryKeys.account.details(), id] as const,
  },

  career: {
    all: () => [...queryKeys.all, 'career'] as const,
    lists: () => [...queryKeys.career.all(), 'list'] as const,
  },

  certificate: {
    all: () => [...queryKeys.all, 'certificate'] as const,
    lists: () => [...queryKeys.certificate.all(), 'list'] as const,
  },

  document: {
    all: () => [...queryKeys.all, 'document'] as const,
    lists: () => [...queryKeys.document.all(), 'list'] as const,
  },

  home: {
    all: () => [...queryKeys.all, 'home'] as const,
    calendar: (yearMonth: string) => [...queryKeys.home.all(), 'calendar', yearMonth] as const,
    dailySummary: (date: string) => [...queryKeys.home.all(), 'daily-summary', date] as const,
  },

  schedule: {
    all: () => [...queryKeys.all, 'schedule'] as const,
    byOrg: (memberId: number, from: string, to: string) =>
      [...queryKeys.schedule.all(), 'by-org', memberId, from, to] as const,
  },

  todo: {
    all: () => [...queryKeys.all, 'todo'] as const,
    homeCalendar: (year: string, month: string) =>
      [...queryKeys.todo.all(), 'homeCalendar', year, month] as const,
    calendars: () => [...queryKeys.todo.all(), 'calendar'] as const,
    calendar: (year: number, month: number, employeeInfoId?: number | null) =>
      [...queryKeys.todo.calendars(), year, month, employeeInfoId ?? null] as const,
  },
} as const
