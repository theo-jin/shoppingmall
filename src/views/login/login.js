import * as Api from "/api.js";
import { validateEmail } from "/useful-functions.js";

// 요소(element), input 혹은 상수
const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");
const submitButton = document.querySelector("#submitButton");

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener("click", handleSubmit);
}

// 이전 페이지 url
const prevUrl = document.referrer;
console.log(prevUrl);

// 로그인 진행
async function handleSubmit(e) {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  // 잘 입력했는지 확인
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;

  if (!isEmailValid || !isPasswordValid) {
    return alert("비밀번호가 4글자 이상인지, 이메일 형태가 맞는지 확인해 주세요.");
  }

  // 로그인 api 요청
  try {
    const data = { email, password };

    // api 요청 결과 token 값을 반환함
    const result = await Api.post("/api/login", data);

    // 로그인 성공, 토큰은 쿠키에 저장
    if (result.message === "OK") {
      alert(`정상적으로 로그인되었습니다.`);

      // 주문 결제 페이지에서 넘어왔다면 주문 결제 페이지로 이동
      if (prevUrl === "http://localhost:5000/order/") {
        window.location.href = "/order";
      }
      // 기본 페이지로 이동
      else window.location.href = "/";
    }
  } catch (err) {
    console.error(err.stack);
    alert(err.message);
  }
}
