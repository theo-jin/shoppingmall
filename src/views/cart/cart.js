import * as Api from '/api.js';

const purchaseButton = document.querySelector("#purchaseButton");
const totalCost = document.querySelector("#totalCostAndDeliveryFeeValue");


const totalCost = document.querySelector("#totalCostAndDeliveryFeeValue");
const deliveryFee = document.querySelector("#deliveryFeeValue");
const productsCount = document.querySelector("#productsCountValue");
const allSelectCheckBox = document.querySelector("#allSelectCheckBox");


addAllElements();
addAllEvents();


//purchasebutton
async function purchase(e) {
  e.preventDefault();


  try {
    const res = await 
 
  
    window.location.href = '/order';
  } catch (err) {
    alert(err.message);
  }
}
purchaseButton.addEventListener('click', purchase);
