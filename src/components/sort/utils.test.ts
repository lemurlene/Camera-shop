import { describe, it, expect } from 'vitest';
import { sortOffers, sortOffersSearch } from './utils';
import type { FullOfferType, OfferSearchType } from '../../const/type';

describe('sortOffers', () => {
  const mockOffers: FullOfferType[] = [
    {
      id: 1,
      name: 'Camera C',
      vendorCode: '003',
      type: 'Цифровая',
      category: 'Фотокамера',
      level: 'Любительский',
      description: 'Description C',
      price: 500,
      previewImg: 'img3.jpg',
      previewImg2x: 'img3@2x.jpg',
      previewImgWebp: 'img3.webp',
      previewImgWebp2x: 'img3@2x.webp',
      rating: 3.0,
      reviewCount: 5,
    },
    {
      id: 2,
      name: 'Camera A',
      vendorCode: '001',
      type: 'Цифровая',
      category: 'Фотокамера',
      level: 'Профессиональный',
      description: 'Description A',
      price: 1000,
      previewImg: 'img1.jpg',
      previewImg2x: 'img1@2x.jpg',
      previewImgWebp: 'img1.webp',
      previewImgWebp2x: 'img1@2x.webp',
      rating: 4.5,
      reviewCount: 10,
    },
    {
      id: 3,
      name: 'Camera B',
      vendorCode: '002',
      type: 'Плёночная',
      category: 'Фотокамера',
      level: 'Любительский',
      description: 'Description B',
      price: 800,
      previewImg: 'img2.jpg',
      previewImg2x: 'img2@2x.jpg',
      previewImgWebp: 'img2.webp',
      previewImgWebp2x: 'img2@2x.webp',
      rating: 4.0,
      reviewCount: 8,
    },
  ];

  it('should sort by price in ascending order', () => {
    const result = sortOffers(mockOffers, 'Price', 'asc');

    expect(result[0].price).toBe(500);
    expect(result[1].price).toBe(800);
    expect(result[2].price).toBe(1000);
  });

  it('should sort by price in descending order', () => {
    const result = sortOffers(mockOffers, 'Price', 'desc');

    expect(result[0].price).toBe(1000);
    expect(result[1].price).toBe(800);
    expect(result[2].price).toBe(500);
  });

  it('should sort by popularity in ascending order (lowest rating first)', () => {
    const result = sortOffers(mockOffers, 'Popular', 'asc');

    expect(result[0].rating).toBe(4.5);
    expect(result[1].rating).toBe(4.0);
    expect(result[2].rating).toBe(3.0);
  });

  it('should sort by popularity in descending order (highest rating first)', () => {
    const result = sortOffers(mockOffers, 'Popular', 'desc');

    expect(result[0].rating).toBe(3.0);
    expect(result[1].rating).toBe(4.0);
    expect(result[2].rating).toBe(4.5);
  });

  it('should not mutate original array', () => {
    const original = [...mockOffers];
    const result = sortOffers(mockOffers, 'Price', 'asc');

    expect(result).not.toBe(mockOffers);
    expect(mockOffers).toEqual(original);
  });

  it('should handle empty array', () => {
    const result = sortOffers([], 'Price', 'asc');

    expect(result).toEqual([]);
  });

  it('should handle single item array', () => {
    const singleOffer = [mockOffers[0]];
    const result = sortOffers(singleOffer, 'Price', 'asc');

    expect(result).toEqual(singleOffer);
    expect(result).not.toBe(singleOffer);
  });
});

describe('sortOffersSearch', () => {
  const mockSearchOffers: OfferSearchType[] = [
    {
      id: 3,
      name: 'Canon EOS',
    },
    {
      id: 1,
      name: 'Nikon D850',
    },
    {
      id: 2,
      name: 'Sony Alpha',
    },
  ];

  it('should sort search offers alphabetically by name', () => {
    const result = sortOffersSearch(mockSearchOffers);

    expect(result[0].name).toBe('Canon EOS');
    expect(result[1].name).toBe('Nikon D850');
    expect(result[2].name).toBe('Sony Alpha');
  });

  it('should not mutate original array', () => {
    const original = [...mockSearchOffers];
    const result = sortOffersSearch(mockSearchOffers);

    expect(result).not.toBe(mockSearchOffers);
    expect(mockSearchOffers).toEqual(original);
  });

  it('should handle empty array for search offers', () => {
    const result = sortOffersSearch([]);

    expect(result).toEqual([]);
  });

  it('should handle single item array for search offers', () => {
    const singleOffer = [mockSearchOffers[0]];
    const result = sortOffersSearch(singleOffer);

    expect(result).toEqual(singleOffer);
    expect(result).not.toBe(singleOffer);
  });
});
