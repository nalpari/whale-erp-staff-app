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

/**
 * Kakao Local REST API로 주소를 좌표로 변환합니다.
 * 실패·API키 미설정 시 null 반환 (에러 미전파).
 * 환경변수: NEXT_PUBLIC_KAKAO_REST_KEY
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_REST_KEY
  if (!apiKey) return null

  try {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
      { headers: { Authorization: `KakaoAK ${apiKey}` } },
    )
    if (!res.ok) return null

    const data = (await res.json()) as { documents: { y: string; x: string }[] }
    if (!data.documents?.length) return null

    const { y, x } = data.documents[0]
    return { lat: parseFloat(y), lng: parseFloat(x) }
  } catch {
    return null
  }
}
