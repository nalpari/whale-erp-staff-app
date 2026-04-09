import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { certificateApi } from '@/lib/api-endpoints'
import type { CreateCertificateRequest } from '@/types/api'

export const useCertificateList = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.certificate.lists(),
    queryFn: () => certificateApi.getCertificates(),
    enabled,
  })

export const useCreateCertificate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCertificateRequest) => certificateApi.createCertificate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certificate.lists() })
    },
  })
}

export const useUpdateCertificate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateCertificateRequest> }) =>
      certificateApi.updateCertificate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certificate.lists() })
    },
  })
}

export const useDeleteCertificate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => certificateApi.deleteCertificate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certificate.lists() })
    },
  })
}
