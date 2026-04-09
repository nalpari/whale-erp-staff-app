import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { profileApi } from '@/lib/api-endpoints'
import type { UpdateProfileRequest, UpdateProfileIconRequest } from '@/types/api'

export const useProfile = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: () => profileApi.getProfile(),
    enabled,
  })

export const useCodeOptions = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.profile.codeOptions(),
    queryFn: () => profileApi.getCodeOptions(),
    enabled,
  })

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() })
    },
  })
}

export const useUpdateProfileIcon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateProfileIconRequest) => profileApi.updateProfileIcon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() })
    },
  })
}
