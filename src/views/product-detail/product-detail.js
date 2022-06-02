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
  // console.log(productId);
}

// api를 통해 상품 상세 정보를 받아온 후 html에 표시
function createProductDetail(data) {
  return data.map(
    (el) =>
      `<div class="item-box">
        <img src="${el.productImage}" alt="${el.productName}">
        
      </div>
      <div class="item-box">
        <p>${el.productName}</p>
        <p>${el.productContent}</p>
        <p>${el.productPrice}</p>
        <button>주문하기</button>
        <button>장바구니 담기</button>
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
      productContent: "국민간식",
      productPrice: 10000,
      productImage: "ddukboke.jpg",
      category: "한식",
    },
  ];
  return data;
}
