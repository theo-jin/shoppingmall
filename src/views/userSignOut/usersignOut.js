import * as Api from "/api.js";

const passwordInput = document.getElementById("passwordInput");
const submitButton = document.getElementById("submitButton");

async function userSignOut(e) {
  e.preventDefault();
  if (!confirm("정말 회원 탈퇴하시겠습니까?")) return;
  const password = passwordInput.value;
  const data = { email, password };

  // TODO 로그아웃 API요청
  // 로그아웃 api 요청
  try {
    //TODO 어디서 받아와야할까요?delete로 안되는거같던데
    const res = await Api.delete(data);
    alert(`회원탈퇴 완료하였습니다.감사합니다.${res.message}`);

    //홈으로 이동.
    window.location.href = "/";
  } catch (err) {
    alert(`문제가 발생하였습니다. 비밀번호를 다시확인해주세요${err.message}`);
  }
}
submitButton.addEventListener("click", userSignOut);
