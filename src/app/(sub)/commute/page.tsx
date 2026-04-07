import CommuteContents from '@/components/commute/CommuteContents'

interface Props {
  searchParams: Promise<{ store?: string }>
}

export default async function CommutePage({ searchParams }: Props) {
  const { store } = await searchParams
  return <CommuteContents storeName={store ?? null} />
}
