import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductSlider from './product-slider';
import type { FullOfferType } from '../../const/type';

vi.mock('swiper/react', () => ({
  Swiper: vi.fn(({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="swiper" className={className}>
      {children}
    </div>
  )),
  SwiperSlide: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper-slide">
      {children}
    </div>
  )),
}));

vi.mock('../card', () => ({
  CardMemo: vi.fn(() => <div data-testid="card">Card</div>),
}));

vi.mock('./navigation-button', () => ({
  default: vi.fn(({ direction }: { direction: string }) => (
    <button data-testid={`navigation-${direction}`}>Nav</button>
  )),
}));

vi.mock('swiper/modules');
vi.mock('swiper/css');
vi.mock('swiper/css/navigation');

vi.mock('../../const/const', () => ({
  Setting: {
    ProductSimilarCount: 3,
  },
}));

describe('ProductSlider', () => {
  const mockOffers: FullOfferType[] = [
    {
      id: 1,
      name: 'Camera 1',
      vendorCode: 'CAM001',
      type: 'Цифровая',
      category: 'Фотокамера',
      level: 'Любительский',
      description: 'Test description 1',
      price: 1000,
      previewImg: 'img1.jpg',
      previewImg2x: 'img1@2x.jpg',
      previewImgWebp: 'img1.webp',
      previewImgWebp2x: 'img1@2x.webp',
      rating: 4.5,
      reviewCount: 10,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders slider with cards and navigation', () => {
    render(<ProductSlider offers={mockOffers} />);

    expect(screen.getByTestId('swiper')).toBeInTheDocument();
    expect(screen.getByTestId('swiper-slide')).toBeInTheDocument();
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-prev')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-next')).toBeInTheDocument();
  });

  it('renders without offers', () => {
    render(<ProductSlider offers={[]} />);

    expect(screen.getByTestId('swiper')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-prev')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-next')).toBeInTheDocument();
  });
});
