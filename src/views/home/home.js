// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.

import * as Api from "/api.js";
import { changeNavbar } from "/changeNavbar.js";
// 요소(element), input 혹은 상수
const slidesList = document.querySelector(".slides");

addAllElements();
// addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  insertTextToLanding();
  changeNavbar();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
// function addAllEvents() {}

async function insertTextToLanding() {
  const getData = await getDataFromApi();
  createMainpageSlider(getData).forEach((el) => (slidesList.innerHTML += el));
  //이미지 순환을 위해서 첫번째 이미지를 한 번 더 추가해줌
  slidesList.innerHTML += `<li><img src =${getData[0].productImage} alt="밀키트 이미지"></li>`;
}

// api를 통해 상품 상세 정보를 받아온 후 html에 표시
function createMainpageSlider(data) {
  return data.map((el) => `<li><img src =${el.productImage} alt="밀키트 이미지"></li>`);
}

async function getDataFromApi() {
  //db에서 img파일 get 요청
  const data = await Api.get("/api/product/list");
  const slideImage = data.slice(0, 3);
  return slideImage;
}
