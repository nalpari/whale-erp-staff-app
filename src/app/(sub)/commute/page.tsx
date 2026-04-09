import CommuteContents from '@/components/commute/CommuteContents'

interface Props {
  searchParams: Promise<{ storeId?: string }>
}

export default async function CommutePage({ searchParams }: Props) {
  const { storeId } = await searchParams
  const parsedStoreId = storeId ? Number(storeId) : null
  return <CommuteContents storeId={!isNaN(parsedStoreId as number) ? parsedStoreId : null} />
}
