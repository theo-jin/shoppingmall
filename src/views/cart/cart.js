import { changeNavbar } from "/changeNavbar.js";

// 요소(element), input 혹은 상수
const productContainer = document.querySelector("#productContainer");
const allProductTotalPrice = document.querySelector("#allProductTotalPrice");
const submitButton = document.querySelector(".submitButton");

addAllElements();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  changeNavbar();
  const getProductList = getProduct();
  createDataContainer(getProductList).forEach((el) => (productContainer.innerHTML += el));
  eventHandler();
  calculAllProductTotalPrice();
}

// 세션스토리지에서 데이터 가져오기
function getProduct() {
  const productkeys = Object.keys(sessionStorage);
  const productList = [];
  productkeys.forEach((el) => {
    if (el !== "product" && el !== "cartProduct") {
      productList.push(JSON.parse(sessionStorage.getItem(el)));
    }
  });
  return productList;
}

// 상품 데이터를 html 요소로 전환
function createDataContainer(getProductList) {
  return getProductList.map(
    (el) =>
      `<div class="productBox">
    <div class="imgBox">
      <img src=${el.Img} alt=${el.name}>
    </div>
    <div class="detailBox">
      <p>상품명: 
        <span class="productName">${el.name}</span>
      </p>
      <p>상품가격: 
        <span class="productPrice">${el.price.toLocaleString()}</span>원
      </p>
      <div class="orderCount">주문수량: 
        <button class="add"> + </button>
        <span class="productCount">${el.count}</span> 
        <button class="del"> - </button>
      </div>
      <p>합계: 
        <span class="totalPrice">${(el.price * el.count).toLocaleString()}</span>원
      </p> 
      <div>
        <button class="delItem">제거</button>
      </div>
    </div>
  </div>`
  );
}

// 최초 로딩 시 총 합계 금액 계산
function calculAllProductTotalPrice() {
  const totalPriceList = document.querySelectorAll(".totalPrice");
  let price = 0;
  totalPriceList.forEach((el) => {
    price += Number(el.innerHTML.replace(",", ""));
  });
  allProductTotalPrice.innerHTML = price.toLocaleString();
}

// 이벤트 핸들러
function eventHandler() {
  document.querySelectorAll(".productBox").forEach((el) => {
    el.addEventListener("click", (e) => {
      // 총 합계 금액
      const currentAllPrice = Number(allProductTotalPrice.innerHTML.replace(",", ""));

      // 상품 수량 증가
      if (e.target.classList.contains("add")) {
        const countTag = el.querySelector(".productCount");
        const priceTag = el.querySelector(".productPrice");
        const totalPriceTag = el.querySelector(".totalPrice");

        let price = Number(priceTag.innerHTML.replace(",", ""));
        let count = Number(countTag.innerHTML);
        countTag.innerHTML = ++count;
        totalPriceTag.innerHTML = `${(count * price).toLocaleString()}`;
        allProductTotalPrice.innerHTML = (currentAllPrice + price).toLocaleString();
      }

      // 상품 수량 감소
      if (e.target.classList.contains("del")) {
        const countTag = el.querySelector(".productCount");
        const priceTag = el.querySelector(".productPrice");
        const totalPriceTag = el.querySelector(".totalPrice");

        let price = Number(priceTag.innerHTML.replace(",", ""));
        let count = Number(countTag.innerHTML);
        if (count * price > 0) {
          countTag.innerHTML = --count;
          totalPriceTag.innerHTML = `${(count * price).toLocaleString()}`;
          allProductTotalPrice.innerHTML = (currentAllPrice - price).toLocaleString();
        }
      }

      // 상품 제거
      if (e.target.classList.contains("delItem")) {
        const productName = el.querySelector(".productName").innerHTML;
        sessionStorage.removeItem(productName);
        window.location.reload();
      }
    });
  });
}

// 주문하기
submitButton.addEventListener("click", () => {
  const productBox = document.querySelectorAll(".productBox");
  const productList = [];
  productBox.forEach((el) => {
    const name = el.querySelector(".productName").innerHTML;
    const price = el.querySelector(".productPrice").innerHTML.replace(",", "");
    const count = el.querySelector(".productCount").innerHTML;
    const data = {
      name,
      price,
      count,
    };
    productList.push(data);
  });
  sessionStorage.setItem("cartProduct", JSON.stringify(productList));
  window.location.href = "/order";
});
