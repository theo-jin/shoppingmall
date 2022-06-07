import { addCommas } from "./../useful-functions.js";
import { changeNavbar } from "/changeNavbar.js";

// 요소(element), input 혹은 상수
const productsCountValue = document.querySelector("#productsCountValue");
const productCostValue = document.querySelector("#productCostValue");
const deliveryFeeValue = document.querySelector("#deliveryFeeValue");
const totalCostValue = document.querySelector("#totalCostValue");

addAllElements();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  changeNavbar();
  renderCartList();
}

// 카트 리스트 목록 렌더링
function renderCartList() {
  //sessionStorage에서 데이터 가져오기.
  const getDataList = Object.values(sessionStorage).map((el) => JSON.parse(el));
  const cartLists = getDataList
    .map((el) => {
      return `
        <div class="box">
          <li data-item-id="${el.id}" class="cart-list-item media">
            <div class="media-left">
            <input type="checkbox" class="cart-item" ${el.product}>
              <figure class="image is-64x64"><img alt="Image" src="${el.img}" /></figure>
            </div>
            <div class="media-content product-info">
              <div class="content">
                <p>
                  <strong class="title is-6"> ${el.name} </strong> 
                  <small class="subtitle is-6"> ${addCommas(el.price)} 원 </small>
                </p>
                <p>
                ${addCommas(el.price)} 원 x ${el.count} 
                = ${addCommas(el.price * el.count)} 원
                </p>
              </div>
              <nav class="level">
              <button class="decrease-item button is-rounded"> - </button>
              <span class="menu-count">${el.count}</span>
              <button class="increase-item button is-rounded"> + </button>
              <button class="delete-item button is-rounded"> 삭제 </button>
              </nav>
            </div>
          </li>
        </div>
      `;
    })
    .join("");
  document.querySelector("#cartShow").innerHTML = cartLists;

  let itemCounts = 0;
  let itemPrices = 0;
  let orderedItem = "";
  let deliveryFee = 0;
  getDataList.map((el) => {
    if (sessionStorage.length > 0) {
      itemCounts += el.count;
      itemPrices += el.price * el.count;
      orderedItem += `${el.name} / ${el.count}개<br />`;
      deliveryFee = 3000;
    }
    productsCountValue.innerHTML = orderedItem;
    productCostValue.innerText = `${addCommas(itemPrices)} 원`;
    deliveryFeeValue.innerText = `${addCommas(deliveryFee)} 원`;
    totalCostValue.innerText = `${addCommas(itemPrices + deliveryFee)} 원`;
  });
}

// 상품 상태 변경
document.querySelector("#cartShow").addEventListener("click", (e) => {
  const itemId = e.target.closest("li").dataset.itemId;

  // 상품 개수 증가
  if (e.target.classList.contains("increase-item")) {
    this.cart[itemId].count++;
    store.setSessionStorage(this.cart);
    render();
  }

  // 상품 개수 감소
  if (e.target.classList.contains("decrease-item")) {
    if (this.cart[itemId].count > 2) {
      this.cart[itemId].count--;
    } else {
      this.cart[itemId].count = 1;
    }
    store.setSessionStorage(this.cart);
    render();
  }

  // 상품 삭제
  if (e.target.classList.contains("delete-item")) {
    if (confirm("삭제하시겠습니까?")) {
      this.cart.splice(itemId, 1);
      e.target.closest("li").remove();
      store.setSessionStorage(this.cart);
      render();
    }
  }

  // 상품 선택
  if (e.target.classList.contains("cart-item")) {
    if (this.cart[itemId].cart === "checked") {
      this.cart[itemId].cart = "";
    } else {
      this.cart[itemId].cart = "checked";
    }
    store.setSessionStorage(this.cart);
    render();
  }
});

// 상품 전체 삭제
const deleteAll = document.querySelector("#allDelete");
deleteAll.addEventListener("click", () => {
  alert("장바구니에 있는 모든 상품을 삭제합니다.");
  this.cart = [];
  sessionStorage.clear();
  render();
});

// 상품 선택 삭제
const deleteSelection = document.querySelector("#selectDelete");
deleteSelection.addEventListener("click", () => {
  alert("선택한 상품을 삭제합니다.");
  this.cart = this.cart.filter((item) => item.cart !== "checked");
  store.setSessionStorage(this.cart);

  render();
});

//결제버튼
const purchaseButton = document.querySelector("#purchaseButton");
purchaseButton.addEventListener("click", () => {
  if (!confirm("정말 구매하시겠습니까?")) return;
  window.location.href = "/order";
  render();
});
