import * as Api from "/api.js";
import { validatePhoneNumber, addCommas, convertToNumber } from "/useful-functions.js";
import { changeNavbar } from "/changeNavbar.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

addAllElements();
addAllEvents();
getItemData();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  changeNavbar();
  await getDataFromApi();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  $("#checkAddressBtn").addEventListener("click", findAddress);
  $("#submitButton").addEventListener("click", handleSubmit);
}

// db에서 userData를 받아온 후 기존에 입력된 회원 정보를 보여줌
async function getDataFromApi() {
  const data = await Api.get("/api/user");

  $("#fullNameInput").value = data.fullName;
  $("#phoneInput").value = data.phoneNumber ? data.phoneNumber : "";
  const getAddress = data.address;
  $("#addressInput").value = getAddress.postalCode;
  $("#address1Input").value = getAddress.address1;
  $("#address2Input").value = getAddress.address2;
}

//주소검색(daum api)
function findAddress(e) {
  e.preventDefault();
  new daum.Postcode({
    oncomplete: function (data) {
      // 우편번호
      $("#addressInput").value = data.zonecode;
      // 도로명 주소
      $("#address1Input").value = data.roadAddress;
    },
  }).open();
}

// 이전경로 판별
async function getItemData() {
  const before = document.referrer;
  if (before.split("/")[4] == "product-detail") {
    getDirectItem();
  } else if (before.split("/")[3] == "cart") {
    getCartItem();
  }
}

// 바로구매시 실행되는 함수
async function getDirectItem() {
  const data = sessionStorage.getItem("product");
  const itemData = JSON.parse(data);
  console.log(itemData);
  $("#productList").innerHTML += `<tr><td class="productName">${itemData.name}</td>
            <td class="productPrice">${addCommas(itemData.price)}</td>
            <td class="productNumber">${itemData.count}</td>
            <td class="productTotal">${addCommas(itemData.price * itemData.count)}</td></tr>`;
  $("#totalProductPrice").insertAdjacentHTML(
    "beforeend",
    `<label class="totaPrice" id="totalUserPrice">${addCommas(
      itemData.price * itemData.count
    )}</label>`
  );

  const products = new Array();
  products.push({
    productId: itemData.productId,
    productName: itemData.name,
    productCount: itemData.count,
  });
}

// 카트에서 주문상품 데이터 받아오기
async function getCartItem() {
  const data = sessionStorage.getItem("cartProduct");
  const itemData = JSON.parse(data);
  const products = new Array();
  itemData.forEach((el) => {
    $("#productList").innerHTML += `<tr><td class="productName">${el.name}</td>
            <td class="productPrice">${addCommas(el.price)}<span>원</span></td>
            <td class="productNumber">${el.count}</td>
            <td class="productTotal">${addCommas(el.price * el.count)}<span>원</span></td></tr>`;

    products.push({
      productId: el.productId,
      productName: el.name,
      productCount: el.count,
    });
  });
  const totalPriceList = $$(".productTotal");
  let price = 0;
  totalPriceList.forEach((el) => {
    price += Number(convertToNumber(el.innerHTML));
  });

  $("#totalProductPrice").insertAdjacentHTML(
    "beforeend",
    `<label class="totaPrice" id="totalUserPrice">${addCommas(price)}<span>원</span></label>`
  );
}

// 주문자 데이터와 주문상품 데이터 DB에 보내기(주문자 이름, 연락처, 주소, 총액),
async function handleSubmit(e) {
  e.preventDefault();
  const products = new Array();

  // 이전 주소
  const before = document.referrer;

  // 상품 상세정보에서 넘어왔을 때
  if (before.split("/")[4] == "product-detail") {
    const data = sessionStorage.getItem("product");
    const itemData = JSON.parse(data);
    console.log(itemData);
    products.push({
      productId: itemData.productId,
      productName: itemData.name,
      productCount: itemData.count,
    });
  }
  // 카트에서 넘어왔을 때
  else if (before.split("/")[3] == "cart") {
    const data = sessionStorage.getItem("cartProduct");
    const itemData = JSON.parse(data);
    itemData.forEach((el) => {
      products.push({
        productId: el.productId,
        productName: el.name,
        productCount: el.count,
      });
    });
  }

  // 사용자 정보 설정
  const fullName = $("#fullNameInput").value;
  const postalCode = $("#addressInput").value;
  const address1 = $("#address1Input").value;
  const address2 = $("#address2Input").value;
  const address = {
    postalCode,
    address1,
    address2,
  };
  const phoneNumber = $("#phoneInput").value;
  const totalPrice = convertToNumber($("#totalUserPrice").innerHTML);
  // 잘 입력했는지 확인
  const isAddressValid = postalCode.length === 5;
  const isPhoneNumberValid = validatePhoneNumber(phoneNumber);

  if (!isAddressValid) {
    return alert("주소를 입력해주세요.");
  }

  if (!isPhoneNumberValid) {
    return alert("휴대전화 번호 형식이 맞지 않습니다.");
  }
  try {
    // db에 저장할 데이터
    const data = {
      fullName,
      phoneNumber,
      address,
      products,
      totalPrice,
    };

    await Api.post("/api/order/complete", data);

    alert(`주문이 완료되었습니다.`);
    getProduct();

    // 주문완료 페이지 이동
    window.location.href = "/orderComplete";
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// 세션스토리지에서 데이터 가져오기
function getProduct() {
  const productkeys = Object.keys(sessionStorage);
  productkeys.forEach((el) => {
    // 바로 주문하기 데이터, 장바구니에서 주문하기로 넘겨주는 데이터, 별점 관련 데이터 제외
    if (el !== "role") {
      sessionStorage.removeItem(el);
    }
  });
}
