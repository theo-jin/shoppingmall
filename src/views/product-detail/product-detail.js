const containerDiv = document.querySelector(".containerDiv");
import * as Api from "/api.js";

import { changeNavbar } from "/changeNavbar.js";

addAllElements();
// addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  changeNavbar();
  productDetailLanding();
}

// html에 출력해주는 함수
async function productDetailLanding() {
  const productId = getProductId();
  const getData = await getDataFromApi(productId);
  containerDiv.innerHTML = createProductDetail(getData);

  const orderBtn = document.querySelector("#orderBtn");
  const putCartBtn = document.querySelector("#putCartBtn");
  const productCount = document.querySelector("#productCount");

  // 현재 상품에 대한 정보를 주문하기 페이지로 넘겨주기
  orderBtn.addEventListener("click", () => {
    const data = {
      productId: productId,
      count: Number(productCount.value),
      name: getData.productName,
      price: getData.productPrice,
    };
    sessionStorage.setItem("product", JSON.stringify(data));
    window.location.href = "/order";
  });

  // 현재 상품에 대한 정보를 장바구니 페이지로 넘겨주기
  putCartBtn.addEventListener("click", () => {
    const productName = getData.productName;
    const prevData = JSON.parse(sessionStorage.getItem(productName));
    const data = {
      id: productId,
      count: prevData
        ? Number(prevData.count) + Number(productCount.value)
        : Number(productCount.value),
      name: productName,
      price: getData.productPrice,
      img: getData.productImage,
    };

    sessionStorage.setItem(productName, JSON.stringify(data));
    window.location.href = "/cart";
  });
}

// api를 통해 상품 상세 정보를 받아온 후 html에 표시
function createProductDetail(data) {
  return `<div class="itemBox">
        <img class="productImage"  src="${data.productImage}" alt="${data.productName}">
        
      </div>
      <div class="descriptionBox">
        <div class="description">
          <p class="productTitle">${data.productName}</p>
          <hr />
          <p>조리법 : ${data.productContent}</p>
        </div>
        <div class="priceBox">
          <p>가격 : ${data.productPrice.toLocaleString()}원</p>
          <span>수량: <input id="productCount" type="number" value="1" min="1"></span>
        </div>
        <div class="btnBox">
          <button class="btn orderBtn" id="orderBtn">주문하기</button>
          <button class="btn putCartBtn" id="putCartBtn">장바구니 담기</button>
        </div>
      </div>`;
}
// TODO 상품 수량 증감 버튼 만들기
//<button class="decrease-item button is-rounded"> - </button>
//  <span class="menu-count">${el.count}</span>
/* <button class="increase-item button is-rounded"> + </button> */

// api를 요청하기 위해서 쿼리를 통해 전달받은 카테고리를 변수로 사용
function getProductId() {
  let params = new URL(document.location).searchParams;
  let id = params.get("id");
  return id;
}

async function getDataFromApi(productId) {
  const data = await Api.get("/api/product/detail?id", productId, true);
  return data;
}
