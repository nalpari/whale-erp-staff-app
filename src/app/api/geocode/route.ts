import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/geocode?address=...
 *
 * Kakao Local REST API를 서버에서 프록시합니다.
 * API 키가 브라우저에 노출되지 않도록 서버 환경변수(KAKAO_REST_KEY)를 사용합니다.
 */
export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address')
  if (!address) {
    return NextResponse.json(null, { status: 400 })
  }

  const apiKey = process.env.KAKAO_REST_KEY
  if (!apiKey) {
    return NextResponse.json(null, { status: 500 })
  }

  try {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
      { headers: { Authorization: `KakaoAK ${apiKey}` } },
    )
    if (!res.ok) return NextResponse.json(null)

    const data = (await res.json()) as { documents: { y: string; x: string }[] }
    if (!data.documents?.length) return NextResponse.json(null)

    const { y, x } = data.documents[0]
    return NextResponse.json({ lat: parseFloat(y), lng: parseFloat(x) })
  } catch {
    return NextResponse.json(null)
  }
}
