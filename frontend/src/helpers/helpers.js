export const getPriceQueryParams = (searchParams, key, value) => {
  const newSearchParams = new URLSearchParams(searchParams);

  // ตรวจสอบว่า value เป็นตัวเลขและไม่เป็นค่าติดลบ
  const numValue = Number(value);
  if (!isNaN(numValue) && numValue >= 0) {
    newSearchParams.set(key, numValue);
  } else {
    newSearchParams.delete(key);
  }

  return newSearchParams;
};

export const calculateOrderCost = (cartItems) => {
  // คำนวณราคาสินค้า
  const itemsPrice = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // คำนวณค่าจัดส่ง
  const shippingPrice = itemsPrice > 200 ? 0 : 25;

  // คำนวณภาษี
  const taxPrice = (itemsPrice * 0.07).toFixed(2);

  // คำนวณราคาสุทธิ
  const totalPrice = (
    parseFloat(itemsPrice) +
    parseFloat(shippingPrice) +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: parseFloat(itemsPrice).toFixed(2),
    shippingPrice,
    taxPrice,
    totalPrice,
  };
};
