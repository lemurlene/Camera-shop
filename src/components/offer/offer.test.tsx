import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Offer from './offer';
import type { FullOfferType } from '../../const/type';

type ProductImageProps = {
  previewImg: string;
  previewImg2x: string;
  previewImgWebp: string;
  previewImgWebp2x: string;
  name: string;
};

type ProductContentProps = {
  name: string;
  rating: number;
  reviewCount: number;
  price: number;
};

type ProductTabsProps = {
  activeTab: string;
  onTabChange: (tab: 'specs' | 'description') => void;
  vendorCode: string;
  category: string;
  type: string;
  level: string;
  description: string;
  id: number;
};

type UseOfferTabsReturn = {
  activeTab: string;
  setTab: (tab: string) => void;
};

const mockUseOfferTabs = vi.fn<[], UseOfferTabsReturn>();
const mockProductImage = vi.fn<ProductImageProps[], JSX.Element>();
const mockProductContent = vi.fn<ProductContentProps[], JSX.Element>();
const mockProductTabs = vi.fn<ProductTabsProps[], JSX.Element>();

vi.mock('./use-offer-tabs', () => ({
  useOfferTabs: () => mockUseOfferTabs(),
}));

vi.mock('./product-image', () => ({
  ProductImage: (props: ProductImageProps) => mockProductImage(props),
}));

vi.mock('./product-content', () => ({
  ProductContent: (props: ProductContentProps) => mockProductContent(props),
}));

vi.mock('./product-tabs', () => ({
  ProductTabs: (props: ProductTabsProps) => mockProductTabs(props),
}));

describe('Offer', () => {
  const mockSetTab = vi.fn();
  const mockOffer: FullOfferType = {
    id: 1,
    name: 'Test Camera',
    vendorCode: 'TEST123',
    type: 'Цифровая',
    category: 'Фотокамера',
    level: 'Нулевой',
    description: 'Test description',
    price: 1000,
    previewImg: 'test.jpg',
    previewImg2x: 'test@2x.jpg',
    previewImgWebp: 'test.webp',
    previewImgWebp2x: 'test@2x.webp',
    rating: 4.5,
    reviewCount: 10,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseOfferTabs.mockReturnValue({
      activeTab: 'description',
      setTab: mockSetTab,
    });

    mockProductImage.mockReturnValue(<div data-testid="product-image" />);
    mockProductContent.mockReturnValue(<div data-testid="product-content" />);
    mockProductTabs.mockReturnValue(<div data-testid="product-tabs" />);
  });

  describe('rendering', () => {
    it('renders all product components', () => {
      render(<Offer offer={mockOffer} />);

      expect(screen.getByTestId('product-image')).toBeInTheDocument();
      expect(screen.getByTestId('product-content')).toBeInTheDocument();
      expect(screen.getByTestId('product-tabs')).toBeInTheDocument();
    });

    it('has correct CSS structure', () => {
      const { container } = render(<Offer offer={mockOffer} />);

      expect(container.querySelector('.product')).toBeInTheDocument();
      expect(container.querySelector('.container')).toBeInTheDocument();
      expect(container.querySelector('.product__content')).toBeInTheDocument();
    });
  });

  describe('props passing', () => {
    it('passes correct image props to ProductImage', () => {
      render(<Offer offer={mockOffer} />);

      expect(mockProductImage).toHaveBeenCalledWith({
        previewImg: mockOffer.previewImg,
        previewImg2x: mockOffer.previewImg2x,
        previewImgWebp: mockOffer.previewImgWebp,
        previewImgWebp2x: mockOffer.previewImgWebp2x,
        name: mockOffer.name,
      });
    });

    it('passes correct content props to ProductContent', () => {
      render(<Offer offer={mockOffer} />);

      expect(mockProductContent).toHaveBeenCalledWith({
        name: mockOffer.name,
        rating: mockOffer.rating,
        reviewCount: mockOffer.reviewCount,
        price: mockOffer.price,
      });
    });

    it('passes correct tab props to ProductTabs', () => {
      render(<Offer offer={mockOffer} />);

      const call = mockProductTabs.mock.calls[0];
      const props = call[0];

      expect(props.activeTab).toBe('description');
      expect(props.vendorCode).toBe(mockOffer.vendorCode);
      expect(props.category).toBe(mockOffer.category);
      expect(props.type).toBe(mockOffer.type);
      expect(props.level).toBe(mockOffer.level);
      expect(props.description).toBe(mockOffer.description);
      expect(props.id).toBe(mockOffer.id);
      expect(typeof props.onTabChange).toBe('function');
    });
  });

  describe('tab functionality', () => {
    it('calls setTab when onTabChange is triggered', () => {
      render(<Offer offer={mockOffer} />);

      const call = mockProductTabs.mock.calls[0];
      const props = call[0];
      const onTabChange = props.onTabChange;

      onTabChange('specs');

      expect(mockSetTab).toHaveBeenCalledWith('specs');
    });

    it('handles different active tab states', () => {
      mockUseOfferTabs.mockReturnValue({
        activeTab: 'specs',
        setTab: mockSetTab,
      });

      render(<Offer offer={mockOffer} />);

      const call = mockProductTabs.mock.calls[0];
      const props = call[0];

      expect(props.activeTab).toBe('specs');
    });
  });
});
