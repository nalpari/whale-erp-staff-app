'use client'

import { useState, useEffect } from 'react'
import { getDistanceFromLatLng, formatDistance } from '@/utils/distance'

interface Coords {
  lat: number
  lng: number
}

export default function SamplePage() {
  const [address, setAddress] = useState('서울특별시 서대문구 연세로5다길 22-3, 발리빌딩 3층')
  const [storeCoords, setStoreCoords] = useState<Coords | null>(null)
  const [myCoords, setMyCoords] = useState<Coords | null>(null)
  const [distance, setDistance] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isLocating, setIsLocating] = useState(false)

  // 두 좌표가 모두 있으면 자동 거리 계산
  useEffect(() => {
    if (storeCoords && myCoords) {
      const meters = getDistanceFromLatLng(
        myCoords.lat, myCoords.lng,
        storeCoords.lat, storeCoords.lng
      )
      setDistance(formatDistance(meters))
    }
  }, [storeCoords, myCoords])

  // Kakao REST API로 주소 → 좌표 변환
  const handleSearchAddress = async () => {
    if (!address.trim()) {
      setError('주소를 입력해주세요.')
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_KAKAO_REST_KEY
    if (!apiKey) {
      setError('NEXT_PUBLIC_KAKAO_REST_KEY 환경변수가 설정되지 않았습니다.')
      return
    }

    setIsSearching(true)
    setError(null)
    setStoreCoords(null)
    setDistance(null)

    try {
      const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
        { headers: { Authorization: `KakaoAK ${apiKey}` } }
      )

      if (!res.ok) {
        throw new Error(`API 응답 오류: ${res.status}`)
      }

      const data = await res.json()

      if (!data.documents || data.documents.length === 0) {
        setError('검색 결과가 없습니다. 정확한 주소를 입력해주세요.')
        return
      }

      const { y, x } = data.documents[0]
      setStoreCoords({ lat: parseFloat(y), lng: parseFloat(x) })
    } catch (err) {
      setError(err instanceof Error ? err.message : '주소 검색에 실패했습니다.')
    } finally {
      setIsSearching(false)
    }
  }

  // Geolocation API로 현재 위치 가져오기
  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      setError('이 브라우저는 위치 서비스를 지원하지 않습니다.')
      return
    }

    setIsLocating(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMyCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setIsLocating(false)
      },
      (err) => {
        const messages: Record<number, string> = {
          1: '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.',
          2: '위치 정보를 가져올 수 없습니다.',
          3: '위치 요청 시간이 초과되었습니다.',
        }
        setError(messages[err.code] ?? '현재 위치를 가져오는데 실패했습니다.')
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  return (
    <div className="container sub">
      <div className="sample-distance">
          <h2 className="sample-distance__title">거리 측정 샘플</h2>
          <p className="sample-distance__desc">
            매장 주소를 입력하고, 현재 위치와의 거리를 측정합니다.
          </p>

          {/* 주소 검색 */}
          <section className="sample-distance__section">
            <h3 className="sample-distance__label">매장 주소</h3>
            <div className="sample-distance__input-group">
              <input
                type="text"
                className="sample-distance__input"
                placeholder="예: 서울특별시 강남구 역삼동 123"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchAddress()}
              />
              <button
                className="sample-distance__btn"
                onClick={handleSearchAddress}
                disabled={isSearching}
              >
                {isSearching ? '검색 중...' : '좌표 검색'}
              </button>
            </div>
            {storeCoords && (
              <p className="sample-distance__coords">
                위도: {storeCoords.lat.toFixed(6)}, 경도: {storeCoords.lng.toFixed(6)}
              </p>
            )}
          </section>

          {/* 현재 위치 */}
          <section className="sample-distance__section">
            <h3 className="sample-distance__label">현재 위치</h3>
            <button
              className="sample-distance__btn sample-distance__btn--full"
              onClick={handleGetMyLocation}
              disabled={isLocating}
            >
              {isLocating ? '위치 가져오는 중...' : '현재 위치 가져오기'}
            </button>
            {myCoords && (
              <p className="sample-distance__coords">
                위도: {myCoords.lat.toFixed(6)}, 경도: {myCoords.lng.toFixed(6)}
              </p>
            )}
          </section>

          {/* 거리 결과 */}
          {distance && (
            <section className="sample-distance__result">
              <h3 className="sample-distance__label">측정 거리</h3>
              <p className="sample-distance__distance">{distance}</p>
            </section>
          )}

          {/* 에러 메시지 */}
          {error && (
            <p className="sample-distance__error">{error}</p>
          )}
        </div>
      </div>
  )
}
