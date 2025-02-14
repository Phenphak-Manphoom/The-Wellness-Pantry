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
