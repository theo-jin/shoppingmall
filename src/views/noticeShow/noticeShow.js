import { changeNavbar } from "/changeNavbar.js";
import * as Api from "/api.js";

const mainContainer = document.querySelector(".mainContainer");

addAllElements();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  noticeLanding();
  changeNavbar();
}

// html에 공지 목록을 출력해주는 함수
async function noticeLanding() {
  const getData = await getDataFromApi();
  createNoticeList(getData).forEach((el) => mainContainer.insertAdjacentHTML("beforeend", el));
}

// api를 통해 상품 정보를 받아온 후 html에 표시
function createNoticeList(data) {
  return data.map(
    (el) => `
  <div class="columns textContent" >
    <div class="column is-2">${el.createdAt.split("T")[0]}</div>
    <div class="column is-3 order-summary">${el.title}</div>
    <div class="column is-7">${el.content}</div>
  </div>
  `
  );
}

// 공지 목록 api 요청
async function getDataFromApi() {
  const data = await Api.get("/api/notice/list");
  return data;
}
