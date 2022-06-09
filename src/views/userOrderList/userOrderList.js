import * as Api from "/api.js";
import { changeNavbar } from "/changeNavbar.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

changeNavbar();

const optionStatus = {
  "Information Received": "주문완료",
  Processing: "상품준비중",
  "Out of Delivery": "배송준비중",
  "In transit": "배송중",
  Delivered: "배송완료",
};

renderDataFromApi();

// 이벤트 함수를 모아둠
function handleAllEvent() {
  $$(".deleteButton").forEach((btn) => btn.addEventListener("click", cancelOrder));
}

async function renderDataFromApi() {
  const data = await Api.get("/api/order/user");
  console.log(data);
  let userStatus = "";

  // 배송상태 확인
  data.forEach((el) => {
    let productList = "";
    const status = el.status;
    userStatus = optionStatus[status];

    // TODO: 장바구니 데이터 들어오면 수정필요
    // 상품리스트 출력
    el.products.forEach((data) => {
      productList += " " + data.productName;
    });

    $("#orderlistContainer").innerHTML += `<div class="orderItem">
      <span>${el.fullName}</span>
      <span>${el.createdAt.substr(0, 10)}</span>
      <span>${productList}</span>
      <span>${userStatus}</span>
      <button class="deleteButton">X</button>
       <span class="id">${el._id}</span>
    </div>`;
  });

  handleAllEvent();
}

// 취소버튼 누르면 주문데이터 삭제
async function cancelOrder(e) {
  let target = e.target;
  const orderId = target.parentNode.querySelector(".id").innerHTML;
  await Api.delete("/api/order/" + orderId);
  target.parentNode.remove();
  alert("주문이 취소되었습니다.");
}
