import * as Api from "/api.js";

// 요소(element), input 혹은 상수
const submitButton = document.querySelector("#submitButton");
const fullNameInput = document.querySelector("#fullNameInput");
const addressInput = document.querySelector("#addressInput");
const address1Input = document.querySelector("#address1Input");
const address2Input = document.querySelector("#address2Input");
const phoneInput = document.querySelector("#phoneInput");
const requestInput = document.querySelector("#requestInput");
var requestValue = requestInput.options[requestInput.selectedIndex].value;

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  await getDataFromApi();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  
}

// db에서 userData를 받아온 후 기존에 입력된 회원 정보를 보여줌
async function getDataFromApi() {
  const data = await Api.get("/api/userInfo");

  fullNameInput.value = data.fullName;
  phoneInput.value = data.phoneNumber;
  const getAddress = data.address;
  addressInput.value = getAddress.postalCode;
  address1Input.value = getAddress.address1;
  address2Input.value = getAddress.address2;
}

// TODO : 주문상품 데이터 받아오기(장바구니, 상품상세 페이지에서 바로결재)
// TODO : 주문자 데이터와 주문상품 데이터 DB에 보내기(주문자 이름, 연락처, 주소, 총액)
