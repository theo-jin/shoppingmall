const navbar = document.querySelector("#navbar");
const containerDiv = document.querySelector(".containerDiv");

addAllElements();
// addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  changeNavbar();
  insertTextToLanding();
}

// html에 출력해주는 함수
async function insertTextToLanding() {
  const productId = getProductId();
  const getData = await getDataFromApi(productId);
  createProductDetail(getData).forEach((el) => (containerDiv.innerHTML += el));

  const orderBtn = document.querySelector("#orderBtn");
  const putCartBtn = document.querySelector("#putCartBtn");
  const productCount = document.querySelector("#productCount");
  // 주문정보 넘겨주기
  orderBtn.addEventListener("click", () => {
    const data = {
      count: Number(productCount.value),
      name: getData[0].productName,
      price: getData[0].productPrice,
    };
    sessionStorage.setItem("product", JSON.stringify(data));
    window.location.href = "/order";
  });

  //장바구니 넘겨주기
  putCartBtn.addEventListener("click", () => {
    const productName = getData[0].productName;
    const prevData = JSON.parse(sessionStorage.getItem(productName));
    const data = {
      count: prevData
        ? Number(prevData.count) + Number(productCount.value)
        : Number(productCount.value),
      name: productName,
      price: getData[0].productPrice,
    };

    sessionStorage.setItem(productName, JSON.stringify(data));
    window.location.href = "/cart";
  });
}

// api를 통해 상품 상세 정보를 받아온 후 html에 표시
function createProductDetail(data) {
  return data.map(
    (el) =>
      `<div class="itemBox">
        <img src="${el.productImage}" alt="${el.productName}">
        
      </div>
      <div class="descriptionBox">
        <div class="description">
        <p>${el.productName}</p>
        <hr />
        <p>${el.productContent}</p>
        <p>${el.productPrice.toLocaleString()}원</p>
        </div>
        <div>
          <input id="productCount" type="number" value="1" min="1">
        </div>
        <div class="btnBox">
          <button id="orderBtn">주문하기</button>
          <button id="putCartBtn">장바구니 담기</button>
        </div>
      </div>`
  );
}

// api를 요청하기 위해서 쿼리를 통해 전달받은 카테고리를 변수로 사용
function getProductId() {
  let params = new URL(document.location).searchParams;
  let id = params.get("id");
  return id;
}

//sessionStore 내에 token이 존재할 시 home의 navbar 변경시키는 함수
function changeNavbar() {
  const firstList = navbar.children[0];
  const secondList = navbar.children[1];
  if (sessionStorage.getItem("token")) {
    firstList.innerHTML = "<a href='/userInfo'>계정관리</a>";
    secondList.innerHTML = "<a href='/'>로그아웃</a>";
    secondList.addEventListener("click", () => {
      sessionStorage.removeItem("token");
    });
  }
}

async function getDataFromApi(productId) {
  // const data = await Api.get("/api/product/" + productId);
  const data = [
    {
      _id: "6296fcf15c1216a10e5d9bba",
      productName: "떡볶이",
      productContent: `재료 소개: 고추장 4T, 떡볶이용 떡 500g, 어묵 3장, 대파 1뿌리, 양파 1개, 고춧가루 1T, 다진 마늘 1T, 설탕 1T, 후추 적당량, 식용유 적당량, 다시다 스틱 1개
      STEP1 떡 준비: 떡볶이용 떡을 떼어낸 후 물게 담가둔다.
      STEP2 재료 준비: 어묵, 양파 대파를 먹기 좋은 크기로 썬다.`,
      productPrice: 10000,
      productImage: "http://localhost:5000/image/steak.jpeg",
      category: "한식",
    },
  ];
  return data;
}
