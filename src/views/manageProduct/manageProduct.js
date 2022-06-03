import { changeNavbar } from "/changeNavbar.js";
import * as Api from "/api.js";
// 요소(element), input 혹은 상수
const mainContainer = document.querySelector(".mainContainer");
const addProduct = document.querySelector("#addProduct");

// 상품 추가 모달 관련 요소
const addModal = document.querySelector("#addModal");
const addModalClose = document.querySelector("#addModalClose");
const addBtn = document.querySelector("#addBtn");
const addProductName = document.querySelector("#productName1");
const addProductCategory = document.querySelector("#productCategory1");
const addProductDescription = document.querySelector("#productDescription1");
const addProductPrice = document.querySelector("#productPrice1");
const addProductImage = document.querySelector("#fileUpload1");

// 상품 수정 모달 관련 요소
// const editModal = document.querySelector("#editModal");
// const editModalClose = document.querySelector("#editModalClose");
// const editBtn = document.querySelector("#editBtn");
// const editCategoryName = document.querySelector("#categoryName2");
// const editCategoryDescription = document.querySelector("#categoryDescription2");

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  categoryList();
  changeNavbar();
}

// // 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  // 카테고리 추가를 위한 모달창 컨트롤러
  addProduct.addEventListener("click", () => {
    addModal.classList.add("is-active");
  });
  addModalClose.addEventListener("click", () => {
    addModal.classList.remove("is-active");
  });

  // // 카테고리 수정을 위한 모달창 컨트롤러
  // editModalClose.addEventListener("click", () => {
  //   editModal.classList.remove("is-active");
  // });

  // 카테고리 추가 이벤트 리스너
  addBtn.addEventListener("click", addProductFn);
}

// html에 카테고리 목록을 출력해주는 함수
// async function categoryLanding() {
//   const getData = await getDataFromApi();
//   createCategoryList(getData).forEach((el) => mainContainer.insertAdjacentHTML("beforeend", el));
//   const deleteButtons = document.querySelectorAll(".deleteButton");
//   const editButtons = document.querySelectorAll(".editButton");

//   // 클릭 시 카테고리 수정 모달창 열림
//   editButtons.forEach((el) =>
//     el.addEventListener("click", async (e) => {
//       editModal.classList.add("is-active");
//       const prevCategory = e.path[2].children[1].innerText;

//       // 카테고리 수정 이벤트 리스너
//       editBtn.addEventListener("click", async () => {
//         const data = {
//           foodType: editCategoryName.value,
//           description: editCategoryDescription.value,
//         };
//         try {
//           await Api.patch("/api/category", prevCategory, data);
//           window.location.href = "/admin/manageCategory/";
//         } catch (err) {
//           alert(err);
//         }
//       });
//     })
//   );

//   // 클릭 시 카테고리 삭제 api 요청 후 카테고리 삭제
//   deleteButtons.forEach((el) =>
//     el.addEventListener("click", async (e) => {
//       const catecory = e.path[2].children[1].innerText;
//       await Api.delete("/api/category/" + catecory);
//       window.location.href = "/admin/manageCategory/";
//     })
//   );
// }

// 상품 추가 기능
async function addProductFn() {
  let category = addProductCategory.value;
  switch (category) {
    case "krFood":
      category = "한식";
      break;
    case "jpFood":
      category = "일식";
      break;
    case "chFood":
      category = "중식";
      break;
    case "wsFood":
      category = "양식";
      break;
    default:
      category = "기타";
      break;
  }
  const formData = new FormData();
  const productName = addProductName.value;
  const productContent = addProductDescription.value;
  const productPrice = addProductPrice.value;

  formData.append("productImage", addProductImage.files[0]);
  formData.append("productName", productName);
  formData.append("productContent", productContent);
  formData.append("productPrice", productPrice);
  formData.append("category", category);

  console.log(`%cPOST 요청: /api/product/add`, "color: #296aba;");
  console.log(`%cPOST 요청 데이터: /api/product/add`, "color: #296aba;");

  const res = await fetch("/api/product/add", {
    method: "POST",
    headers: {
      // "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: formData,
  });

  // 응답 코드가 4XX 계열일 때 (400, 403 등)
  if (!res.ok) {
    const errorContent = await res.json();
    const { reason } = errorContent;

    throw new Error(reason);
  }
  alert("상품이 등록되었습니다.");
  window.location.href = "/admin/manageProduct";
}

function createCategoryList(data) {
  return data.map((el) => {
    let category = el.foodType;
    switch (category) {
      case "한식":
        category = "krFood";
        break;
      case "일식":
        category = "jpFood";
        break;
      case "중식":
        category = "chFood";
        break;
      case "양식":
        category = "wsFood";
        break;
      default:
        category = "etc";
        break;
    }

    return `
      <option value=${category}>${el.foodType}</option>
      `;
  });
}

// 카테고리 목록 api 요청
async function getCategoryFromApi() {
  const data = await Api.get("/api/category/list");
  return data;
}

// 카테고리 목록을 보여주는 함수
async function categoryList() {
  const getData = await getCategoryFromApi();
  createCategoryList(getData).forEach((el) =>
    addProductCategory.insertAdjacentHTML("beforeend", el)
  );
}

// // 상품 목록 api 요청
// async function getProductFromApi() {
//   const data = await Api.get("/api/category/list");
//   return data;
// }
