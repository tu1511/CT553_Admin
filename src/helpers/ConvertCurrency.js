export const toVietnamCurrencyFormat = (value) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value) +
  "đ";
