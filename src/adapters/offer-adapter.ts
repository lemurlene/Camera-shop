import { FullOfferType, LevelValue, TypeValue } from '../const/type';

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
});

export const adaptOffersToClient = (serverOffers: ServerOffer[]): FullOfferType[] => serverOffers.map(adaptOfferToClient);
