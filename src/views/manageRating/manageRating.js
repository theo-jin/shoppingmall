import { changeNavbar } from "/changeNavbar.js";
import * as Api from "/api.js";

// 요소(element), input 혹은 상수
const reviewContainer = document.querySelector("#reviewContainer");

addAllElements();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  changeNavbar();
  const getData = await getDataFromApi();
  createOrderList(getData).forEach((el) => (reviewContainer.innerHTML += el));
}

async function getDataFromApi() {
  const data = await Api.get("/api/order/user");
  return data;
}

function createOrderList(data) {
  return data.map(
    (el) =>
      `<div class="orderItem">
      <span>${el.createdAt.split("T")[0]}</span>
      <span>${el.products[0].productName}</span>
      <span>
        <span class="starSpan">
          <i class="far fa-star"></i>
        </span>
          <span class="starSpan">
          <i class="far fa-star"></i>
        </span>
        <span class="starSpan">
          <i class="far fa-star"></i>
        </span>
        <span class="starSpan">
          <i class="far fa-star"></i>
        </span>
        <span class="starSpan">
          <i class="far fa-star"></i>
        </span>
      </span>
      <button class="btn addButton">등록</button>
      <button class="btn editButton">수정</button>
      <button class="btn delButton">삭제</button>
    </div>`
  );
}
