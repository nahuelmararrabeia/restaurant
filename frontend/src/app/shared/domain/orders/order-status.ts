
  export const ORDER_STATUS = {
  Pending: 'Pending',
  Preparing: 'Preparing',
  Ready: 'Ready',
  Delivered: 'Delivered',
  Paid: 'Paid',
  Cancelled: 'Cancelled'
} as const;

export type OrderStatus =
  typeof ORDER_STATUS[keyof typeof ORDER_STATUS];