import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import type { FullOfferType } from '../../const/type';
import { Setting } from '../../const/const';
import { mockOffers } from '../../mocks/mock-offers';

type SwiperNavigation = {
  nextEl: string;
  prevEl: string;
};

type SwiperProps = {
  children?: ReactNode;
  modules: unknown[];
  navigation: SwiperNavigation;
  slidesPerView: number;
  slidesPerGroup: number;
  speed: number;
  watchOverflow?: boolean;
  className?: string;
};

type CardProps = {
  card: FullOfferType;
  isSlide?: boolean;
  'data-testid'?: string;
};

type NavBtnProps = {
  direction: 'prev' | 'next';
};

const { mockSwiper, mockCardMemo, mockNavBtn } = vi.hoisted(() => ({
  mockSwiper: vi.fn<[SwiperProps], void>(),
  mockCardMemo: vi.fn<[CardProps], void>(),
  mockNavBtn: vi.fn<[NavBtnProps], void>(),
}));

vi.mock('swiper/css', () => ({}));
vi.mock('swiper/css/navigation', () => ({}));

vi.mock('swiper/modules', () => ({
  Navigation: {},
}));

vi.mock('swiper/react', () => ({
  Swiper: (props: SwiperProps) => {
    const {
      children,
      modules,
      navigation,
      slidesPerView,
      slidesPerGroup,
      speed,
      watchOverflow,
      className,
    } = props;

    mockSwiper({
      children,
      modules,
      navigation,
      slidesPerView,
      slidesPerGroup,
      speed,
      watchOverflow,
      className,
    });

    return <div data-testid="swiper">{children}</div>;
  },

  SwiperSlide: (props: { children?: ReactNode }) => (
    <div data-testid="swiper-slide">{props.children}</div>
  ),
}));

vi.mock('../card', () => ({
  CardMemo: (props: CardProps) => {
    const { card, isSlide, 'data-testid': testId } = props;
    void isSlide;

    mockCardMemo({ card, isSlide, 'data-testid': testId });

    return <div data-testid={testId ?? 'card'}>{card.name}</div>;
  },
}));

vi.mock('./navigation-button', () => ({
  default: (props: NavBtnProps) => {
    const { direction } = props;

    mockNavBtn({ direction });

    return <button data-testid={`nav-${direction}`}>{direction}</button>;
  },
}));

import ProductSlider from './product-slider';

describe('ProductSlider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Swiper, slides, cards and navigation buttons', () => {
    const offers = mockOffers;

    render(<ProductSlider offers={offers} />);

    expect(screen.getByTestId('swiper')).toBeInTheDocument();
    expect(screen.getAllByTestId('swiper-slide')).toHaveLength(offers.length);
    expect(screen.getAllByTestId('card')).toHaveLength(offers.length);
    expect(screen.getByText('Ретрокамера Dus Auge lV')).toBeInTheDocument();

    expect(screen.getByTestId('nav-prev')).toBeInTheDocument();
    expect(screen.getByTestId('nav-next')).toBeInTheDocument();

    expect(mockNavBtn).toHaveBeenCalledTimes(2);
    expect(mockNavBtn).toHaveBeenCalledWith({ direction: 'prev' });
    expect(mockNavBtn).toHaveBeenCalledWith({ direction: 'next' });
  });

  it('passes correct props into Swiper', () => {
    render(<ProductSlider offers={mockOffers} />);

    expect(mockSwiper).toHaveBeenCalledTimes(1);

    const swiperProps = mockSwiper.mock.calls[0][0];

    expect(swiperProps.className).toBe('product-similar__slider-list');
    expect(swiperProps.speed).toBe(500);
    expect(swiperProps.watchOverflow).toBe(true);

    expect(swiperProps.slidesPerView).toBe(Setting.ProductSimilarCount);
    expect(swiperProps.slidesPerGroup).toBe(Setting.ProductSimilarCount);

    expect(swiperProps.navigation).toEqual({
      nextEl: '.product-similar__slider .slider-controls--next',
      prevEl: '.product-similar__slider .slider-controls--prev',
    });
  });

  it('calls CardMemo for each offer with correct card ids', () => {
    const offers = mockOffers;

    render(<ProductSlider offers={offers} />);

    expect(mockCardMemo).toHaveBeenCalledTimes(offers.length);

    const calledIds = mockCardMemo.mock.calls.map(([props]) => props.card.id);
    expect(calledIds).toContain(5);
    expect(calledIds).toContain(6);
  });
});
