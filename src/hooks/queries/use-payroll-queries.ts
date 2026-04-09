import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { payrollApi } from '@/lib/api-endpoints'

export const usePayrollList = (params?: { page?: number; size?: number }, enabled = true) =>
  useQuery({
    queryKey: queryKeys.payroll.list(params),
    queryFn: () => payrollApi.getPayrolls(params),
    enabled,
  })

export const useInfinitePayrollList = (size = 20) =>
  useInfiniteQuery({
    queryKey: queryKeys.payroll.list({ size }),
    queryFn: ({ pageParam }) =>
      payrollApi.getPayrolls({ page: pageParam as number, size }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const data = lastPage.data
      if (!data || (lastPageParam as number) >= data.totalPages - 1) return undefined
      return (lastPageParam as number) + 1
    },
  })

export const usePayrollDetail = (id: number | null, enabled = true) =>
  useQuery({
    queryKey: queryKeys.payroll.detail(id ?? 0),
    queryFn: () => payrollApi.getPayrollDetail(id as number),
    enabled: enabled && !!id,
  })

export const useDownloadPayrollExcel = () =>
  useMutation({
    mutationFn: (id: number) => payrollApi.downloadPayrollExcel(id),
  })
