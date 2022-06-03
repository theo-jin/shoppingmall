import * as Api from "/api.js";

const navbar = document.querySelector("#navbar");
const orderList = document.querySelector("#orderlist-container");
const deleteButton = document.getElementsByClassName("deleteButton");

const secondList = navbar.children[1];
secondList.addEventListener("click", () => {
  sessionStorage.removeItem("token");
});

getDataFromApi();

async function getDataFromApi() {
  const data = await Api.get("/api/order/user");
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

    // TODO: 장바구니 데이터 들어오면 수정필요
    // 상품리스트 출력
    el.products.forEach(data=>{
      productList+=" "+ data.productName
    })
    
    orderList.innerHTML+=
    `<div class="orderList">
      <span>${el.fullName}</span>
      <span>${el.createdAt.substr(0, 10)}</span>
      <span>${productList}</span>
      <span>${userStatus}</span>
      <button class="deleteButton">X</button>
       <span class="id">${el._id}</span>
    </div>`});

    // 취소버튼 누르면 주문데이터 삭제
    async function deleteDataFromApi(e) {
      let target=e.target;
      console.log(target.parentNode.children[5].innerHTML);
      const orderId=target.parentNode.children[5].innerHTML;
      await Api.delete("/api/order/"+ orderId);
      target.parentNode.remove();
      alert("주문이 취소되었습니다.");
    }
    
    for(var i=0;i<deleteButton.length;i++){
      deleteButton[i].addEventListener("click", deleteDataFromApi);
    }
  }
 


