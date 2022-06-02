import * as Api from "/api.js";

const navbar = document.querySelector("#navbar");
const containerDiv = document.querySelector(".containerDiv");
import { changeNavbar } from "/changeNavbar.js";

addAllElements();
// addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  changeNavbar();
  insertTextToLanding();
}

// html에 출력해주는 함수
async function insertTextToLanding() {
  const category = getCategory();
  const getData = await getDataFromApi(category);
  createProductList(getData).forEach((el) => (containerDiv.innerHTML += el));
}

// api를 통해 상품 정보를 받아온 후 html에 표시
function createProductList(data) {
  return data.map(
    (el) =>
      `<a href="/product/product-detail?id=${el._id}">
        <div class="itemBox">
          <img src="http://localhost:5000/users/${el.productImage}" alt="${el.productName}">
          <p>${el.productName}</p>
          <p>${el.productPrice.toLocaleString()}원</p>
        </div>
      </a>`
  );
}

// api를 요청하기 위해서 쿼리를 통해 전달받은 카테고리를 변수로 사용
function getCategory() {
  let params = new URL(document.location).searchParams;
  let category = params.get("category");
  return category;
}

async function getDataFromApi(category) {
  const data = await Api.get("/api/product/productlist", category);
  return data;
}
