import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { workplaceApi } from '@/lib/api-endpoints'

export const useWorkplaceList = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.workplace.lists(),
    queryFn: () => workplaceApi.getWorkplaces(),
    enabled,
  })

export const useWorkplaceDetail = (id: number | null, enabled = true) =>
  useQuery({
    queryKey: queryKeys.workplace.detail(id ?? 0),
    queryFn: () => workplaceApi.getWorkplaceDetail(id as number),
    enabled: enabled && !!id,
  })

export const useAddWorkplace = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: workplaceApi.addWorkplace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workplace.lists() })
    },
  })
}

export const useValidateEmployee = () =>
  useMutation({
    mutationFn: workplaceApi.validateEmployeeNumber,
  })

export const useLinkEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: workplaceApi.linkEmployeeByNumber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workplace.lists() })
    },
  })
}

export const useChangeSalaryAccount = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      workplaceId,
      salaryAccountId,
    }: {
      workplaceId: number
      salaryAccountId: number
    }) => workplaceApi.changeSalaryAccount(workplaceId, salaryAccountId),
    onSuccess: (_, { workplaceId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workplace.detail(workplaceId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.workplace.lists() })
    },
  })
}
