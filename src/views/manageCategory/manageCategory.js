import { changeNavbar } from "/changeNavbar.js";
import * as Api from "/api.js";

const categoryContainer = document.querySelector(".categoryContainer");
const addCategory = document.querySelector("#addCategory");
const addModal = document.querySelector("#addModal");
const editModal = document.querySelector("#editModal");
const addModalClose = document.querySelector("#addModalClose");
const editModalClose = document.querySelector("#editModalClose");
const addBtn = document.querySelector("#addBtn");
const editBtn = document.querySelector("#editBtn");
const addCategoryName = document.querySelector("#categoryName1");
const addCategoryDescription = document.querySelector("#categoryDescription1");
const editCategoryName = document.querySelector("#categoryName2");
const editCategoryDescription = document.querySelector("#categoryDescription2");

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
    addModal.classList.add("is-active");
  });
  addModalClose.addEventListener("click", () => {
    addModal.classList.remove("is-active");
  });

  // 카테고리 수정을 위한 모달창 컨트롤러
  editModalClose.addEventListener("click", () => {
    editModal.classList.remove("is-active");
  });

  // 카테고리 추가 이벤트 리스너
  addBtn.addEventListener("click", addCategoryFn);
}

// html에 카테고리 목록을 출력해주는 함수
async function categoryLanding() {
  const getData = await getDataFromApi();
  createCategoryList(getData).forEach((el) =>
    categoryContainer.insertAdjacentHTML("beforeend", el)
  );
  const deleteButtons = document.querySelectorAll(".deleteButton");
  const editButtons = document.querySelectorAll(".editButton");

  // 클릭 시 카테고리 수정 모달창 열림
  editButtons.forEach((el) =>
    el.addEventListener("click", async (e) => {
      editModal.classList.add("is-active");
      const prevCategory = e.target.classList[0];
      editCategoryName.value = prevCategory;

      // 카테고리 수정 이벤트 리스너
      editBtn.addEventListener("click", async () => {
        const data = {
          // 음식 카테고리의 종류가 같다면 카테고리의 설명만 변경하도록 foodType 값을 null로 지정
          foodType: editCategoryName.value === prevCategory ? null : editCategoryName.value,
          description: editCategoryDescription.value,
        };
        try {
          await Api.patch("/api/category", prevCategory, data);
          window.location.href = "/admin/manageCategory/";
        } catch (err) {
          alert(err);
        }
      });
    })
  );

  // 클릭 시 카테고리 삭제 api 요청 후 카테고리 삭제
  deleteButtons.forEach((el) =>
    el.addEventListener("click", async (e) => {
      const catecory = e.target.classList[0];
      if (confirm("카테고리를 삭제하시겠습니까?")) {
        await Api.delete("/api/category/" + catecory);
        alert("카테고리가 삭제되었습니다.");
        window.location.href = "/admin/manageCategory/";
      }
    })
  );
}

// 카테고리 항목 추가 함수
async function addCategoryFn() {
  const data = {
    foodType: addCategoryName.value,
    description: addCategoryDescription.value,
  };
  try {
    await Api.post("/api/category/", data);
    alert("카테고리가 추가되었습니다.");
    window.location.href = "/admin/manageCategory/";
  } catch (err) {
    alert(err);
  }
}

// api를 통해 상품 정보를 받아온 후 html에 표시
function createCategoryList(data) {
  return data.map(
    (el) => `<div class="orderItem">
    <span>${el.createdAt.split("T")[0]}</span>
    <span>${el.foodType}</span>
    <span>${el.description}</span>
    <button class="${el.foodType} button editButton">수정</button>
    <button class="${el.foodType} button deleteButton">삭제</button>
    </div>`
  );
}

// 카테고리 목록 api 요청
async function getDataFromApi() {
  const data = await Api.get("/api/category/list");
  return data;
}
