import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { careerApi } from '@/lib/api-endpoints'
import type { CreateCareerRequest } from '@/types/api'

export const useCareerList = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.career.lists(),
    queryFn: () => careerApi.getCareers(),
    enabled,
  })

export const useCreateCareer = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCareerRequest) => careerApi.createCareer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.career.lists() })
    },
  })
}

export const useUpdateCareer = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateCareerRequest> }) =>
      careerApi.updateCareer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.career.lists() })
    },
  })
}

export const useDeleteCareer = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => careerApi.deleteCareer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.career.lists() })
    },
  })
}
