import { Categories, Levels, Types } from './const';

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

type NotCardType = {
  vendorCode: string;
  description: string;
}

export type CardType = Omit<FullOfferType, keyof NotCardType>;

export type OfferPromoType = {
  id: number;
  name: string;
  previewImg: string;
  previewImg2x: string;
  previewImgWebp: string;
  previewImgWebp2x: string;
}
