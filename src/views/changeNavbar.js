//home의 navbar 변경시키는 함수
function changeNavbar() {
  const navbar = document.querySelector("#navbar");
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

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
  if (role) {
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

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");

    window.location.href = "/";
  });
}

export { changeNavbar };
