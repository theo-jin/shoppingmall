import * as Api from "/api.js";

const containerDiv = document.querySelector(".containerDiv");
const pageContainer = document.querySelector(".pageContainer");
import { changeNavbar } from "/changeNavbar.js";

addAllElements();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  changeNavbar();
  insertTextToLanding();
}

// html에 출력해주는 함수
async function insertTextToLanding() {
  const categoryList = await getCategoryFromApi();
  const { category, page, limit } = getCategory(categoryList);
  const { total, products } = await getDataFromApi(category, page, limit);
  const productList = createProductList(products);
  if (typeof productList == "object") {
    productList.forEach((el) => (containerDiv.innerHTML += el));
  } else {
    containerDiv.innerHTML = productList;
  }
  createPageBtns(total).forEach((el) => (pageContainer.innerHTML += el));
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

// 페이지네이션 버튼 태그
function createPageBtns(total) {
  const limit = 6;
  const buttons = [];
  for (let i = 0; i < Math.ceil(total / limit); i++) {
    buttons.push(`<button class="pageButton">${i + 1}</button>`);
  }
  return buttons;
}

// api를 요청하기 위해서 쿼리를 통해 전달받은 카테고리를 변수로 사용
function getCategory(categoryList) {
  let params = new URL(document.location).searchParams;
  let index = params.get("category");
  let page = params.get("page");
  let limit = params.get("limit");
  return { category: categoryList[index - 1], page, limit };
}

// 페이지네이션 버튼 이벤트
pageContainer.addEventListener("click", async (e) => {
  let params = new URL(document.location).searchParams;
  let index = params.get("category");
  if (e.target.classList.contains("pageButton")) {
    const pageNumber = e.target.innerHTML;
    const limit = 6;
    window.location.href = `/product/?category=${index}&page=${pageNumber}&limit${limit}`;
  }
});

async function getDataFromApi(category, page, limit) {
  page === null ? (page = 1) : (page = page);
  limit === null ? (limit = 6) : (limit = limit);
  const { total, products } = await Api.get(
    "/api/product?category",
    category + `&page=${page}&limit=${limit}`,
    true
  );
  return { total, products };
}

async function getCategoryFromApi() {
  const data = await Api.get("/api/category/name");
  return data;
}
