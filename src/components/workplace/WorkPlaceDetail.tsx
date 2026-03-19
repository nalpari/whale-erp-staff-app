'use client'
import { useBottomSheetController } from '@/store/useBottomSheetController'

export default function WorkPlaceDetail() {
  const setAccountSelectSheet = useBottomSheetController((state) => state.setAccountSelectSheet)

  return (
    <div className="data-wrap">
      <div className="data-delete-btn-wrap">
        <button className="btn-form outline-r block ">
          근무처 삭제 <i className="delete"></i>
        </button>
      </div>
      <div className="data-list">
        <div className="data-item">
          <div className="sub-tit-wrap">
            <div className="sub-tit">힘이나는커피생활 을지로3가점</div>
          </div>
          <table className="data-table">
            <colgroup>
              <col width="60px" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <th>근무장소</th>
                <td>서울 중구 을지로</td>
              </tr>
              <tr>
                <th>대표자명</th>
                <td>홍길동</td>
              </tr>
              <tr>
                <th>점포 전화</th>
                <td>070-1240-0000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="data-item">
          <div className="sub-tit-wrap">
            <div className="sub-tit">나의 정보</div>
            <div className="sub-tit-btn">
              <button className="sub-edit-btn"></button>
            </div>
          </div>
          <table className="data-table">
            <colgroup>
              <col width="115px" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <th>이름</th>
                <td>홍길동</td>
              </tr>
              <tr>
                <th>사번</th>
                <td>0026</td>
              </tr>
              <tr>
                <th>계약분류/직급/직책</th>
                <td>파트타이머/과장/매니저</td>
              </tr>
              <tr>
                <th>근무여부</th>
                <td>근무</td>
              </tr>
              <tr>
                <th>입사일</th>
                <td>2025.01.13</td>
              </tr>
              <tr>
                <th>퇴사일</th>
                <td>-</td>
              </tr>
              <tr>
                <th>파트너오피스 권한</th>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="data-item">
          <div className="sub-tit-wrap">
            <div className="sub-tit">급여계좌 정보</div>
          </div>
          <table className="data-table">
            <colgroup>
              <col width="115px" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <th>은행명</th>
                <td>한국은행</td>
              </tr>
              <tr>
                <th>계좌 번호</th>
                <td>123456-78-123456</td>
              </tr>
              <tr>
                <th>예금주</th>
                <td>홍길동</td>
              </tr>
              <tr>
                <th>급여 계좌 변경일시</th>
                <td>2025.01.01 10:22</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="data-btn-wrap">
        <button className="btn-form login block" onClick={() => setAccountSelectSheet(true)}>
          급여계좌 변경
        </button>
      </div>
    </div>
  )
}
