import { changeNavbar } from "/changeNavbar.js";
import * as Api from "/api.js";
const mainContainer = document.querySelector(".mainContainer");
const addCategory = document.querySelector("#addCategory");
const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".modal-close");
const addBtn = document.querySelector("#addBtn");
const categoryName = document.querySelector("#categoryName");
const categoryDescription = document.querySelector("#categoryDescription");

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  categoryLanding();
  changeNavbar();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  // 카테고리 추가를 위한 모달창 컨트롤러
  addCategory.addEventListener("click", () => {
    modal.classList.add("is-active");
  });
  modalClose.addEventListener("click", () => {
    modal.classList.remove("is-active");
  });

  // 카테고리 추가하기
  addBtn.addEventListener("click", addCategoryFn);
}

// html에 카테고리 목록을 출력해주는 함수
async function categoryLanding() {
  const getData = await getDataFromApi();
  createCategoryList(getData).forEach((el) => mainContainer.insertAdjacentHTML("beforeend", el));
  const deleteButtons = document.querySelectorAll(".deleteButton");

  //카테고리 삭제 기능
  deleteButtons.forEach((el) =>
    el.addEventListener("click", async (e) => {
      const catecory = e.path[2].children[1].innerText;
      await Api.delete("/api/category/" + catecory);
      window.location.href = "/admin/manageCategory/";
    })
  );
}

// 카테고리 항목 추가
async function addCategoryFn() {
  const data = {
    foodType: categoryName.value,
    description: categoryDescription.value,
  };
  await Api.post("/api/category/add", data);
  window.location.href = "/admin/manageCategory/";
}

// api를 통해 상품 정보를 받아온 후 html에 표시
function createCategoryList(data) {
  return data.map(
    (el) => `
  <div class="columns orders-item" id="order">
    <div class="column is-3">${el.createdAt.split("T")[0]}</div>
    <div class="column is-3 order-summary">${el.foodType}</div>
    <div class="column is-3">${el.description}</div>
    <div class="column is-3">
      <button class="button deleteButton">카테고리 삭제</button>
    </div>
  </div>
  `
  );
}

// 카테고리 목록 api 요청
async function getDataFromApi() {
  const data = await Api.get("/api/category/list");
  return data;
}
