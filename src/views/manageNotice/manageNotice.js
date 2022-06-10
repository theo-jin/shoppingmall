import { changeNavbar } from "/changeNavbar.js";
import * as Api from "/api.js";

const mainContainer = document.querySelector(".mainContainer");
const addNotice = document.querySelector("#addNotice");
const addModal = document.querySelector("#addModal");
const editModal = document.querySelector("#editModal");
const addModalClose = document.querySelector("#addModalClose");
const editModalClose = document.querySelector("#editModalClose");
const addBtn = document.querySelector("#addBtn");
const editBtn = document.querySelector("#editBtn");
const addNoticeName = document.querySelector("#noticeName1");
const addNoticeDescription = document.querySelector("#noticeDescription1");
const editNoticeName = document.querySelector("#noticeName2");
const editNoticeDescription = document.querySelector("#noticeDescription2");

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  noticeLanding();
  changeNavbar();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  // 공지 추가를 위한 모달창 컨트롤러
  addNotice.addEventListener("click", () => {
    addModal.classList.add("is-active");
  });
  addModalClose.addEventListener("click", () => {
    addModal.classList.remove("is-active");
  });

  // 공지 수정을 위한 모달창 컨트롤러
  editModalClose.addEventListener("click", () => {
    editModal.classList.remove("is-active");
  });

  // 공지 추가 이벤트 리스너
  addBtn.addEventListener("click", addNoticeFn);
}

// html에 공지 목록을 출력해주는 함수
async function noticeLanding() {
  const getData = await getDataFromApi();
  createNoticeList(getData).forEach((el) => mainContainer.insertAdjacentHTML("beforeend", el));
  const deleteButtons = document.querySelectorAll(".deleteButton");
  const editButtons = document.querySelectorAll(".editButton");

  // 클릭 시 공지 수정 모달창 열림
  editButtons.forEach((el) =>
    el.addEventListener("click", async (e) => {
      editModal.classList.add("is-active");
      const prevNotice = e.target.parentNode.parentNode.querySelectorAll("div")[1].innerHTML;
      const noticeId = e.target.parentNode.parentNode.id;
      editNoticeName.value = prevNotice;

      // 공지 수정 이벤트 리스너
      editBtn.addEventListener("click", async () => {
        const data = {
          // title이 같다면 title의 설명만 변경하도록 title 값을 null로 지정
          title: editNoticeName.value === prevNotice ? null : editNoticeName.value,
          content: editNoticeDescription.value,
        };
        try {
          await Api.patch("/api/notice", noticeId, data);
          window.location.href = "/manageNotice/";
        } catch (err) {
          alert(err);
        }
      });
    })
  );

  // 클릭 시 공지 삭제 api 요청 후 카테고리 삭제
  deleteButtons.forEach((el) =>
    el.addEventListener("click", async (e) => {
      const noticeId = e.target.parentNode.parentNode.id;
      if (confirm("공지를 삭제하시겠습니까?")) {
        await Api.delete("/api/notice/" + noticeId);
        alert("공지가 삭제되었습니다.");
        window.location.href = "/manageNotice/";
      }
    })
  );
}

//공지 추가 함수
async function addNoticeFn() {
  const data = {
    title: addNoticeName.value,
    content: addNoticeDescription.value,
  };
  try {
    await Api.post("/api/notice/", data);
    alert("공지가 추가되었습니다.");
    window.location.href = "/manageNotice";
  } catch (err) {
    alert(err);
  }
}

// api를 통해 상품 정보를 받아온 후 html에 표시
function createNoticeList(data) {
  return data.map(
    (el) => `
  <div class="columns textContent" id=${el._id}>
    <div class="column is-2">${el.createdAt.split("T")[0]}</div>
    <div class="column is-2 order-summary">${el.title}</div>
    <div class="column is-6">${el.content}</div>
    <div class="column is-1">
      <button class="button editButton">수정</button>
    </div>
    <div class="column is-1">
      <button class="button deleteButton">삭제</button>
    </div>
  </div>
  `
  );
}

// 공지 목록 api 요청
async function getDataFromApi() {
  const data = await Api.get("/api/notice/list");
  return data;
}
