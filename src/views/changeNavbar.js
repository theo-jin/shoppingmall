import * as Api from "/api.js";

//home의 navbar 변경시키는 함수
function changeNavbar() {
  const role = sessionStorage.getItem("role");

  // sessionStore 내에 token이 존재할 시(로그인 되었을 시) navbar 변경
  if (role === "basic-user") {
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
    logout();
  }

  // 유저가 admin일 경우 navbar 변경
  if (role === "admin") {
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
    logout();
  }
}

async function logout() {
  const navbar = document.querySelector("#navbar");
  const logOut = navbar.children[navbar.children.length - 2];
  logOut.addEventListener("click", async () => {
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("token");
    await Api.get("/api/logout");
    window.location.href = "/";
  });
}

export { changeNavbar };
