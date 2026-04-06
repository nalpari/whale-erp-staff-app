import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { salaryAccountApi } from '@/lib/api-endpoints'
import type {
  CreateSalaryAccountRequest,
  UpdateSalaryAccountRequest,
} from '@/types/api'

export const useAccountList = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.account.lists(),
    queryFn: () => salaryAccountApi.getAccounts(),
    enabled,
  })

export const useAccountDetail = (id: number | null, enabled = true) =>
  useQuery({
    queryKey: queryKeys.account.detail(id ?? 0),
    queryFn: () => salaryAccountApi.getAccountDetail(id as number),
    enabled: enabled && !!id,
  })

export const useCreateAccount = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSalaryAccountRequest) => salaryAccountApi.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.account.lists() })
    },
  })
}

export const useUpdateAccount = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSalaryAccountRequest }) =>
      salaryAccountApi.updateAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.account.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.account.details() })
    },
  })
}

export const useDeleteAccount = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => salaryAccountApi.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.account.lists() })
    },
  })
}

export const useSetPrimaryAccount = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => salaryAccountApi.setPrimary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.account.lists() })
    },
  })
}
