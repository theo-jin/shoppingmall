// 쿠키에서 토큰을 찾는 함수
function getToken() {
  const cookieList = document.cookie.split(";");
  for (let i = 0; i < cookieList.length; i++) {
    if (cookieList[i].split("=")[0].trim() === "token") {
      return cookieList[i].split("=")[1].trim();
    }
  }
}
const token = getToken();

//home의 navbar 변경시키는 함수
function changeNavbar() {
  const navbar = document.querySelector("#navbar");

  // sessionStore 내에 token이 존재할 시(로그인 되었을 시) navbar 변경
  if (token) {
    navbar.innerHTML = `<li><a href='/userInfo'>계정 관리</a></li>
    <li><a>로그아웃</a></li>
    <li>
      <a href="/cart" aria-current="page">
        <span class="icon">
          <i class="fas fa-cart-shopping"></i>
        </span>
        <span>카트</span>
      </a>
    </li>
    `;
  }

  // 유저가 admin일 경우 navbar 변경
  if (isCookie("role")) {
    navbar.innerHTML = `<li><a href='/admin'>페이지 관리</a></li>
    <li><a href='/userInfo'>계정 관리</a></li>
    <li><a>로그아웃</a></li>
    <li>
      <a href="/cart" aria-current="page">
        <span class="icon">
          <i class="fas fa-cart-shopping"></i>
        </span>
        <span>카트</span>
      </a>
    </li>
    `;
  }
  const logOut = navbar.children[navbar.children.length - 2];
  logOut.addEventListener("click", () => {
    deleteCookie("role");
    deleteCookie("token");
    window.location.href = "/";
  });

  // admin 여부를 확인하기 위해서 쿠키유무 체크하는 함수
  function isCookie(name) {
    const cookieList = document.cookie.split(";");
    for (let i = 0; i < cookieList.length; i++) {
      if (cookieList[i].split("=")[0].trim() === name) {
        return true;
      }
    }
    return false;
  }

  // 쿠키 삭제 함수
  function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1999 00:00:10 GMT;domain=localhost; path=/";
  }
}

export { changeNavbar };
