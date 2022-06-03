import * as Api from "/api.js";

const orderList = document.querySelector("#orderlist-container");
const deleteButton = document.getElementsByClassName("deleteButton");
const changeButton = document.getElementsByClassName("changeButton");


getDataFromApi();

// TODO: 데이터 받은거 출력하기
async function getDataFromApi() {
  const data = await Api.get("/api/order/user");

  data.forEach((user)=>{
    const status=user.status;
    const userStatus=""
    if (status=="Information Received"){
      userStatus="주문완료";
    }
    else if (status=="Processing"){
      userStatus="상품준비중"
    }
    else if (status=="Out of Delivery"){
      userStatus="배송준비중"
    }
    else if (status=="In transit"){
      userStatus="배송중"
    }
    else if (status=="Delivered"){
      userStatus="배송완료"
    }
    
    orderList.innerHTML+=
    `<div class="orderList">
    <span>${user.fullName}</span>
    <span>${user.createdAt.substr(0, 10)}</span>
    <span>${user.products}</span>
    <span>
      <select class="requestMessage" id="requestInput">
        <option selected>${userStatus}</option>
        <option>주문완료</option>
        <option>상품준비중</option>
        <option>배송준비중</option>
        <option>배송중</option>
        <option>배송완료</option>
      </select>
    </span>
    <button class="changeButton">변경</button>
    <button class="deleteButton">X</button>
  </div>`})
}

// TODO:취소버튼 누르면 관리자용 api delete하기
async function deleteDataFromApi(e) {
  let target=e.target;
  // await Api.delete("/api/order/"+ target.dataset.orderId);
  target.parentNode.remove();
  alert("주문이 취소되었습니다.");
}

for(var i=0;i<deleteButton.length;i++){
  deleteButton[i].addEventListener("click", deleteDataFromApi);
}

async function postDatatoApi(e){
  let target=e.target;
  target.dataset.status
}
for(var i=0;i<deleteButton.length;i++){
  changeButton[i].addEventListener("click", deleteDataFromApi);
}