import * as Api from "/api.js";

const orderList = document.querySelector("#orderlist-container");
const deleteButton = document.getElementsByClassName("deleteButton");
const changeButton = document.getElementsByClassName("changeButton");


getDataFromApi();

// TODO: 데이터 받은거 출력하기
async function getDataFromApi() {
  const data = await Api.get("/api/order/list");
  let userStatus='';
  
  // 배송상태 확인
  data.forEach(el=> {
    let productList='';
    const status=el.status;

    console.log(data);
    if (status=="Information Received"){
      console.log(status);
      userStatus="주문완료";
    }
    else if (status=="Processing"){
      userStatus="상품준비중";
    }
    else if (status=="Out of Delivery"){
      userStatus="배송준비중";
    }
    else if (status=="In transit"){
      userStatus="배송중";
    }
    else if (status=="Delivered"){
      userStatus="배송완료";
    }

    el.products.forEach(data=>{
      productList+=" "+ data.productName
    })
    
    orderList.innerHTML+=
    `<div class="orderList">
    <span>${el.fullName}</span>
    <span>${el.createdAt.substr(0, 10)}</span>
    <span>${productList}</span>
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
    <span class="id">${el._id}</span>
  </div>`})

  async function deleteDataFromApi(e) {
    let target=e.target;
    console.log(target.parentNode.children[6].innerHTML);
    const orderId=target.parentNode.children[6].innerHTML;
    await Api.delete("/api/order/"+ orderId);
    target.parentNode.remove();
    alert("주문이 취소되었습니다.");
  }
  
  for(var i=0;i<deleteButton.length;i++){
    deleteButton[i].addEventListener("click", deleteDataFromApi);
  }
}
