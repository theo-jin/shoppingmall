import * as Api from "/api.js";

const submitButton = document.getElementById("submitButton");

// 쿠키 삭제 함수
function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1999 00:00:10 GMT;domain=localhost; path=/";
}

async function userSignOut(e) {
  e.preventDefault();
  if (!confirm("정말 회원 탈퇴하시겠습니까?")) return;

  // 회원 정보 삭제 api 요청
  try {
    const res = await Api.delete("/api/");
    alert(`회원탈퇴 완료하였습니다.감사합니다.`);
    deleteCookie("token");
    //홈으로 이동.
    window.location.href = "/";
  } catch (err) {
    alert(`문제가 발생하였습니다. 비밀번호를 다시확인해주세요.`);
  }
}
submitButton.addEventListener("click", userSignOut);
