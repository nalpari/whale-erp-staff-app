export default function TodoContents() {
  return (
    <div className="todo-contents">
      <div className="todo-content-tit">TO-DO 체크</div>
      <div className="todo-diary-wrap"></div>
      <div className="todo-list-wrap">
        <div className="todo-date">12월 7일 금요일</div>
        <div className="todo-list-item">
          <div className="todo-list-item-tit">힘이나는 커피생활 을지로 3가점</div>
          <div className="todo-check-wrap">
            <div className="todo-check-item">
              <div className="check-form-box ">
                <input type="checkbox" id="todo-check-1" />
                <label htmlFor="todo-check-1">바닥 물 청소</label>
              </div>
            </div>
            <div className="todo-check-item">
              <div className="check-form-box ">
                <input type="checkbox" id="todo-check-2" />
                <label htmlFor="todo-check-2">발주 13시까지</label>
              </div>
            </div>
          </div>
        </div>
        <div className="todo-list-item">
          <div className="todo-list-item-tit">바나프레소, 종로3가점</div>
          <div className="todo-check-wrap">
            <div className="todo-check-item">
              <div className="check-form-box ">
                <input type="checkbox" id="todo-check-3" />
                <label htmlFor="todo-check-3">머신 청소</label>
              </div>
            </div>
            <div className="todo-check-item">
              <div className="check-form-box ">
                <input type="checkbox" id="todo-check-4" />
                <label htmlFor="todo-check-4">발주 13시까지</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
