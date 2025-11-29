import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BannerPromo from './banner-promo';
import { Setting } from '../../const/const';
import { mockPromoOffers } from '../../mocks/mock-promo-offers';

vi.mock('swiper/react', () => ({
  Swiper: ({
    children,
    autoplay,
    pagination,
    loop,
    ...props
  }: {
    children: React.ReactNode;
    autoplay?: unknown;
    pagination?: unknown;
    loop?: boolean;
    [key: string]: unknown;
  }) => (
    <div
      data-testid="swiper"
      data-autoplay={JSON.stringify(autoplay)}
      data-pagination={JSON.stringify(pagination)}
      data-loop={loop}
      {...props}
    >
      {children}
    </div>
  ),
  SwiperSlide: ({ children, ...props }: { children: React.ReactNode;[key: string]: unknown }) => (
    <div data-testid="swiper-slide" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('swiper/modules', () => ({
  Autoplay: vi.fn(),
  Pagination: vi.fn(),
}));

vi.mock('swiper/css', () => ({}));
vi.mock('swiper/css/pagination', () => ({}));
vi.mock('swiper/css/autoplay', () => ({}));
vi.mock('./style.css', () => ({}));

describe('BannerPromo component', () => {
  const renderWithRouter = (component: React.ReactElement) => render(<BrowserRouter>{component}</BrowserRouter>);

  it('renders correct number of slides limited by MaxShowPromo', () => {
    renderWithRouter(<BannerPromo offersPromo={mockPromoOffers} />);

    const slides = screen.getAllByTestId('swiper-slide');
    expect(slides).toHaveLength(Setting.MaxShowPromo);
  });

  it('renders all offers when less than MaxShowPromo', () => {
    const offers = mockPromoOffers.slice(0, 2);
    renderWithRouter(<BannerPromo offersPromo={offers} />);

    const slides = screen.getAllByTestId('swiper-slide');
    expect(slides).toHaveLength(2);
  });

  it('renders offer information correctly', () => {
    const offers = [mockPromoOffers[0]];
    renderWithRouter(<BannerPromo offersPromo={offers} />);

    expect(screen.getByAltText(offers[0].name)).toBeInTheDocument();
    expect(screen.getByText(offers[0].name)).toBeInTheDocument();
    expect(screen.getByText('Новинка!')).toBeInTheDocument();
    expect(screen.getByText('Профессиональная камера от известного производителя')).toBeInTheDocument();
    expect(screen.getByText('Подробнее')).toBeInTheDocument();
  });

  it('applies autoplay and pagination when multiple offers', () => {
    const offers = mockPromoOffers.slice(0, 2);
    renderWithRouter(<BannerPromo offersPromo={offers} />);

    const swiper = screen.getByTestId('swiper');

    expect(swiper).toHaveAttribute('data-autoplay');
    expect(swiper).toHaveAttribute('data-pagination');
    expect(swiper).toHaveAttribute('data-loop', 'true');

    const autoplayConfig = JSON.parse(
      swiper.getAttribute('data-autoplay') || '{}'
    ) as { delay: number; disableOnInteraction: boolean };

    expect(autoplayConfig).toMatchObject({
      delay: 3000,
      disableOnInteraction: false,
    });
  });

  it('disables autoplay and pagination when single offer', () => {
    const offers = [mockPromoOffers[0]];
    renderWithRouter(<BannerPromo offersPromo={offers} />);

    const swiper = screen.getByTestId('swiper');

    expect(swiper).toHaveAttribute('data-autoplay', 'false');
    expect(swiper).toHaveAttribute('data-pagination', 'false');
    expect(swiper).toHaveAttribute('data-loop', 'false');
  });

  it('renders correct image sources', () => {
    const offers = [mockPromoOffers[0]];
    renderWithRouter(<BannerPromo offersPromo={offers} />);

    const image = screen.getByAltText(offers[0].name);
    expect(image).toHaveAttribute('src', offers[0].previewImg);
    expect(image).toHaveAttribute('srcset', `${offers[0].previewImg2x} 2x`);
  });

  it('renders correct link for each offer', () => {
    const offers = mockPromoOffers.slice(0, 2);
    renderWithRouter(<BannerPromo offersPromo={offers} />);

    const links = screen.getAllByText('Подробнее');
    expect(links).toHaveLength(2);

    offers.forEach((offer, index) => {
      expect(links[index]).toHaveAttribute('href', `/catalog/${offer.id}`);
    });
  });

  it('applies correct CSS classes', () => {
    const offers = [mockPromoOffers[0]];
    renderWithRouter(<BannerPromo offersPromo={offers} />);

    const swiper = screen.getByTestId('swiper');
    expect(swiper).toHaveClass('banner-swiper');
    expect(swiper).toHaveClass('container');

    expect(screen.getByText('Новинка!')).toHaveClass('banner__message');
    expect(screen.getByText(offers[0].name)).toHaveClass('title', 'title--h1');
  });

  it('renders empty state when no offers', () => {
    renderWithRouter(<BannerPromo offersPromo={[]} />);

    const swiper = screen.getByTestId('swiper');
    expect(swiper).toBeInTheDocument();

    const slides = screen.queryAllByTestId('swiper-slide');
    expect(slides).toHaveLength(0);
  });
});
