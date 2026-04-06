import Link from 'next/link'
import '@/styles/publishpage.scss'

export default function PublishPage() {
  return (
    <div className="publish-list">
      <div className="p-header">
        <h1>Whale ERP</h1>
      </div>
      <div className="p-body">
        <div className="p-contents">
          {/* <div className="p-guide mb15">
            <div className="p-guide-header">Style Guide</div>
            <div className="p-guide-content">
              <div className="p-guide-link-wrap">
                <Link href={'/styleguide/gridsystem'}>Grid System</Link>
                <Link href={'/styleguide/desktopfont'}>Desktop Font</Link>
                <Link href={'/styleguide/mobilefont'}>Mobile Font</Link>
                <Link href={'/styleguide/textfield'}>Text Field / Selectors</Link>
                <Link href={'/styleguide/button'}>ButtonGuide</Link>
              </div>
            </div>
          </div> */}
          <div className="p-guide">
            <div className="p-guide-header">Publish Guide</div>
            <div className="p-guide-content">
              <p>
                ※ className은 케밥 케이스 사용
                <span> ex) &quot;sample-class&quot;</span>
              </p>
              <p>
                ※ img네이밍은 &quot;_&quot;로 사용, 번호 사용시 01, 02 와 같이 2자리 숫자 사용{' '}
                <span>ex) &quot;img_sample01&quot;</span>
              </p>
              <p>
                ※ button, select, checkbox, radio... 등 기본 설정은
                <span> Style Guide</span>에 정의된 내용만 사용
              </p>
              <p>※ scss파일 생성시 &quot;_&quot;를 앞에 붙힌 후 생성, 또한 해당 카테고리에 적합한 폴더에 생성</p>
            </div>
          </div>
          <div className="p-list-wrap">
            <h2>Publish List</h2>
            <div className="p-list-table">
              <table>
                <colgroup>
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '15%' }} />
                  <col />
                  <col style={{ width: '13%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '13%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>Depth01</th>
                    <th>Depth02</th>
                    <th>파일명</th>
                    <th>비고</th>
                    <th>MarkUp</th>
                    <th>완료일</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td rowSpan={3}>로그인</td>
                    <td>로그인 페이지</td>
                    <td>
                      <Link href={'/login'}>Login.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-02-03</td>
                  </tr>
                  <tr>
                    <td>본인 인증 페이지</td>
                    <td>
                      <Link href={'/request'}>Request.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-02-03</td>
                  </tr>
                  <tr>
                    <td>회원가입 페이지</td>
                    <td>
                      <Link href={'/signup'}>SignUp.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-02-03</td>
                  </tr>
                  <tr>
                    <td>Main</td>
                    <td></td>
                    <td>
                      <Link href={'/'}>Main.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-02-24</td>
                  </tr>
                  <tr>
                    <td>근로계약</td>
                    <td></td>
                    <td>
                      <Link href={'/employment'}>EmploymentList.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-02-24</td>
                  </tr>
                  <tr>
                    <td>급여명세서</td>
                    <td></td>
                    <td>
                      <Link href={'/salary'}>SalaryList.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-02-24</td>
                  </tr>
                  <tr>
                    <td>출퇴근체크</td>
                    <td></td>
                    <td>
                      <Link href={'/commute'}>CommuteList.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-02-25</td>
                  </tr>
                  <tr>
                    <td rowSpan={7}>마이페이지</td>
                    <td>마이페이지 메인</td>
                    <td>
                      <Link href={'/mypage'}>MypageList.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-02-26</td>
                  </tr>
                  <tr>
                    <td>프로필</td>
                    <td>
                      <Link href={'/mypage/profile'}>MypageProfile.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-02-26</td>
                  </tr>
                  <tr>
                    <td>급여 계좌 정보</td>
                    <td>
                      <Link href={'/mypage/account'}>MypageAccount.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-02-26</td>
                  </tr>
                  <tr>
                    <td>경력 관리</td>
                    <td>
                      <Link href={'/mypage/personal'}>MypagePersonal.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-02-26</td>
                  </tr>
                  <tr>
                    <td>자격증 관리</td>
                    <td>
                      <Link href={'/mypage/certificate'}>MypageCertificate.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-02-26</td>
                  </tr>
                  <tr>
                    <td>서류관리</td>
                    <td>
                      <Link href={'/mypage/document'}>MypageDocument.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-02-26</td>
                  </tr>
                  <tr>
                    <td>회원 탈퇴</td>
                    <td>
                      <Link href={'/mypage/withdrawal'}>MypageWithdrawal.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-02-26</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
