import { changeNavbar } from "/changeNavbar.js";
import * as Api from "/api.js";

// 요소(element), input 혹은 상수
const containerDiv = document.querySelector(".containerDiv");

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  changeNavbar();
  insertTextToLanding();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {}

async function getDataFromApi(category) {
  const data = await Api.get("/api/product/new");
  return data;
}

// html에 출력해주는 함수
async function insertTextToLanding() {
  const getData = await getDataFromApi();
  console.log(getData);
  const productList = createProductList(getData);
  if (typeof productList == "object") {
    productList.forEach((el) => (containerDiv.innerHTML += el));
  } else {
    containerDiv.innerHTML = productList;
  }
}

// api를 통해 상품 정보를 받아온 후 html에 표시
function createProductList(data) {
  if (typeof data == "object") {
    return data.map(
      (el) =>
        `<a href="/product/product-detail?id=${el._id}">
          <div class="itemBox">
            <img src="http://localhost:5000/users/${el.productImage}" alt="${el.productName}">
          </div>
          <div class="contentDiv">
            <p>${el.productName}</p>
            <p>${el.productPrice.toLocaleString()}원</p>
          </div>
        </a>`
    );
  }
  return `<div id="noProduct"><h1>${data}</h1></div>`;
}
