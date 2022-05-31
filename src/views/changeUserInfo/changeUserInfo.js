import * as Api from "/api.js";
import { validatePhoneNumber } from "/useful-functions.js";

// 요소(element), input 혹은 상수
const submitButton = document.querySelector("#submitButton");
const fullNameInput = document.querySelector("#fullNameInput");
const passwordInput = document.querySelector("#passwordInput");
const passwordConfirmInput = document.querySelector("#passwordConfirmInput");
const checkAddressBtn = document.querySelector("#checkAddressBtn");
const addressInput = document.querySelector("#addressInput");
const address1Input = document.querySelector("#address1Input");
const address2Input = document.querySelector("#address2Input");
const phoneInput = document.querySelector("#phoneInput");

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  await getDataFromApi();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener("click", handleSubmit);
  checkAddressBtn.addEventListener("click", findAddress);
}

async function handleSubmit(e) {
  e.preventDefault();
  const fullName = fullNameInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;
  const postalCode = addressInput.value;
  const address1 = address1Input.value;
  const address2 = address2Input.value;
  const address = {
    postalCode,
    address1,
    address2,
  };
  const phoneNumber = phoneInput.value;

  // 잘 입력했는지 확인
  const isFullNameValid = fullName.length >= 2;
  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === passwordConfirm;
  const isAddressValid = postalCode.length === 5;
  const isPhoneNumberValid = validatePhoneNumber(phoneNumber);

  if (!isFullNameValid || !isPasswordValid) {
    return alert("이름은 2글자 이상, 비밀번호는 4글자 이상이어야 합니다.");
  }

  if (!isAddressValid) {
    return alert("주소를 입력해주세요.");
  }

  if (!isPhoneNumberValid) {
    return alert("휴대전화 번호 형식이 맞지 않습니다.");
  }

  if (!isPasswordSame) {
    return alert("비밀번호가 일치하지 않습니다.");
  }

  // 회원정보 수정 요청
  try {
    const data = { fullName, email, password, address, phoneNumber };
    await Api.patch("/api/users/:userId", data);
    alert(`정상적으로 수정되었습니다.`);

    // 회원 정보 페이지 이동
    window.location.href = "/userInfo";
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// db에서 userData를 받아온 후 기존에 입력된 회원 정보를 보여줌
async function getDataFromApi() {
  const data = await Api.get("/api/userlist");

  fullNameInput.value = data.fullName;
  phoneInput.value = data.phoneNumber;
  const getAddress = data.address;
  addressInput.value = getAddress.postalCode;
  address1Input.value = getAddress.address1;
  address2Input.value = getAddress.address2;
}

// 다음 API를 활용하여 우편번호 및 도로명 주소 찾기
function findAddress(e) {
  e.preventDefault();
  new daum.Postcode({
    oncomplete: function (data) {
      // 우편번호
      addressInput.value = data.zonecode;

      // 도로명 주소
      address1Input.value = data.roadAddress;
    },
  }).open();
}
