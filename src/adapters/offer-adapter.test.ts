import { adaptOfferToClient, adaptOffersToClient } from './';
import { mockServerOffers } from '../mocks/mock-server-offers';

describe('adaptOfferToClient function', () => {
  it('should adapt offer with "Видеокамера" category correctly', () => {
    const serverOffer = mockServerOffers[0];
    const result = adaptOfferToClient(serverOffer);

    expect(result.category).toBe('Видеокамера');
    expect(result.previewImg).toBe('/img/content/das-auge.jpg');
    expect(result.previewImg2x).toBe('/img/content/das-auge@2x.jpg');
    expect(result.previewImgWebp).toBe('/img/content/das-auge.webp');
    expect(result.previewImgWebp2x).toBe('/img/content/das-auge@2x.webp');
    expect(result.id).toBe(serverOffer.id);
    expect(result.name).toBe(serverOffer.name);
    expect(result.type).toBe(serverOffer.type);
  });

  it('should adapt offer with "Фотоаппарат" category to "Фотокамера"', () => {
    const serverOffer = mockServerOffers[1];
    const result = adaptOfferToClient(serverOffer);

    expect(result.category).toBe('Фотокамера');
    expect(result.previewImg).toBe('/img/content/fast-shot.jpg');
    expect(result.previewImg2x).toBe('/img/content/fast-shot@2x.jpg');
    expect(result.previewImgWebp).toBe('/img/content/fast-shot.webp');
    expect(result.previewImgWebp2x).toBe('/img/content/fast-shot@2x.webp');
  });

  it('should normalize all image paths', () => {
    const serverOffer = {
      ...mockServerOffers[0],
      previewImg: 'relative/path.jpg',
      previewImg2x: 'relative/path2x.jpg',
      previewImgWebp: 'relative/path.webp',
      previewImgWebp2x: 'relative/path2x.webp'
    };

    const result = adaptOfferToClient(serverOffer);

    expect(result.previewImg).toBe('/relative/path.jpg');
    expect(result.previewImg2x).toBe('/relative/path2x.jpg');
    expect(result.previewImgWebp).toBe('/relative/path.webp');
    expect(result.previewImgWebp2x).toBe('/relative/path2x.webp');
  });

  it('should preserve all other properties', () => {
    const serverOffer = mockServerOffers[0];
    const result = adaptOfferToClient(serverOffer);

    expect(result.id).toBe(serverOffer.id);
    expect(result.name).toBe(serverOffer.name);
    expect(result.vendorCode).toBe(serverOffer.vendorCode);
    expect(result.type).toBe(serverOffer.type);
    expect(result.description).toBe(serverOffer.description);
    expect(result.level).toBe(serverOffer.level);
    expect(result.price).toBe(serverOffer.price);
    expect(result.rating).toBe(serverOffer.rating);
    expect(result.reviewCount).toBe(serverOffer.reviewCount);
  });
});

describe('adaptOffersToClient function', () => {
  it('should adapt array of server offers to client offers', () => {
    const serverOffers = [mockServerOffers[0], mockServerOffers[1]];
    const result = adaptOffersToClient(serverOffers);

    expect(result).toHaveLength(2);
    expect(result[0].category).toBe('Видеокамера');
    expect(result[1].category).toBe('Фотокамера');
    expect(result[0].previewImg).toBe('/img/content/das-auge.jpg');
    expect(result[1].previewImg).toBe('/img/content/fast-shot.jpg');
  });

  it('should return empty array when input is empty', () => {
    const result = adaptOffersToClient([]);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle single offer array', () => {
    const singleOffer = [mockServerOffers[2]];
    const result = adaptOffersToClient(singleOffer);

    expect(result).toHaveLength(1);
    expect(result[0].category).toBe('Фотокамера');
    expect(result[0].previewImg).toBe('/img/content/instaprinter.jpg');
  });
});

describe('adaptOfferToClient category adaptation', () => {
  it.each([
    ['Видеокамера', 'Видеокамера'],
    ['Фотоаппарат', 'Фотокамера'],
  ])('should adapt category "%s" to "%s"', (inputCategory, expectedCategory) => {
    const serverOffer = {
      ...mockServerOffers[0],
      category: inputCategory
    };

    const result = adaptOfferToClient(serverOffer);
    expect(result.category).toBe(expectedCategory);
  });
});

