'use client'

import { usePopupController } from '@/store/usePopupController'
import { useEffect, useState } from 'react'

export default function SalaryDetailFullTime() {
  const [active, setActive] = useState(false)
  const SalaryDetailFullTimePopup = usePopupController((state) => state.SalaryDetailFullTimePopup)
  const setSalaryDetailFullTimePopup = usePopupController((state) => state.setSalaryDetailFullTimePopup)

  useEffect(() => {
    // 팝업 열기 시간 필요
    setTimeout(() => {
      setActive(SalaryDetailFullTimePopup)
    }, 100)
  }, [SalaryDetailFullTimePopup])

  // 팝업 닫기 시간 필요
  const handleClose = () => {
    setActive(false)
    setTimeout(() => {
      setSalaryDetailFullTimePopup(false)
    }, 250)
  }

  return (
    <div className={`modal-popup full ${active ? 'act' : ''}`}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header min">
            <h3>급여 명세서 상세</h3>
            <button className="modal-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="pop-tit-cont-wrap">
              <div className="pop-tit-cont-item">
                <div className="pop-tit-cont-header">
                  <div className="pop-tit-cont-tit">2025년 1월 급여명세서</div>
                  <div className="pop-tit-cont-btn-wrap">
                    <button className="btn-form outline block">파일 다운로드</button>
                  </div>
                </div>
                <div className="pop-tit-cont-body">
                  <div className="pop-tit-cont-body-item">
                    <table className="data-table">
                      <colgroup>
                        <col width="70px" />
                        <col />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th>근무처</th>
                          <td>힘이나는 커피생활 을지로 3가점</td>
                        </tr>
                        <tr>
                          <th>직원명</th>
                          <td>홍길동</td>
                        </tr>
                        <tr>
                          <th>급여일</th>
                          <td>2025.02.05</td>
                        </tr>
                        <tr>
                          <th>정산 기간</th>
                          <td>2025.01.01~2025.01.31</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="pop-tit-cont-item">
                <div className="pop-tit-cont-header">
                  <div className="pop-tit-cont-tit">급여명세서 파일</div>
                </div>
                <div className="pop-tit-cont-body">
                  <div className="pop-tit-cont-body-item">
                    <ul className="salary-file-list">
                      <li className="salary-file-item">홍길동_주민등록등본.pdf</li>
                      <li className="salary-file-item">홍길동_주민등록등본.pdf</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="pop-tit-cont-item">
                <div className="pop-tit-cont-header">
                  <div className="pop-tit-cont-tit">급여정보</div>
                </div>
                <div className="pop-tit-cont-body">
                  <div className="pop-tit-cont-body-item">
                    <div className="salary-data">
                      <div className="salary-data-item red">
                        <div className="salary-data-item-tit">실지급액</div>
                        <div className="salary-data-item-desc">100,000원</div>
                      </div>
                      <div className="salary-data-item">
                        <div className="salary-data-item-tit">지급총액</div>
                        <div className="salary-data-item-desc">135,000 원</div>
                      </div>
                      <div className="salary-data-item">
                        <div className="salary-data-item-tit">공제총액</div>
                        <div className="salary-data-item-desc">35,000 원</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pop-tit-cont-item">
                <div className="pop-tit-cont-header">
                  <div className="pop-tit-cont-tit">지급 세부 내역</div>
                </div>
                <div className="pop-tit-cont-body">
                  <div className="pop-tit-cont-body-item salary">
                    <div className="salary-data">
                      <div className="salary-data-item">
                        <div className="salary-data-item-tit">기본급</div>
                        <div className="salary-data-item-desc">26,000 원</div>
                      </div>
                      <div className="salary-data-item">
                        <div className="salary-data-item-tit">식대</div>
                        <div className="salary-data-item-desc">26,000 원</div>
                      </div>
                      <div className="salary-data-item">
                        <div className="salary-data-item-tit">자가운전보조금</div>
                        <div className="salary-data-item-desc">26,000 원</div>
                      </div>
                      <div className="salary-data-item">
                        <div className="salary-data-item-tit">육아수당</div>
                        <div className="salary-data-item-desc">26,000 원</div>
                      </div>
                      <div className="salary-data-item">
                        <div className="salary-data-item-tit">야간수당</div>
                        <div className="salary-data-item-desc">26,000 원</div>
                      </div>
                      <div className="salary-data-item">
                        <div className="salary-data-item-tit">월간 휴일근무 수당</div>
                        <div className="salary-data-item-desc">26,000 원</div>
                      </div>
                      <div className="salary-data-item">
                        <div className="salary-data-item-tit">추가 근무수당</div>
                        <div className="salary-data-item-desc">26,000 원</div>
                      </div>
                      <div className="salary-data-item">
                        <div className="salary-data-item-tit">직책 상여</div>
                        <div className="salary-data-item-desc">26,000 원</div>
                      </div>
                      <div className="salary-data-item">
                        <div className="salary-data-item-tit">인센티브</div>
                        <div className="salary-data-item-desc">26,000 원</div>
                      </div>
                    </div>
                  </div>
                  <div className="pop-tit-cont-total-item">
                    <div className="total-data-wrap">
                      <div className="total-data-tit">지급총액 (+)</div>
                      <div className="total-data-desc">3,333,333 원</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pop-tit-cont-item">
                <div className="pop-tit-cont-header">
                  <div className="pop-tit-cont-tit">공제 세부 내역</div>
                </div>
                <div className="pop-tit-cont-body">
                  <div className="pop-tit-cont-body-item salary">
                    <div className="salary-data">
                      <div className="salary-data-item">
                        <div className="salary-data-item-tit">국민연금</div>
                        <div className="salary-data-item-desc">26,000 원</div>
                      </div>
                      <div className="salary-data-item">
                        <div className="salary-data-item-tit">건강보험</div>
                        <div className="salary-data-item-desc">26,000 원</div>
                      </div>
                      <div className="salary-data-item">
                        <div className="salary-data-item-tit">고용보험</div>
                        <div className="salary-data-item-desc">26,000 원</div>
                      </div>
                      <div className="salary-data-item">
                        <div className="salary-data-item-tit">장기요양보험</div>
                        <div className="salary-data-item-desc">26,000 원</div>
                      </div>
                      <div className="salary-data-item">
                        <div className="salary-data-item-tit">산재보험</div>
                        <div className="salary-data-item-desc">26,000 원</div>
                      </div>
                      <div className="salary-data-item">
                        <div className="salary-data-item-tit">소득세</div>
                        <div className="salary-data-item-desc">26,000 원</div>
                      </div>
                      <div className="salary-data-item">
                        <div className="salary-data-item-tit">지방소득세</div>
                        <div className="salary-data-item-desc">26,000 원</div>
                      </div>
                    </div>
                  </div>
                  <div className="pop-tit-cont-total-item">
                    <div className="total-data-wrap">
                      <div className="total-data-tit">공제총액(-)</div>
                      <div className="total-data-desc">366,610 원</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pop-tit-cont-item">
                <div className="pop-tit-cont-header">
                  <div className="pop-tit-cont-tit">실지급액</div>
                </div>
                <div className="pop-tit-cont-body">
                  <div className="pop-tit-cont-body-item black">
                    <div className="actual-pay-wrap">
                      <div className="actual-pay-tit">실지급액</div>
                      <div className="actual-pay-desc">2,966,724 원</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pop-tit-cont-item">
                <div className="pop-tit-cont-header">
                  <div className="pop-tit-cont-tit">지급 상세 정보</div>
                </div>
                <div className="pop-tit-cont-body">
                  <div className="salary-detail-info-wrap">
                    <div className="salary-detail-info-item">
                      <div className="salary-detail-info-item-header">
                        <div className="salary-detail-info-item-date">2025.01.02 (월)</div>
                        <div className="salary-detail-info-item-pay">95,733 원</div>
                      </div>
                      <div className="salary-detail-info-item-content">
                        <div className="salary-detail-info-table">
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">근무시간</div>
                            <div className="salary-detail-info-table-item-desc">9.0</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">시급</div>
                            <div className="salary-detail-info-table-item-desc">11,000</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">지급액</div>
                            <div className="salary-detail-info-table-item-desc">99,000</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">공제액</div>
                            <div className="salary-detail-info-table-item-desc">3.267</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="salary-detail-info-item">
                      <div className="salary-detail-info-item-header">
                        <div className="salary-detail-info-item-date">2025.01.03 (화)</div>
                        <div className="salary-detail-info-item-pay">95,733 원</div>
                      </div>
                      <div className="salary-detail-info-item-content">
                        <div className="salary-detail-info-table">
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">근무시간</div>
                            <div className="salary-detail-info-table-item-desc">9.0</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">시급</div>
                            <div className="salary-detail-info-table-item-desc">11,000</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">지급액</div>
                            <div className="salary-detail-info-table-item-desc">99,000</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">공제액</div>
                            <div className="salary-detail-info-table-item-desc">3.267</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="salary-detail-info-item last">
                      <div className="salary-detail-info-item-header">
                        <div className="salary-detail-info-item-date">2025.01.04 (수)</div>
                        <div className="salary-detail-info-item-pay">95,733 원</div>
                      </div>
                      <div className="salary-detail-info-item-content">
                        <div className="salary-detail-info-table">
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">근무시간</div>
                            <div className="salary-detail-info-table-item-desc">9.0</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">시급</div>
                            <div className="salary-detail-info-table-item-desc">11,000</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">지급액</div>
                            <div className="salary-detail-info-table-item-desc">99,000</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">공제액</div>
                            <div className="salary-detail-info-table-item-desc">3.267</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="salary-detail-info-item data">
                      <div className="salary-detail-info-item-header">
                        <div className="salary-detail-info-item-tit">주간소계</div>
                        <div className="salary-detail-info-item-pay">95,733 원</div>
                      </div>
                      <div className="salary-detail-info-item-content">
                        <div className="salary-detail-info-table">
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">근무시간</div>
                            <div className="salary-detail-info-table-item-desc">9.0</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">시급</div>
                            <div className="salary-detail-info-table-item-desc">11,000</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">지급액</div>
                            <div className="salary-detail-info-table-item-desc">99,000</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">공제액</div>
                            <div className="salary-detail-info-table-item-desc">3.267</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="salary-detail-info-item data">
                      <div className="salary-detail-info-item-header">
                        <div className="salary-detail-info-item-tit">주휴수당</div>
                        <div className="salary-detail-info-item-pay">95,733 원</div>
                      </div>
                      <div className="salary-detail-info-item-content">
                        <div className="salary-detail-info-table">
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">근무시간</div>
                            <div className="salary-detail-info-table-item-desc">9.0</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">시급</div>
                            <div className="salary-detail-info-table-item-desc">11,000</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">지급액</div>
                            <div className="salary-detail-info-table-item-desc">99,000</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">공제액</div>
                            <div className="salary-detail-info-table-item-desc">3.267</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="salary-detail-info-item data">
                      <div className="salary-detail-info-item-header">
                        <div className="salary-detail-info-item-tit">주간합계</div>
                        <div className="salary-detail-info-item-pay">95,733 원</div>
                      </div>
                      <div className="salary-detail-info-item-content">
                        <div className="salary-detail-info-table">
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">근무시간</div>
                            <div className="salary-detail-info-table-item-desc">9.0</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">시급</div>
                            <div className="salary-detail-info-table-item-desc">11,000</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">지급액</div>
                            <div className="salary-detail-info-table-item-desc">99,000</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">공제액</div>
                            <div className="salary-detail-info-table-item-desc">3.267</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="salary-detail-info-item total">
                      <div className="salary-detail-info-item-header">
                        <div className="salary-detail-info-item-tit">급여 소계</div>
                        <div className="salary-detail-info-item-pay">2,000,000 원</div>
                      </div>
                      <div className="salary-detail-info-item-content">
                        <div className="salary-detail-info-table">
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">근무시간</div>
                            <div className="salary-detail-info-table-item-desc">9.0</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">지급액</div>
                            <div className="salary-detail-info-table-item-desc">99,000</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">공제액</div>
                            <div className="salary-detail-info-table-item-desc">3.267</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="salary-detail-info-item total">
                      <div className="salary-detail-info-item-header">
                        <div className="salary-detail-info-item-tit">공제액 (4대보험)</div>
                        <div className="salary-detail-info-item-pay">26,000원</div>
                      </div>
                      <div className="salary-detail-info-item-content">
                        <div className="salary-detail-info-table">
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">근무시간</div>
                            <div className="salary-detail-info-table-item-desc">9.0</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">지급액</div>
                            <div className="salary-detail-info-table-item-desc">99,000</div>
                          </div>
                          <div className="salary-detail-info-table-item">
                            <div className="salary-detail-info-table-item-tit">공제액</div>
                            <div className="salary-detail-info-table-item-desc">3.267</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="salary-detail-info-item total">
                    <div className="salary-detail-info-item-header">
                      <div className="salary-detail-info-item-tit">상여금</div>
                      <div className="salary-detail-info-item-pay">29,010원</div>
                    </div>
                    <div className="salary-detail-info-item-content">
                      <div className="salary-detail-info-table">
                        <div className="salary-detail-info-table-item">
                          <div className="salary-detail-info-table-item-tit">항목</div>
                          <div className="salary-detail-info-table-item-txt">만근상여</div>
                          <div className="salary-detail-info-table-item-txt">인센티브</div>
                        </div>
                        <div className="salary-detail-info-table-item">
                          <div className="salary-detail-info-table-item-tit">지급액</div>
                          <div className="salary-detail-info-table-item-desc">30,000</div>
                          <div className="salary-detail-info-table-item-desc">0</div>
                        </div>
                        <div className="salary-detail-info-table-item">
                          <div className="salary-detail-info-table-item-tit">공제액</div>
                          <div className="salary-detail-info-table-item-desc">990</div>
                          <div className="salary-detail-info-table-item-desc">0</div>
                        </div>
                        <div className="salary-detail-info-table-item">
                          <div className="salary-detail-info-table-item-tit">차인금액</div>
                          <div className="salary-detail-info-table-item-desc">29,010</div>
                          <div className="salary-detail-info-table-item-desc">0</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="salary-detail-info-item actual">
                    <div className="salary-detail-info-item-header">
                      <div className="salary-detail-info-item-tit">급여합계</div>
                      <div className="salary-detail-info-item-pay">2,032,020원</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
