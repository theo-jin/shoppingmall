import * as Api from "/api.js";

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
  const productList = createProductList(getData);
  if (typeof productList == "object") {
    productList.forEach((el) => (containerDiv.innerHTML += el));
  } else {
    containerDiv.innerHTML= productList;
  }
}

// api를 통해 상품 정보를 받아온 후 html에 표시
function createProductList(data) {
  if (typeof data == "object") {
    return data.map(
      (el) =>
        `<a href="/product/product-detail?id=${el._id}">
          <div class="itemBox">
            <div class="imgDiv">
              <img class="productImage" src="${el.productImage}" alt="${el.productName}">
            </div>
            <div class="contentDiv">
              <p>${el.productName}</p>
              <p>${el.productPrice.toLocaleString()}원</p>
            </div>
          </div>
        </a>`
    );
  }
  return `<div id="noProduct"><h1>${data}</h1></div>`;
}

// api를 요청하기 위해서 쿼리를 통해 전달받은 카테고리를 변수로 사용
function getCategory() {
  let params = new URL(document.location).searchParams;
  let category = params.get("category");
  switch (category) {
    case "krFood":
      return "한식";
    case "jpFood":
      return "일식";
    case "chFood":
      return "중식";
    case "wsFood":
      return "양식";
    default:
      return "기타";
  }
}

async function getDataFromApi(category) {
  const data = await Api.get("/api/product?category", category, true);
  return data;
}
