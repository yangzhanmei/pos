'use strict';

function printReceipt (inputs) {
  let allItems = loadAllItems();
  let promotions = loadPromotions();
  let cartItems = buildCartItems(inputs, allItems);
  let receiptItems = buildReceiptItems(cartItems, promotions);
  let receipt = buildReceipt(receiptItems);
  let receiptText = buildReceiptText(receipt);

  console.log(receiptText);
}

function buildCartItems (inputs, allItems){
  let cartItems = [];

  for (let input of inputs) {
    let splittedInput = input.split('-');
    let barcode = splittedInput[0];
    let count = parseInt(splittedInput[1] || 1);
    let cartItem = cartItems.find((cartItem) => cartItem.item.barcode === barcode);

    if (cartItem) {
      cartItem.count += count;
    }
    else {
      let item = allItems.find((item) => item.barcode === barcode);

      cartItems.push({item: item, count: count});
    }
  }

  return cartItems;
};

function buildReceiptItems (cartItems, promotions) {
  return cartItems.map(cartItem=> {
    let promotionType = getPromotionType(cartItem.item.barcode, promotions);
    let {saved, subtotal}=discount(cartItem.count,cartItem.item.price,promotionType);
    return {cartItem, subtotal, saved};
  })
}

function getPromotionType  (barcode, promotions){
  let promotion = promotions.find(promotion=>promotion.barcodes.includes(barcode));

  return promotion ? promotion.type : '';
}

function discount (count,price, promotionType) {
  let subtotal = count*price;
  let saved = 0;

  if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
    saved = parseInt(count/3)*price;
    subtotal -= saved;
  }

  return {saved, subtotal}
}

function buildReceipt (receiptItems) {
  let total = 0;
  let save = 0;

  for (let receiptItem of receiptItems) {
    total += receiptItem.subtotal;
    save += receiptItem.saved;
  }

  return {receiptItems, total, save};
};

function buildReceiptText (receipt) {
  let receiptText = receipt.receiptItems.map(receiptItem=> {
    const cartItem = receiptItem.cartItem;
    return `名称：${cartItem.item.name}，\
数量：${cartItem.count}${cartItem.item.unit}，\
单价：${formatMoney(cartItem.item.price)}(元)，\
小计：${formatMoney(receiptItem.subtotal)}(元)`;
  }).join('\n');

  return `***<没钱赚商店>收据***
${receiptText}
----------------------
总计：${formatMoney(receipt.total)}(元)
节省：${formatMoney(receipt.save)}(元)
**********************`;
}

function formatMoney(money) {
  return money.toFixed(2);
}













