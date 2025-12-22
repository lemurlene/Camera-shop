import type { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MainPage from './main-page';
import type { FullOfferType } from '../../const/type';

type PriceRange = { min: number; max: number };

type FilteredProductsReturn = {
  filteredProducts: FullOfferType[];
  filteredPriceRange: PriceRange;
};

type PaginationArgs = {
  totalItems: number;
  itemsPerPage: number;
};

type PaginationReturn = {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
};

type UseUrlReturn = {
  setParam: (key: string, value: string | null) => void;
};

type BannerPromoProps = { offersPromo: unknown };

type CatalogFiltersProps = { priceRange: PriceRange };

type PaginationProps = { totalItems: number; itemsPerPage: number };

const {
  mockUseFilteredProducts,
  mockUseAppSelector,
  mockUsePagination,
  mockUsePriceSync,
  mockUseUrl,
  mockBannerPromo,
  mockBreadcrumbs,
  mockCatalogFilters,
  mockMainEmpty,
  mockSort,
  mockCardList,
  mockPagination,
} = vi.hoisted(() => ({
  mockUseFilteredProducts: vi.fn<[], FilteredProductsReturn>(),
  mockUseAppSelector: vi.fn<[unknown], unknown>(),
  mockUsePagination: vi.fn<[PaginationArgs], PaginationReturn>(),
  mockUsePriceSync: vi.fn<[], void>(),
  mockUseUrl: vi.fn<[], UseUrlReturn>(),
  mockBannerPromo: vi.fn<[BannerPromoProps], void>(),
  mockBreadcrumbs: vi.fn<[], void>(),
  mockCatalogFilters: vi.fn<[CatalogFiltersProps], void>(),
  mockMainEmpty: vi.fn<[], void>(),
  mockSort: vi.fn<[], void>(),
  mockCardList: vi.fn<[Record<string, unknown>], void>(),
  mockPagination: vi.fn<[PaginationProps], void>(),
}));

vi.mock('../../store/offers-promo', () => ({
  selectOffersPromo: vi.fn(),
}));

vi.mock('../../const/const', () => ({
  Setting: {
    CardsCountOnCatalog: 9,
  },
}));

vi.mock('../../hooks', () => ({
  useFilteredProducts: (): FilteredProductsReturn => mockUseFilteredProducts(),

  useAppSelector: (selector: unknown): unknown => mockUseAppSelector(selector),

  usePagination: (args: PaginationArgs): PaginationReturn => mockUsePagination(args),

  usePriceSync: (): void => {
    mockUsePriceSync();
  },
}));

vi.mock('../../contexts', () => ({
  useUrl: (): UseUrlReturn => mockUseUrl(),
}));

vi.mock('../../components/banner-promo', () => ({
  default: (props: BannerPromoProps) => {
    mockBannerPromo(props);
    return <div data-testid="banner-promo" />;
  },
}));

vi.mock('../../components/breadcrumbs', () => ({
  default: () => {
    mockBreadcrumbs();
    return <nav data-testid="breadcrumbs" />;
  },
}));

vi.mock('../../components/catalog-filters', () => ({
  default: (props: CatalogFiltersProps) => {
    mockCatalogFilters(props);
    return <aside data-testid="catalog-filters" />;
  },
}));

vi.mock('./main-empty', () => ({
  default: () => {
    mockMainEmpty();
    return <div data-testid="main-empty" />;
  },
}));

vi.mock('../../components/sort', () => ({
  default: () => {
    mockSort();
    return <div data-testid="sort" />;
  },
}));

vi.mock('../../components/card', () => ({
  CardListMemo: (props: Record<string, unknown>) => {
    mockCardList(props);
    return <div data-testid="card-list" />;
  },
}));

vi.mock('../../components/pagination', () => ({
  default: (props: PaginationProps) => {
    mockPagination(props);
    return <div data-testid="pagination" />;
  },
}));

vi.mock('../../components/wrappers', () => ({
  FilterSyncWrapper: ({ children }: { children: ReactNode }) => (
    <div data-testid="filter-sync-wrapper">{children}</div>
  ),
}));

const makeOffer = (id: number): FullOfferType => ({
  id,
  name: `Camera ${id}`,
  vendorCode: `CODE${id}`,
  type: 'Цифровая',
  category: 'Фотокамера',
  description: `Desc ${id}`,
  level: 'Нулевой',
  price: 1000 + id,
  rating: 4,
  reviewCount: 10,
  previewImg: `img-${id}.jpg`,
  previewImg2x: `img-${id}@2x.jpg`,
  previewImgWebp: `img-${id}.webp`,
  previewImgWebp2x: `img-${id}@2x.webp`,
});

describe('MainPage', () => {
  const mockSetParam = vi.fn<[string, string | null], void>();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseUrl.mockReturnValue({ setParam: mockSetParam });

    mockUseAppSelector.mockReturnValue([{ id: 999 }]);

    mockUseFilteredProducts.mockReturnValue({
      filteredProducts: [makeOffer(1), makeOffer(2), makeOffer(3)],
      filteredPriceRange: { min: 100, max: 2000 },
    });

    mockUsePagination.mockReturnValue({
      currentPage: 1,
      totalPages: 2,
      startIndex: 0,
      endIndex: 2,
    });
  });

  it('renders base layout and non-empty catalog state', () => {
    render(<MainPage />);

    expect(screen.getByTestId('filter-sync-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('banner-promo')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('sort')).toBeInTheDocument();
    expect(screen.getByTestId('card-list')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toBeInTheDocument();

    expect(screen.getByTestId('main-page')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Каталог фото- и видеотехники' })
    ).toBeInTheDocument();
  });

  it('passes correct props to CatalogFiltersMemo', () => {
    render(<MainPage />);

    expect(mockCatalogFilters).toHaveBeenCalledTimes(1);
    const [props] = mockCatalogFilters.mock.calls[0];

    expect(props.priceRange).toEqual({ min: 100, max: 2000 });
  });

  it('paginates offers and passes sliced offers to CardListMemo', () => {
    render(<MainPage />);

    expect(mockUsePagination).toHaveBeenCalledTimes(1);
    const [paginationArgs] = mockUsePagination.mock.calls[0];
    expect(paginationArgs.totalItems).toBe(3);
    expect(paginationArgs.itemsPerPage).toBe(9);

    expect(mockCardList).toHaveBeenCalledTimes(1);
    const [cardListProps] = mockCardList.mock.calls[0];
    const offers = cardListProps.offers as FullOfferType[];

    expect(offers).toHaveLength(2);
    expect(offers[0].id).toBe(1);
    expect(offers[1].id).toBe(2);

    expect(mockPagination).toHaveBeenCalledTimes(1);
    const [paginationProps] = mockPagination.mock.calls[0];
    expect(paginationProps.totalItems).toBe(3);
    expect(paginationProps.itemsPerPage).toBe(9);
  });

  it('renders empty state when no products', () => {
    mockUseFilteredProducts.mockReturnValue({
      filteredProducts: [],
      filteredPriceRange: { min: 0, max: 0 },
    });

    render(<MainPage />);

    expect(screen.getByTestId('main-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    expect(mockCardList).not.toHaveBeenCalled();
    expect(mockPagination).not.toHaveBeenCalled();
  });

  it('resets "page" url param when currentPage > totalPages (and totalPages > 0)', async () => {
    mockUseFilteredProducts.mockReturnValue({
      filteredProducts: [makeOffer(1)],
      filteredPriceRange: { min: 0, max: 0 },
    });

    mockUsePagination.mockReturnValue({
      currentPage: 3,
      totalPages: 1,
      startIndex: 0,
      endIndex: 9,
    });

    render(<MainPage />);

    await waitFor(() => {
      expect(mockSetParam).toHaveBeenCalledWith('page', null);
    });
    const [cardListProps] = mockCardList.mock.calls[0];
    expect(cardListProps.offers).toEqual([]);
  });
});
