const navbar = document.querySelector("#navbar");
const containerDiv = document.querySelector(".containerDiv");
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
  createProductDetail(getData).forEach((el) => (containerDiv.innerHTML += el));

  const orderBtn = document.querySelector("#orderBtn");
  const putCartBtn = document.querySelector("#putCartBtn");
  const productCount = document.querySelector("#productCount");

  // 주문정보 넘겨주기
  orderBtn.addEventListener("click", () => {
    const data = {
      count: Number(productCount.value),
      name: getData[0].productName,
      price: getData[0].productPrice,
    };
    sessionStorage.setItem("product", JSON.stringify(data));
    window.location.href = "/order";
  });

  //장바구니 넘겨주기
  putCartBtn.addEventListener("click", () => {
    const productName = getData[0].productName;
    const prevData = JSON.parse(sessionStorage.getItem(productName));
    const data = {
      count: prevData
        ? Number(prevData.count) + Number(productCount.value)
        : Number(productCount.value),
      name: productName,
      price: getData[0].productPrice,
    };

    sessionStorage.setItem(productName, JSON.stringify(data));
    window.location.href = "/cart";
  });
}

// api를 통해 상품 상세 정보를 받아온 후 html에 표시
function createProductDetail(data) {
  return data.map(
    (el) =>
      `<div class="itemBox">
        <img src="${el.productImage}" alt="${el.productName}">
        
      </div>
      <div class="descriptionBox">
        <div class="description">
        <p>${el.productName}</p>
        <hr />
        <p>${el.productContent}</p>
        <p>${el.productPrice.toLocaleString()}원</p>
        </div>
        <div>
          <input id="productCount" type="number" value="1" min="1">
        </div>
        <div class="btnBox">
          <button id="orderBtn">주문하기</button>
          <button id="putCartBtn">장바구니 담기</button>
        </div>
      </div>`
  );
}

// api를 요청하기 위해서 쿼리를 통해 전달받은 카테고리를 변수로 사용
function getProductId() {
  let params = new URL(document.location).searchParams;
  let id = params.get("id");
  return id;
}

async function getDataFromApi(productId) {
  const data = await Api.get("/api/product/", productId);
  return data;
}
