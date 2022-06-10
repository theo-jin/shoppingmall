import * as Api from "/api.js";
import { validateEmail, validatePhoneNumber } from "/useful-functions.js";

// 요소(element), input 혹은 상수
const fullNameInput = document.querySelector("#fullNameInput");
const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");
const passwordConfirmInput = document.querySelector("#passwordConfirmInput");
const submitButton = document.querySelector("#submitButton");
const checkAddressBtn = document.querySelector("#checkAddressBtn");
const addressInput = document.querySelector("#addressInput");
const address1Input = document.querySelector("#address1Input");
const address2Input = document.querySelector("#address2Input");
const phoneInput = document.querySelector("#phoneInput");

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener("click", handleSubmit);
}

// 회원가입 진행
async function handleSubmit(e) {
  e.preventDefault();

  const fullName = fullNameInput.value;
  const email = emailInput.value;
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
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === passwordConfirm;
  const isAddressValid = postalCode.length === 5;
  const isPhoneNumberValid = validatePhoneNumber(phoneNumber);

  if (!isFullNameValid || !isPasswordValid) {
    return alert("이름은 2글자 이상, 비밀번호는 4글자 이상이어야 합니다.");
  }

  if (!isEmailValid) {
    return alert("이메일 형식이 맞지 않습니다.");
  }

  if (!isAddressValid) {
    return alert("주소를 정확히 입력해주세요.");
  }

  if (!isPhoneNumberValid) {
    return alert("휴대전화 번호 형식이 맞지 않습니다.");
  }

  if (!isPasswordSame) {
    return alert("비밀번호가 일치하지 않습니다.");
  }

  // 회원가입 api 요청
  try {
    const data = { fullName, email, password, address, phoneNumber };

    await Api.post("/api/register", data);

    alert(`정상적으로 회원가입되었습니다.`);

    // 자동로그인
    const result = await Api.post("/api/login", { email, password });
    // 로그인 성공,
    if (result.status === 200) {
      const { role } = await Api.get("/api/role");
      sessionStorage.setItem("role", role);
      // 기본 페이지로 이동
      window.location.href = "/";
    }
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
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
checkAddressBtn.addEventListener("click", findAddress);
