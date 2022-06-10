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
      productId: productId,
      count: prevData
        ? Number(prevData.count) + Number(productCount.value)
        : Number(productCount.value),
      name: productName,
      price: getData.productPrice,
      Img: getData.productImage,
    };

    sessionStorage.setItem(productName, JSON.stringify(data));
    window.location.href = "/cart";
  });
}

// api를 통해 상품 상세 정보를 받아온 후 html에 표시
function createProductDetail(data) {
  const reviewScore = data.reviewScore;
  let review = "";

  //별점이 0이거나 없는 경우
  if (reviewScore === 0) {
    for (let i = 0; i < 5; i++) {
      review += '<i class="far fa-star"></i>';
    }
  } else {
    // 별점이 3.5점이라면 3점까지의 별을 색칠된 별로 표시
    for (let i = 0; i < reviewScore - 1; i++) {
      review += "<i class='fas fa-star'></i>";
    }

    // 소숫점 값에 따라 색칠의 정도 구분
    if (reviewScore % 1 === 0) {
      // 1,2,3,4,5 등의 정수일 경우 색칠된 별 표시
      review += "<i class='fas fa-star'></i>";
    } else if (reviewScore % 1 < 0.4) {
      // x.0 < score < x.4 사이일 경우 빈 별 표시
      review += '<i class="far fa-star"></i>';
    } else if (reviewScore % 1 < 0.8) {
      // x.4 <= score < x.8 사이일 경우 별 반개 표시
      review += "<i class='fas fa-star-half-alt'></i>";
    } else {
      // x.8 이상인 경우 색칠된 별 표시
      review += "<i class='fas fa-star'></i>";
    }

    // 별점이 3.5점이라면 위의 함수에 의해 별은 4개가 표시되므로 총 5개를 표시하기 위해 추가
    for (let i = Math.ceil(reviewScore); i < 5; i++) {
      review += '<i class="far fa-star"></i>';
    }
  }

  return `<div class="imgDiv">
        <img class="productImage"  src="${data.productImage}" alt="${data.productName}">
        
      </div>
      <div class="descriptionBox">
        <div class="description">
          <p class="productTitle">${data.productName}</p>
          <p>${review}</p>
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
