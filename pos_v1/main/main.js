'use strict';
let buildCartItems = (inputs, allItems) => {
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

let buildReceiptItems = (cartItems, promotions)=> {
  return cartItems.map(cartItem=> {
    let promotionType = getPromotionType(cartItem.item.barcode, promotions);
    let {saved, subtotal}=discount(cartItem.count,cartItem.item.price,promotionType);
    return {cartItem, subtotal, saved};
  })
}

let getPromotionType = (barcode, promotions)=> {
  let promotion = promotions.find(promotion=>promotion.barcodes.includes(barcode));

  return promotion ? promotion.type : '';
}

let discount = (count,price, promotionType)=> {
  let subtotal = count*price;
  let saved = 0;

  if (promotionType === 'BUY_TWO_GET_ONE_FREE') {

    saved = parseInt(count/3)*price;
    subtotal -= saved;
  }

  return {saved, subtotal}
}

let buildReceipt = (receiptItems) => {
  let total = 0;
  let save = 0;

  for (let receiptItem of receiptItems) {
    total += receiptItem.subtotal;
    save += receiptItem.saved;
  }

  return {receiptItems, total, save};
};

let printReceipt = (receipt) => {
  let print = '***<没钱赚商店>收据***\n';

  receipt.receiptItems.map(receiptItem=> {
    print += ('名称：' + receiptItem.cartItem.item.name
    + '，数量：' + receiptItem.cartItem.count
    + receiptItem.cartItem.item.unit
    + '，单价：' + receiptItem.cartItem.item.price.toFixed(2)
    + '(元)，小计：' + receiptItem.subtotal.toFixed(2)
    + '(元)\n');

    return print;
  });
  print += '----------------------\n'
    + '总计：' + receipt.total.toFixed(2) + '(元)\n'
    + '节省：' + receipt.save.toFixed(2) + '(元)\n'
    + '**********************';

  return print;
};

let print = (inputs) => {
  let allItems = loadAllItems();
  let promotions = loadPromotions();
  let cartItems = buildCartItems(inputs, allItems);
  let receiptItems = buildReceiptItems(cartItems, promotions);
  let receipt = buildReceipt(receiptItems);
  let print = printReceipt(receipt);

  console.log(print);
}













