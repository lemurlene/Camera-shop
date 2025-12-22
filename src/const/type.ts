import { Categories, Levels, Types } from './const';
import { LoadingStatus } from './enum';

export type Category = keyof typeof Categories | null;
export type Level = keyof typeof Levels;
export type CameraType = keyof typeof Types;

export type CategoryValue = typeof Categories[keyof typeof Categories];
export type LevelValue = typeof Levels[keyof typeof Levels];
export type TypeValue = typeof Types[keyof typeof Types];

export type FiltersType = {
  category: Category;
  level: Level[];
  type: CameraType[];
  minPrice: number | null;
  maxPrice: number | null;
}

export type FullOfferType = {
  id: number;
  name: string;
  vendorCode: string;
  type: TypeValue;
  category: CategoryValue;
  description: string;
  level: LevelValue;
  price: number;
  rating: number;
  reviewCount: number;
  previewImg: string;
  previewImg2x: string;
  previewImgWebp: string;
  previewImgWebp2x: string;
}

export type OfferPromoType = {
  id: number;
  name: string;
  previewImg: string;
  previewImg2x: string;
  previewImgWebp: string;
  previewImgWebp2x: string;
}

export type OfferSearchType = {
  id: number;
  name: string;
}

export type ReviewType = {
  id: string;
  createAt: string;
  cameraId: number;
  userName: string;
  advantage: string;
  disadvantage: string;
  review: string;
  rating: number;
}

export type CouponResponse = {
  data: number;
};

export type OrderRequestData = {
  camerasIds: number[];
  coupon?: string | null;
};

export type ErrorResponse = {
  messages?: string[];
};

export type ReviewPostDto = Omit<ReviewType, 'id' | 'createAt'>;

export type LoadingStatusEnum = typeof LoadingStatus[keyof typeof LoadingStatus];
