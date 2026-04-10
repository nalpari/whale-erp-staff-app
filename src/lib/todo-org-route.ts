import type { OrgGroup } from '@/types/todo'

type SearchParamsLike = {
  get: (name: string) => string | null
}

export interface TodoOrgRouteFilter {
  headOfficeId: number
  franchiseId: number | null
  storeId: number | null
}

type TodoOrgIdentity = Pick<OrgGroup, 'headOfficeId' | 'franchiseId' | 'storeId'>

function parseNullableNumber(value: string | null): number | null | undefined {
  if (value === null) return undefined
  if (value === 'null') return null

  const parsed = Number(value)
  if (!Number.isInteger(parsed)) return undefined
  return parsed
}

export function buildTodoOrgSearchParams(
  date: string,
  org: Pick<OrgGroup, 'headOfficeId' | 'franchiseId' | 'storeId'>,
): URLSearchParams {
  const params = new URLSearchParams({ date })
  params.set('headOfficeId', String(org.headOfficeId))
  params.set('franchiseId', org.franchiseId === null ? 'null' : String(org.franchiseId))
  params.set('storeId', org.storeId === null ? 'null' : String(org.storeId))
  return params
}

export function parseTodoOrgRouteFilter(searchParams: SearchParamsLike): TodoOrgRouteFilter | null {
  const headOfficeId = parseNullableNumber(searchParams.get('headOfficeId'))
  const franchiseId = parseNullableNumber(searchParams.get('franchiseId'))
  const storeId = parseNullableNumber(searchParams.get('storeId'))

  if (headOfficeId === undefined && franchiseId === undefined && storeId === undefined) {
    return null
  }

  if (
    headOfficeId === undefined ||
    headOfficeId === null ||
    franchiseId === undefined ||
    storeId === undefined
  ) {
    return null
  }

  return {
    headOfficeId,
    franchiseId,
    storeId,
  }
}

export function matchesTodoOrgRouteFilter(
  org: TodoOrgIdentity,
  filter: TodoOrgRouteFilter | null,
): boolean {
  if (filter === null) return true

  return isSameTodoOrgIdentity(org, filter)
}

export function isSameTodoOrgIdentity(
  left: TodoOrgIdentity,
  right: TodoOrgIdentity,
): boolean {
  return (
    left.headOfficeId === right.headOfficeId &&
    left.franchiseId === right.franchiseId &&
    left.storeId === right.storeId
  )
}
