import { changeNavbar } from "/changeNavbar.js";
import * as Api from "/api.js";
const mainContainer = document.querySelector("#mainContainer");

addAllElements();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  insertTextToLanding();
  changeNavbar();
}

// html에 출력해주는 함수
async function insertTextToLanding() {
  const getData = await getDataFromApi();
  createProductList(getData).forEach((el) => (mainContainer.innerHTML += el));
}

// api를 통해 상품 정보를 받아온 후 html에 표시
function createProductList(data) {
  return data.map((el) => ``);
}

// 카테고리 목록 api 요청
async function getDataFromApi() {
  const data = await Api.get("/api/category/list");
  return data;
}
