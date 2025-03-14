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
  const itemsPrice = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingPrice = itemsPrice > 200 ? 0 : 25;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  return {
    itemsPrice: Number(itemsPrice).toFixed(2),
    shippingPrice,
    taxPrice,
    totalPrice,
  };
};
