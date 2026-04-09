import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { documentApi } from '@/lib/api-endpoints'

export const useDocumentList = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.document.lists(),
    queryFn: () => documentApi.getDocuments(),
    enabled,
  })

export const useUploadFile = () =>
  useMutation({
    mutationFn: ({
      file,
      category,
      referenceType,
      referenceId,
    }: {
      file: File
      category: string
      referenceType: string
      referenceId: number
    }) => documentApi.uploadFile(file, category, referenceType, referenceId),
  })

export const useCreateDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      type,
      fileId,
      expiryDate,
    }: {
      type: string
      fileId: number
      expiryDate?: string
    }) => documentApi.createDocument(type, fileId, expiryDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.document.lists() })
    },
  })
}

export const useDeleteDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (type: string) => documentApi.deleteDocument(type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.document.lists() })
    },
  })
}
