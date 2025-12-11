import { FullOfferType } from '../../const/type';

export type CartItem = {
  id: number;
  quantity: number;
  data: FullOfferType;
};

export const isValidCartItem = (obj: unknown): obj is CartItem => {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const item = obj as Record<string, unknown>;
  return (
    typeof item.id === 'number' &&
    typeof item.quantity === 'number' &&
    item.data !== null &&
    typeof item.data === 'object'
  );
};

export const isValidCartItemArray = (arr: unknown): arr is CartItem[] => Array.isArray(arr) && arr.every(isValidCartItem);
