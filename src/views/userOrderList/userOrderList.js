const navbar = document.querySelector("#navbar");
const orderList = document.querySelector("#orderlist-container");
const deleteButton = document.getElementsByClassName("deleteButton");
console.log(deleteButton);

const secondList = navbar.children[1];
secondList.addEventListener("click", () => {
  sessionStorage.removeItem("token");
});

// getDataFromApi();

// TODO: 데이터 받은거 출력하기
// async function getDataFromApi() {
//   const data = await Api.get("/api/order/user");

//   data.forEach((user)=>{
//     const status=data.status;
//     const userStatus=""
//     if (status=="Information Received"){
//       userStatus="주문완료";
//     }
//     else if (status=="Processing"){
//       userStatus="상품준비중"
//     }
//     else if (status=="Out of Delivery"){
//       userStatus="배송준비중"
//     }
//     else if (status=="In transit"){
//       userStatus="배송중"
//     }
//     else if (status=="Delivered"){
//       userStatus="배송완료"
//     }
    
//     orderList.innerHTML+=
//     `<div class="orderList">
//       <span>${data.fullName}</span>
//       <span>${data.createdAt.substr(0, 10)}</span>
//       <span>${data.products}/span>
//       <span>${userStatus}</span>
//       <button class="deleteButton">X</button>
//     </div>`})
// }

// TODO:취소버튼 누르면 api delete하기
async function deleteDataFromApi(e) {
  let target=e.target;
  // await Api.delete("/api/order/:orderId", target.dataset.orderId);
  target.parentNode.remove();
  alert("주문이 취소되었습니다.");
}

for(var i=0;i<deleteButton.length;i++){
  deleteButton[i].addEventListener("click", deleteDataFromApi);
}
