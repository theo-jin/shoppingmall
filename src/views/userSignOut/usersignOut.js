import * as Api from "/api.js";

const submitButton = document.getElementById("submitButton");

async function userSignOut(e) {
  e.preventDefault();
  if (!confirm("정말 회원 탈퇴하시겠습니까?")) return;

  // 로그아웃 api 요청
  try {
    const res = await Api.delete("/api/user");
    sessionStorage.removeItem("token");
    alert(`회원탈퇴 완료하였습니다.감사합니다.${res.message}`);

    //홈으로 이동.
    window.location.href = "/";
  } catch (err) {
    alert(`문제가 발생하였습니다. 비밀번호를 다시확인해주세요${err.message}`);
  }
}
submitButton.addEventListener("click", userSignOut);
