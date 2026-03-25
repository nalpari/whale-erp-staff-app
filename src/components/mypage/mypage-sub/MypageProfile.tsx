'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { profileApi } from '@/lib/api-endpoints'
import type { ProfileResponse } from '@/types/api'

// 다음 주소찾기 스크립트 동적 로드
function loadDaumPostcode() {
  if (typeof window === 'undefined') return
  if (document.getElementById('daum-postcode-script')) return
  const script = document.createElement('script')
  script.id = 'daum-postcode-script'
  script.src = '//t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
  document.head.appendChild(script)
}

export default function MypageProfile() {
  const router = useRouter()
  const setAvatarSelectSheet = useBottomSheetController((s) => s.setAvatarSelectSheet)
  const setPhoneChangeSheet = useBottomSheetController((s) => s.setPhoneChangeSheet)

  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)

  // 수정 가능한 필드
  const [email, setEmail] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [address, setAddress] = useState('')
  const [addressDetail, setAddressDetail] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadDaumPostcode()
    const fetchProfile = async () => {
      try {
        const res = await profileApi.getProfile()
        const data = res.data
        setProfile(data)
        setEmail(data.email ?? '')
        setZipCode(data.zipCode ?? '')
        setAddress(data.address ?? '')
        setAddressDetail(data.addressDetail ?? '')
      } catch (err) {
        console.error('프로필 조회 실패:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // 다음 주소찾기
  const handleAddressSearch = () => {
    if (typeof window === 'undefined' || !window.daum) return
    new window.daum.Postcode({
      oncomplete: (data) => {
        setZipCode(data.zonecode)
        setAddress(data.roadAddress || data.address)
      },
    }).open()
  }

  // 변경사항 있는지 확인
  const hasChanges = profile && (
    email !== (profile.email ?? '') ||
    zipCode !== (profile.zipCode ?? '') ||
    address !== (profile.address ?? '') ||
    addressDetail !== (profile.addressDetail ?? '')
  )

  const handleSave = async () => {
    if (!hasChanges || saving) return
    setSaving(true)
    try {
      const res = await profileApi.updateProfile({
        email: email || undefined,
        zipCode: zipCode || undefined,
        address: address || undefined,
        addressDetail: addressDetail || undefined,
      })
      setProfile(res.data)
      alert('회원정보가 수정되었습니다.')
      router.push('/mypage')
    } catch (err) {
      const message = err instanceof Error ? err.message : '저장에 실패했습니다.'
      alert(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mypage-sub-wrap">
        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>로딩 중...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mypage-sub-wrap">
        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>프로필 정보를 불러올 수 없습니다.</div>
      </div>
    )
  }

  // 전화번호 포맷팅 (01012345678 → 010-1234-5678)
  const formatPhone = (phone: string | null) => {
    if (!phone) return '-'
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
    if (cleaned.length === 10) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    return phone
  }

  return (
    <div className="mypage-sub-wrap">
      <div className="profile-wrap">
        <div className="profile-img">
          <Image src="/assets/images/contents/avatar_profile01.png" alt="profile-img" fill />
          <button className="img-edit-btn" onClick={() => setAvatarSelectSheet(true)}></button>
        </div>
        <div className="profile-info">
          <div className="profile-info-name">{profile.name}</div>
          <div className="profile-info-id">{profile.loginId}</div>
        </div>
      </div>
      <div className="profile-form-wrap">
        {/* ID (읽기전용) */}
        <div className="profile-form-item">
          <div className="profile-form-item-tit">ID</div>
          <div className="block">
            <input type="text" className="input-frame" value={profile.loginId} readOnly />
          </div>
        </div>

        {/* 이메일 (수정가능) */}
        <div className="profile-form-item">
          <div className="profile-form-item-tit">이메일</div>
          <div className="block">
            <input
              type="email"
              className="input-frame"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
            />
          </div>
        </div>

        {/* 이름 (읽기전용) */}
        <div className="profile-form-item">
          <div className="profile-form-item-tit">이름 <span className="imp">*</span></div>
          <div className="block">
            <input type="text" className="input-frame" value={profile.name} readOnly />
          </div>
        </div>

        {/* 주민등록번호 (마스킹) */}
        <div className="profile-form-item">
          <div className="profile-form-item-tit">주민등록 번호</div>
          <div className="block">
            <input
              type="text"
              className="input-frame"
              value={profile.residentRegistrationNumber ?? '-'}
              readOnly
            />
          </div>
        </div>

        {/* 생년월일 (읽기전용) */}
        <div className="profile-form-item">
          <div className="profile-form-item-tit">생년월일</div>
          <div className="block">
            <input
              type="text"
              className="input-frame"
              value={profile.birthDate ?? '-'}
              readOnly
            />
          </div>
        </div>

        {/* 휴대폰 번호 (읽기전용, 변경 버튼) */}
        <div className="profile-form-item">
          <div className="profile-form-item-tit">
            휴대폰 번호 <span className="imp">*</span>
          </div>
          <div className="block">
            <input
              type="text"
              className="input-frame"
              value={formatPhone(profile.mobilePhone)}
              readOnly
            />
          </div>
          <div className="block mt10">
            <button className="btn-form outline block" onClick={() => setPhoneChangeSheet(true)}>
              변경
            </button>
          </div>
        </div>

        {/* 주소 (수정가능) */}
        <div className="profile-form-item">
          <div className="profile-form-item-tit">주소</div>
          <div className="block">
            <input
              type="text"
              className="input-frame"
              value={address ? `${zipCode ? `(${zipCode}) ` : ''}${address}` : '-'}
              readOnly
            />
          </div>
          <div className="block mt10">
            <button className="btn-form outline block" onClick={handleAddressSearch}>
              검색
            </button>
          </div>
          <div className="block mt10">
            <input
              type="text"
              className="input-frame"
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
              placeholder="상세주소를 입력하세요"
            />
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="profile-form-item">
          <div className="block">
            <button
              className={`btn-form block ${hasChanges ? 'login' : 'outline'}`}
              onClick={handleSave}
              disabled={!hasChanges || saving}
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
