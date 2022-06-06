import { addCommas} from './../useful-functions.js';

const purchaseButton = document.querySelector("#purchaseButton");
const selectDelete = document.querySelector("#selectDelete");

const productsCountValue = document.querySelector("#productsCountValue");
const productCostValue = document.querySelector("#productCostValue");
const totalCostValue = document.querySelector("#totalCostValue");

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할.
async function addAllElements() {
  await getDataFromApi();
  await getItemData();
  await getProductData();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할.
function addAllEvents() {
  purchaseButton.addEventListener("click", moveToOrderPage);
  selectDelete.addEventListener("click", selectDelete);
};
 //sssion에서 데이터 가져오기. 
const cartData=JSON.parse(sessionStorage.getItem("product"));
 
  async function getProductData(){
  
    console.log(cartData);

    cartShow.innerHTML+=
    `<div class = "cartInfo">
    <div class="itemBox">
      <img src="${productImage}" alt="${cartData.Name}"> 
    </div>
    <div class="descriptionBox">
      <div class="description">
      <label class="checkbox">
      <input type="checkbox" id="selectCheckbox" />
    </label>
        <p>${cartData.Name}</p>
        <p>${cartData.count}</p>
        <p>${addCommas(cartData.price)}원</p>
      </div>
      <p>${addCommas(cartData.count * cartData.price)}원</p>
  <div class="btnBox">
    <button id="deleteButton">삭제하기</button>
  </div>
  </div>
  </div>`;
  
  }


//카트계산하기
function getTotalPrice() {
  let count = cartData.count;
  let price = cartData.price;
    count*price;
  };
totalCostValue.innerText = `${addCommas(getTotalPrice(data))}원`;


//삭제하기 버튼
sessionStorage.removeItem(product)
 //전체 삭제하기
 sessionStorage.clear()
//plus 버튼
//minus 버튼



// productsCountValue.innerText = `총 ${}개`;
// productCostValue.innerText = `${addCommas(())}원`;
// productCostValue.innerText = `${addCommas(())}원`;
//구매하기 버튼
function moveToOrderPage() {

  sessionStorage.setItem("cart", JSON.stringify());

    //oder로 이동.
    window.location.href = "/order";
  }
  purchaseButton.addEventListener("click", moveToOrderPage);

