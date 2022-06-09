import { changeNavbar } from "/changeNavbar.js";

const secondList = navbar.children[1];
const orderListButton = document.querySelector("#orderListReturn");
const homeButton = document.querySelector("#homeReturn");

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  changeNavbar();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  orderListButton.addEventListener("click", orderList);
  homeButton.addEventListener("click", homeReturn);
  secondList.addEventListener("click", () => {
    sessionStorage.removeItem("token");
  });
}
// TODO 주문정보 페이지로 이동
async function orderList(e) {
  e.preventDefault();
  window.location.href = "/userOrderList";
}
// 상품페이지로 이동
async function homeReturn(e) {
  e.preventDefault();
  window.location.href = "/";
}
