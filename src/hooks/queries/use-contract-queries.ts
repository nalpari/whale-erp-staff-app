import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { contractApi } from '@/lib/api-endpoints'
import type { ContractSignRequest, ContractRejectRequest } from '@/types/api'

export const useContractList = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.contract.lists(),
    queryFn: () => contractApi.getContracts(),
    enabled,
  })

export const useContractDetail = (id: number | null, enabled = true) =>
  useQuery({
    queryKey: queryKeys.contract.detail(id ?? 0),
    queryFn: () => contractApi.getContractDetail(id as number),
    enabled: enabled && !!id,
  })

export const useContractSnapshot = (id: number | null, enabled = true) =>
  useQuery({
    queryKey: queryKeys.contract.snapshot(id ?? 0),
    queryFn: () => contractApi.getContractSnapshot(id as number),
    enabled: enabled && !!id,
  })

export const useContractHistory = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.contract.history(),
    queryFn: () => contractApi.getContractHistory(),
    enabled,
  })

export const useSignContract = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ContractSignRequest }) =>
      contractApi.signContract(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contract.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.contract.history() })
    },
  })
}

export const useRejectContract = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: ContractRejectRequest }) =>
      contractApi.rejectContract(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contract.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.contract.history() })
    },
  })
}

export const useDownloadContractDocx = () =>
  useMutation({
    mutationFn: (id: number) => contractApi.downloadContractDocx(id),
  })
