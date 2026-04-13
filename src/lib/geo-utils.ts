// ============================================================
// 위치·거리 유틸리티
// ============================================================

// 거리 계산 공식은 프로젝트 공용 유틸 사용 (중복 방지)
export { getDistanceFromLatLng, formatDistance } from '@/utils/distance'

/**
 * 브라우저 Geolocation API로 현재 위치를 반환합니다.
 * 권한 거부·미지원 시 null 반환 (에러 미전파).
 */
export function getCurrentPosition(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve(null)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 },
    )
  })
}

/** 주소 → 좌표 변환 결과 캐시 (사업장 주소는 거의 바뀌지 않으므로 세션 내 재사용) */
const geocodeCache = new Map<string, { lat: number; lng: number }>()

/**
 * 주소를 좌표로 변환합니다.
 * 서버 Route Handler(/api/geocode)를 통해 Kakao API를 호출하므로 키가 브라우저에 노출되지 않습니다.
 * 동일 주소는 캐시에서 반환합니다.
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const cached = geocodeCache.get(address)
  if (cached) return cached

  try {
    const res = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`)
    if (!res.ok) return null

    const data = (await res.json()) as { lat: number; lng: number } | null
    if (!data) return null

    geocodeCache.set(address, data)
    return data
  } catch {
    return null
  }
}
