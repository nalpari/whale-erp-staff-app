'use client'
import { usePopupController } from '@/store/usePopupController'

export default function SalaryList() {
  const setSalaryDetailFullTimePopup = usePopupController((state) => state.setSalaryDetailFullTimePopup)

  return (
    <div className="data-wrap">
      <div className="data-tit">급여명세서</div>
      <div className="data-list">
        <button className="data-item" onClick={() => setSalaryDetailFullTimePopup(true)}>
          <div className="salary-item-inner">
            <div className="salary-tit-wrap">
              <div className="salary-tit">2025년 10월 급여</div>
              <div className="salary-btn-wrap">
                <div className="data-list-arr"></div>
              </div>
            </div>
            <div className="data-table-wrap">
              <table className="data-table">
                <colgroup>
                  <col width="70px" />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>급여일</th>
                    <td>2025.10.28</td>
                  </tr>
                  <tr>
                    <th>정산기간</th>
                    <td>2025.10.28 ~ 2025.11.28</td>
                  </tr>
                  <tr>
                    <th>근무처</th>
                    <td>힘이나는 커피생활 을지로 3가점</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </button>
        <button className="data-item" onClick={() => setSalaryDetailFullTimePopup(true)}>
          <div className="salary-item-inner">
            <div className="salary-tit-wrap">
              <div className="salary-tit">2025년 09월 급여</div>
              <div className="salary-btn-wrap">
                <div className="data-list-arr"></div>
              </div>
            </div>
            <div className="data-table-wrap">
              <table className="data-table">
                <colgroup>
                  <col width="70px" />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>급여일</th>
                    <td>2025.10.28</td>
                  </tr>
                  <tr>
                    <th>정산기간</th>
                    <td>2025.10.28 ~ 2025.11.28</td>
                  </tr>
                  <tr>
                    <th>근무처</th>
                    <td>힘이나는 커피생활 을지로 3가점</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </button>
        <button className="data-item" onClick={() => setSalaryDetailFullTimePopup(true)}>
          <div className="salary-item-inner">
            <div className="salary-tit-wrap">
              <div className="salary-tit">2025년 08월 급여</div>
              <div className="salary-btn-wrap">
                <div className="data-list-arr"></div>
              </div>
            </div>
            <div className="data-table-wrap">
              <table className="data-table">
                <colgroup>
                  <col width="70px" />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>급여일</th>
                    <td>2025.10.28</td>
                  </tr>
                  <tr>
                    <th>정산기간</th>
                    <td>2025.10.28 ~ 2025.11.28</td>
                  </tr>
                  <tr>
                    <th>근무처</th>
                    <td>힘이나는 커피생활 을지로 3가점</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </button>
        <div className="data-item">
          <div className="workplace-empty">등록된 급여명세서가 없습니다.</div>
        </div>
      </div>
    </div>
  )
}
