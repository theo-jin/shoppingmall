const purchaseButton = document.querySelector("#purchaseButton");
const cart = document.querySelector("#cart");
const productsCountValue = document.querySelector("#productsCountValue");
const productCostValue = document.querySelector("#productCostValue");
const deliveryFeeValue = document.querySelector("#deliveryFeeValue");
const totalCostValue = document.querySelector("#totalCostValue");
const cartContainer = document.querySelector("#cartContainer");
const selectDelete = document.querySelector("#selectDelete");






// 구매버튼
async function purchase(e) {
  e.preventDefault();
  if (!confirm(ㅇ)) return;

  console.log(data);

  try {

    //주문창으로 이동.
    window.location.href = "/order";
  } catch (err) {
    alert(`${err.message}`);
  }
}
purchaseButton.addEventListener("click", purchase);