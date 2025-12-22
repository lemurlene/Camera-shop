import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Offer from './offer';
import type { FullOfferType } from '../../const/type';
import { mockOffers } from '../../mocks/mock-offers';

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
  offer: FullOfferType;
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
  setTab: (tab: 'specs' | 'description') => void;
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
  const mockOffer = mockOffers[0];

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

      expect(mockProductImage).toHaveBeenCalledTimes(1);
      const [props] = mockProductImage.mock.calls[0] as unknown as [ProductImageProps];

      expect(props).toEqual({
        previewImg: mockOffer.previewImg,
        previewImg2x: mockOffer.previewImg2x,
        previewImgWebp: mockOffer.previewImgWebp,
        previewImgWebp2x: mockOffer.previewImgWebp2x,
        name: mockOffer.name,
      });
    });

    it('passes correct content props to ProductContent', () => {
      render(<Offer offer={mockOffer} />);

      expect(mockProductContent).toHaveBeenCalledTimes(1);
      const [props] = mockProductContent.mock.calls[0] as unknown as [ProductContentProps];

      expect(props.name).toBe(mockOffer.name);
      expect(props.rating).toBe(mockOffer.rating);
      expect(props.reviewCount).toBe(mockOffer.reviewCount);
      expect(props.price).toBe(mockOffer.price);
      expect(props.offer).toBe(mockOffer);
    });

    it('passes correct tab props to ProductTabs', () => {
      render(<Offer offer={mockOffer} />);

      expect(mockProductTabs).toHaveBeenCalledTimes(1);
      const [props] = mockProductTabs.mock.calls[0] as unknown as [ProductTabsProps];

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

      const [props] = mockProductTabs.mock.calls[0] as unknown as [ProductTabsProps];

      props.onTabChange('specs');
      expect(mockSetTab).toHaveBeenCalledWith('specs');
    });

    it('handles different active tab states', () => {
      mockUseOfferTabs.mockReturnValue({
        activeTab: 'specs',
        setTab: mockSetTab,
      });

      render(<Offer offer={mockOffer} />);

      const [props] = mockProductTabs.mock.calls[0] as unknown as [ProductTabsProps];
      expect(props.activeTab).toBe('specs');
    });
  });
});
