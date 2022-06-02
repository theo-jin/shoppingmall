const navbar = document.querySelector("#navbar");

const secondList = navbar.children[1];
secondList.addEventListener("click", () => {
  sessionStorage.removeItem("token");
});