import { FullOfferType, LevelValue, TypeValue } from '../const/type';
import { normalizeImagePath } from './utils';

type ServerOffer = {
  id: number;
  category: string;
  name: string;
  vendorCode: string;
  type: TypeValue;
  description: string;
  level: LevelValue;
  price: number;
  rating: number;
  reviewCount: number;
  previewImg: string;
  previewImg2x: string;
  previewImgWebp: string;
  previewImgWebp2x: string;
};

export const adaptOfferToClient = (serverOffer: ServerOffer): FullOfferType => ({
  ...serverOffer,
  category: serverOffer.category === 'Фотоаппарат' ? 'Фотокамера' : 'Видеокамера',
  previewImg: normalizeImagePath(serverOffer.previewImg),
  previewImg2x: normalizeImagePath(serverOffer.previewImg2x),
  previewImgWebp: normalizeImagePath(serverOffer.previewImgWebp),
  previewImgWebp2x: normalizeImagePath(serverOffer.previewImgWebp2x),
});

export const adaptOffersToClient = (serverOffers: ServerOffer[]): FullOfferType[] => serverOffers.map(adaptOfferToClient);
