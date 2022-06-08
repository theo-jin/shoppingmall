import * as Api from "/api.js";
import { validatePhoneNumber} from "/useful-functions.js";

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

const logout = $("#navbar").children[1];
logout.addEventListener("click", () => {
  sessionStorage.removeItem("token");
});

addAllElements();
addAllEvents();
checkLogin();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  await getDataFromApi();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  $("#submitButton").addEventListener("click", handleSubmit);
  $("#checkAddressBtn").addEventListener("click", findAddress);
}

// 로그인시에만 주문이 가능함
function checkLogin(){
  if (!document.cookie){
    alert("로그인 후 이용가능한 서비스입니다.");
    window.location.href = "/login";
  }
}

// db에서 userData를 받아온 후 기존에 입력된 회원 정보를 보여줌
async function getDataFromApi() {
  const data = await Api.get("/api/user");
  $("#fullNameInput").value = data.fullName;
  $("#phoneInput").value = data.phoneNumber?data.phoneNumber:"";
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

// TODO:이전경로 판별
// TODO : 주문상품 데이터 받아오기(장바구니, 상품상세 페이지에서 바로결제)
// async function getItemData(){
//   const before=document.referrer;
//   console.log(before);
//   // if()
// }
getDirectItem();

// 바로구매시 실행되는 함수
async function getDirectItem(){
  const data=sessionStorage.getItem("product");
  const itemData=JSON.parse(data);

  $("#productList").innerHTML+=
  `<tr><td class="productName">${itemData.name}</td>
            <td class="productPrice">${itemData.price}</td>
            <td class="productNumber">${itemData.count}</td>
            <td class="productTotal">${itemData.price*itemData.count}</td></tr>`
  $("#totalProductPrice").insertAdjacentHTML('beforeend',
  `<label class="totaPrice" id="totalUserPrice">${itemData.price*itemData.count}</label>`)

  const products=new Array();
  products.push({productName:itemData.name, productCount:itemData.count});
}

// TODO:카트에서 주문상품 데이터 받아오기
async function getCartItem(){

}

// 주문자 데이터와 주문상품 데이터 DB에 보내기(주문자 이름, 연락처, 주소, 총액), 
async function handleSubmit(e) {
  e.preventDefault();
  const data=sessionStorage.getItem("product");
  const itemData=JSON.parse(data);
  const products=new Array();
  products.push({productName:itemData.name, productCount:itemData.count});

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
  const totalPrice=$("#totalUserPrice").innerHTML;
  const status="Information Received"
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
    const data = { fullName, phoneNumber, address, status, products , totalPrice };

    await Api.post("/api/order/complete", data);

    alert(`주문이 완료되었습니다.`);

    // 주문완료 페이지 이동
    window.location.href = "/orderComplete";
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

