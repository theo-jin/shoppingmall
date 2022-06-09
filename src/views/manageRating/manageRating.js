import { changeNavbar } from "/changeNavbar.js";
import * as Api from "/api.js";

// 요소(element), input 혹은 상수
const reviewContainer = document.querySelector("#reviewContainer");

addAllElements();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  changeNavbar();
  const getData = await getDataFromApi();
  const HtmlList = createOrderList(getData);
  HtmlList.forEach((el) => (reviewContainer.innerHTML += el));
  sessionStorage.removeItem("data");
}

// 주문 데이터
async function getDataFromApi() {
  const data = await Api.get("/api/score/list");
  return data;
}

// 별점 데이터
// TODO
// async function getRatingFromApi(productId) {
//   const data = await Api.get("/api/order/user", productId);
//   return data;
// }

// api로 주문 목록 데이터를 받아와서 html로 표시하는 함수
function createOrderList(data) {
  return data.map(
    (el) =>
      `<div class="orderItem">
      <span>${el.orderedAt.split("T")[0]}</span>
      <span>${el.product.productName}</span>
      <span>
        <div class="ratingContainer" id=${el.product.productId}>
          <span class="starSpan oneStar" data-item-id="oneStar">
            <i class="far fa-star"></i>
          </span>
          <span class="starSpan twoStar" data-item-id="twoStar">
            <i class="far fa-star"></i>
          </span>
          <span class="starSpan threeStar" data-item-id="threeStar">
            <i class="far fa-star"></i>
          </span>
          <span class="starSpan fourStar" data-item-id="fourStar">
            <i class="far fa-star"></i>
          </span>
          <span class="starSpan fiveStar" data-item-id="fiveStar">
            <i class="far fa-star"></i>
          </span>
        </div>
      </span>
      <button class="btn add">등록</button>
    </div>`
  );
}

// 레이팅을 숫자로 변환하기 위한 객체
const ratingObj = {
  oneStar: 1,
  twoStar: 2,
  threeStar: 3,
  fourStar: 4,
  fiveStar: 5,
};

document.querySelector("#reviewContainer").addEventListener("click", async (e) => {
  // 평점관련 기능
  const ratingContainer = e.target.closest("div");

  // ratingContainer라는 클래스를 가진 경우에만 실행
  if (ratingContainer.classList.contains("ratingContainer")) {
    const starValue = e.target.closest("span").dataset.itemId;
    const ratingValue = ratingObj[starValue];
    // 빈 별 상태로 초기 렌더링 후 클릭한 별의 갯수에 맞게 색칠된 별을 렌더링
    ratingContainer.innerHTML = `<span class="starSpan oneStar" data-item-id="oneStar">
    <i class="far fa-star"></i>
    </span>
  <span class="starSpan twoStar" data-item-id="twoStar">
    <i class="far fa-star"></i>
  </span>
  <span class="starSpan threeStar" data-item-id="threeStar">
    <i class="far fa-star"></i>
  </span>
  <span class="starSpan fourStar" data-item-id="fourStar">
    <i class="far fa-star"></i>
  </span>
  <span class="starSpan fiveStar" data-item-id="fiveStar">
    <i class="far fa-star"></i>
  </span>`;

    for (let i = 0; i < ratingValue; i++) {
      ratingContainer.children[i].innerHTML = "<i class='fas fa-star'></i>";
    }
    const data = {
      productId: ratingContainer.id,
      reviewScore: ratingValue,
    };
    sessionStorage.setItem("data", JSON.stringify(data));
  }
  // 등록, 수정 관련 기능
  // 등록
  /* if (e.target.classList.contains("add")) {
    try {
      const data = JSON.parse(sessionStorage.getItem("data"));
      await Api.post("/api/score/", data);
      alert("별점이 등록되었습니다.");
      window.location.href = "/userInfo/review/";
    } catch (err) {
      alert(err);
    }
  } */

  // TODO 수정 기능 추후 추가 예정
  // 등록
  if (e.target.classList.contains("add")) {
    try {
      const data = JSON.parse(sessionStorage.getItem("data"));
      console.log(data)
      await Api.patch("/api/score", data.productId, data);
      alert("별점이 수정되었습니다.");
      window.location.href = "/userInfo/review/";
    } catch (err) {
      alert(err);
    }
  }
});
