export enum SavImportOrder {
  CART_INDEX = 'CART_INDEX',
  RAM_INDEX = 'RAM_INDEX',
}

interface SavImportOption {
  translationKey: string,
  value: SavImportOrder,
}

export const savImportOptions: SavImportOption[] = [
  {
    translationKey: 'importOrders.cartIndex',
    value: SavImportOrder.CART_INDEX,
  },
  {
    translationKey: 'importOrders.ramIndex',
    value: SavImportOrder.RAM_INDEX,
  },
];
