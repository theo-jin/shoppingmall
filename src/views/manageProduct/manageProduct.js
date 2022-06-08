import { changeNavbar } from "/changeNavbar.js";
import * as Api from "/api.js";

// 요소(element), input 혹은 상수
const productContainer = document.querySelector(".productContainer");
const addProduct = document.querySelector("#addProduct");

// 상품 추가 모달 관련 요소
const addModal = document.querySelector("#addModal");
const addModalClose = document.querySelector("#addModalClose");
const addProductBtn = document.querySelector("#addBtn");
const addProductName = document.querySelector("#productName1");
const addProductCategory = document.querySelector("#productCategory1");
const addProductDescription = document.querySelector("#productDescription1");
const addProductPrice = document.querySelector("#productPrice1");
const addProductImage = document.querySelector("#fileUpload1");

// 상품 수정 모달 관련 요소
const editModal = document.querySelector("#editModal");
const editModalClose = document.querySelector("#editModalClose");
const editProductBtn = document.querySelector("#editBtn");
const editProductName = document.querySelector("#productName2");
const editProductDescription = document.querySelector("#productDescription2");
const editProductCategory = document.querySelector("#productCategory2");
const editProductPrice = document.querySelector("#productPrice2");
const editProductImage = document.querySelector("#fileUpload2");

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  changeNavbar();
  categoryList();
  allProductsLanding();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  // 상품 추가를 위한 모달창 컨트롤러
  addProduct.addEventListener("click", () => {
    addModal.classList.add("is-active");
  });
  addModalClose.addEventListener("click", () => {
    addModal.classList.remove("is-active");
  });

  // 상품 수정을 위한 모달창 컨트롤러
  editModalClose.addEventListener("click", () => {
    editModal.classList.remove("is-active");
  });

  // 상품 추가 이벤트 리스너
  addProductBtn.addEventListener("click", addProductFn);
}

// html에 상품 전체 목록을 출력해주는 함수
async function allProductsLanding() {
  const getData = await getProductListFromApi();
  createProductList(getData).forEach((el) => productContainer.insertAdjacentHTML("beforeend", el));
  const deleteButtons = document.querySelectorAll(".deleteButton");
  const editButtons = document.querySelectorAll(".editButton");

  // 클릭 시 상품 수정 모달창 열림
  editButtons.forEach((el) =>
    el.addEventListener("click", async (e) => {
      editModal.classList.add("is-active");
      const prevProductName = e.target.classList[0];
      // 상품 수정 이벤트 리스너
      editProductBtn.addEventListener("click", async () => {
        let category = editProductCategory.value;
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
        const productName = editProductName.value;
        const productContent = editProductDescription.value;
        const productPrice = editProductPrice.value;
        const formData = new FormData();
        formData.append("productImage", editProductImage.files[0]);
        formData.append("productName", productName);
        formData.append("productContent", productContent);
        formData.append("productPrice", productPrice);
        formData.append("category", category);

        // api 수정 요청
        const apiUrl = `/api/product/${prevProductName}`;
        console.log(`%cPATCH 요청: ${apiUrl}`, "color: #296aba;");
        console.log(`%cPATCH 요청 데이터: ${apiUrl}`, "color: #296aba;");

        const res = await fetch(apiUrl, {
          method: "PATCH",
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
        alert("상품이 수정되었습니다.");
        window.location.href = "/admin/manageProduct";
      });
    })
  );

  // 클릭 시 상품 삭제 api 요청 후 상품 삭제
  deleteButtons.forEach((el) =>
    el.addEventListener("click", async (e) => {
      const productName = e.target.classList[0];
      if (confirm("상품을 삭제하시겠습니까?")) {
        await Api.delete("/api/product/" + productName);
        window.location.href = "/admin/manageProduct/";
      }
    })
  );
}

// api를 통해 상품 전체 목록을 받아온 후 html에 표시
function createProductList(data) {
  return data.map(
    (el) => `<div class="orderItem">
    <span>${el.createdAt.split("T")[0]}</span>
    <span>${el.productName}</span>
    <span>${el.category}</span>
    <span>${el.productContent}</span>
    <span>${el.productPrice.toLocaleString()}</span>
    <button class="${el.foodType} button editButton">수정</button>
    <button class="${el.foodType} button deleteButton">삭제</button>
    </div>`
  );
}

// 추가하기 버튼 클릭 시 실행되는 상품 추가 기능
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

  // api 추가 요청
  console.log(`%cPOST 요청: /api/product/add`, "color: #296aba;");
  console.log(`%cPOST 요청 데이터: /api/product/add`, "color: #296aba;");

  const res = await fetch("/api/product/", {
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

// 상품 추가하기, 수정하기에서 카테고리 목록 조회를 위한 함수
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
  createCategoryList(getData).forEach((el) => {
    addProductCategory.insertAdjacentHTML("beforeend", el);
    editProductCategory.insertAdjacentHTML("beforeend", el);
  });
}

// 상품 전체 목록 api 요청
async function getProductListFromApi() {
  const data = await Api.get("/api/product/list");
  return data;
}
