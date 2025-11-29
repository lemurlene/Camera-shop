import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import MainPage from './main-page';
import { useFilteredProducts, usePagination, usePriceSync, useAppSelector } from '../../hooks';
import { useUrl } from '../../contexts';
import { Setting } from '../../const/const';
import { mockOffers } from '../../mocks/mock-offers';
import { mockPromoOffers } from '../../mocks/mock-promo-offers';

interface UsePaginationReturn {
  startIndex: number;
  endIndex: number;
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  paginationRange: (string | number)[];
  itemsPerPage: number;
}

interface UrlContextType {
  setParam: (key: string, value: string | string[] | null) => void;
  getParam: (key: string) => string | null;
  deleteParam: (key: string) => void;
  getParamAll: (key: string) => string[];
  setParams: (params: Record<string, string | string[] | null>) => void;
  getAllParams: () => Record<string, string | string[]>;
}

vi.mock('../../hooks', () => ({
  useAppSelector: vi.fn(),
  useFilteredProducts: vi.fn(),
  usePagination: vi.fn(),
  usePriceSync: vi.fn(),
}));

vi.mock('../../contexts', () => ({
  useUrl: vi.fn(),
}));

vi.mock('../../store/offers-promo', () => ({
  selectOffersPromo: vi.fn(),
}));

vi.mock('../../components/banner-promo', () => ({
  default: ({ offersPromo }: { offersPromo: typeof mockPromoOffers }) => (
    <div data-testid="banner-promo">
      Banner Promo - {offersPromo.length} offers
    </div>
  )
}));

vi.mock('../../components/breadcrumbs', () => ({
  default: () => <nav data-testid="breadcrumbs">Breadcrumbs</nav>
}));

vi.mock('../../components/catalog-filters', () => ({
  default: ({ priceRange }: { priceRange: { min: number; max: number } }) => (
    <div data-testid="catalog-filters">
      Catalog Filters - Range: {priceRange.min}-{priceRange.max}
    </div>
  )
}));

vi.mock('./main-empty', () => ({
  default: () => (
    <div className="catalog__cards" data-testid="main-empty">
      <h3 className="title title--h3">
        Техника такой категории/типа/уровня не найдена. Поменяйте фильтры.
      </h3>
    </div>
  )
}));

vi.mock('../../components/sort', () => ({
  default: () => <div data-testid="sort">Sort</div>
}));

vi.mock('../../components/card', () => ({
  CardListMemo: ({ offers }: { offers: typeof mockOffers }) => {
    if (offers.length === 0) {
      return null;
    }
    return (
      <div data-testid="card-list">
        Card List - {offers.length} products
      </div>
    );
  }
}));

vi.mock('../../components/pagination', () => ({
  default: ({ totalItems, itemsPerPage }: { totalItems: number; itemsPerPage: number }) => (
    <div data-testid="pagination">
      Pagination: {totalItems} items, {itemsPerPage} per page
    </div>
  )
}));

vi.mock('../../components/wrappers', () => ({
  FilterSyncWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="filter-sync-wrapper">{children}</div>
  )
}));

const mockUseFilteredProducts = vi.mocked(useFilteredProducts);
const mockUsePagination = vi.mocked(usePagination);
const mockUsePriceSync = vi.mocked(usePriceSync);
const mockUseUrl = vi.mocked(useUrl);
const mockUseAppSelector = vi.mocked(useAppSelector);

const createMockStore = () => configureStore({
  reducer: {
    offersPromo: () => ({ data: mockPromoOffers })
  }
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={createMockStore()}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </Provider>
);

describe('MainPage', () => {
  const createDefaultPagination = (): UsePaginationReturn => ({
    currentPage: 1,
    totalPages: Math.ceil(mockOffers.length / Setting.CardsCountOnCatalog),
    startIndex: 0,
    endIndex: Setting.CardsCountOnCatalog,
    setPage: vi.fn(),
    nextPage: vi.fn(),
    prevPage: vi.fn(),
    paginationRange: [1, 2, 3],
    itemsPerPage: Setting.CardsCountOnCatalog
  });

  const createDefaultUrlContext = (): UrlContextType => ({
    setParam: vi.fn(),
    getParam: vi.fn(),
    deleteParam: vi.fn(),
    getParamAll: vi.fn(),
    setParams: vi.fn(),
    getAllParams: vi.fn()
  });

  const defaultFilteredProducts = {
    filteredProducts: mockOffers,
    filteredPriceRange: { min: 100, max: 1000 }
  };

  let defaultPagination: UsePaginationReturn;
  let defaultUrlContext: UrlContextType;

  beforeEach(() => {
    vi.clearAllMocks();

    defaultPagination = createDefaultPagination();
    defaultUrlContext = createDefaultUrlContext();

    mockUseFilteredProducts.mockReturnValue(defaultFilteredProducts);
    mockUsePagination.mockReturnValue(defaultPagination);
    mockUsePriceSync.mockReturnValue();
    mockUseUrl.mockReturnValue(defaultUrlContext);
    mockUseAppSelector.mockReturnValue(mockPromoOffers);
  });

  describe('when products are available', () => {
    it('should render all main components with mock data', () => {
      render(<MainPage />, { wrapper: TestWrapper });

      expect(screen.getByTestId('main-page')).toBeInTheDocument();
      expect(screen.getByTestId('banner-promo')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
      expect(screen.getByTestId('catalog-filters')).toBeInTheDocument();
      expect(screen.getByTestId('sort')).toBeInTheDocument();
      expect(screen.getByTestId('card-list')).toBeInTheDocument();
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('should NOT render MainEmpty when products are available', () => {
      render(<MainPage />, { wrapper: TestWrapper });

      expect(screen.queryByTestId('main-empty')).not.toBeInTheDocument();
    });

    it('should render banner with promo offers', () => {
      render(<MainPage />, { wrapper: TestWrapper });

      const banner = screen.getByTestId('banner-promo');
      expect(banner).toHaveTextContent(`Banner Promo - ${mockPromoOffers.length} offers`);
    });

    it('should render catalog filters with price range', () => {
      render(<MainPage />, { wrapper: TestWrapper });

      const filters = screen.getByTestId('catalog-filters');
      expect(filters).toHaveTextContent('Catalog Filters - Range: 100-1000');
    });

    it('should render card list with filtered products', () => {
      render(<MainPage />, { wrapper: TestWrapper });

      const cardList = screen.getByTestId('card-list');
      expect(cardList).toHaveTextContent(`Card List - ${mockOffers.length} products`);
    });

    it('should render catalog title', () => {
      render(<MainPage />, { wrapper: TestWrapper });

      const title = screen.getByText('Каталог фото- и видеотехники');
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('title', 'title--h2');
    });

    it('should render pagination with correct props from mock data', () => {
      render(<MainPage />, { wrapper: TestWrapper });

      const pagination = screen.getByTestId('pagination');
      expect(pagination).toHaveTextContent(`Pagination: ${mockOffers.length} items, ${Setting.CardsCountOnCatalog} per page`);
    });
  });

  describe('when no products are available', () => {
    beforeEach(() => {
      mockUseFilteredProducts.mockReturnValue({
        filteredProducts: [],
        filteredPriceRange: { min: 0, max: 0 }
      });
    });

    it('should render MainEmpty component when no products', () => {
      render(<MainPage />, { wrapper: TestWrapper });

      const mainEmpty = screen.getByTestId('main-empty');
      expect(mainEmpty).toBeInTheDocument();
      expect(mainEmpty).toHaveClass('catalog__cards');

      const message = screen.getByText('Техника такой категории/типа/уровня не найдена. Поменяйте фильтры.');
      expect(message).toBeInTheDocument();
      expect(message).toHaveClass('title', 'title--h3');
    });

    it('should NOT render card list and pagination when no products', () => {
      render(<MainPage />, { wrapper: TestWrapper });

      expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });

    it('should render filters with zero price range when no products', () => {
      render(<MainPage />, { wrapper: TestWrapper });

      const filters = screen.getByTestId('catalog-filters');
      expect(filters).toHaveTextContent('Catalog Filters - Range: 0-0');
    });

    it('should still render other components when no products', () => {
      render(<MainPage />, { wrapper: TestWrapper });

      expect(screen.getByTestId('banner-promo')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
      expect(screen.getByTestId('catalog-filters')).toBeInTheDocument();
      expect(screen.getByTestId('sort')).toBeInTheDocument();
      expect(screen.getByTestId('main-empty')).toBeInTheDocument();
    });
  });

  describe('MainEmpty component rendering', () => {
    it('should render MainEmpty with correct structure and message', () => {
      mockUseFilteredProducts.mockReturnValue({
        filteredProducts: [],
        filteredPriceRange: { min: 0, max: 0 }
      });

      render(<MainPage />, { wrapper: TestWrapper });

      const mainEmpty = screen.getByTestId('main-empty');
      expect(mainEmpty).toBeInTheDocument();

      expect(mainEmpty).toHaveClass('catalog__cards');

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Техника такой категории/типа/уровня не найдена. Поменяйте фильтры.');
      expect(heading).toHaveClass('title', 'title--h3');
    });

    it('should show appropriate message for empty state', () => {
      mockUseFilteredProducts.mockReturnValue({
        filteredProducts: [],
        filteredPriceRange: { min: 0, max: 0 }
      });

      render(<MainPage />, { wrapper: TestWrapper });

      const message = screen.getByText(/Техника такой категории\/типа\/уровня не найдена/i);
      expect(message).toBeInTheDocument();
      expect(message).toHaveTextContent('Поменяйте фильтры.');
    });
  });

  describe('pagination logic with mock data', () => {
    it('should handle pagination correctly with mock offers', () => {
      const totalPages = Math.ceil(mockOffers.length / Setting.CardsCountOnCatalog);

      const pagination: UsePaginationReturn = {
        ...createDefaultPagination(),
        currentPage: 2,
        totalPages: totalPages,
        startIndex: Setting.CardsCountOnCatalog,
        endIndex: Setting.CardsCountOnCatalog * 2
      };

      mockUsePagination.mockReturnValue(pagination);

      render(<MainPage />, { wrapper: TestWrapper });

      expect(mockUsePagination).toHaveBeenCalledWith({
        totalItems: mockOffers.length,
        itemsPerPage: Setting.CardsCountOnCatalog
      });
    });

    it('should reset page when current page exceeds total pages', async () => {
      const totalPages = Math.ceil(mockOffers.length / Setting.CardsCountOnCatalog);

      const pagination: UsePaginationReturn = {
        ...createDefaultPagination(),
        currentPage: totalPages + 1,
        totalPages: totalPages,
        startIndex: 0,
        endIndex: Setting.CardsCountOnCatalog
      };

      mockUsePagination.mockReturnValue(pagination);

      render(<MainPage />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(defaultUrlContext.setParam).toHaveBeenCalledWith('page', null);
      });
    });

    it('should return empty array when current page exceeds total pages', () => {
      const totalPages = Math.ceil(mockOffers.length / Setting.CardsCountOnCatalog);

      const pagination: UsePaginationReturn = {
        ...createDefaultPagination(),
        currentPage: totalPages + 1,
        totalPages: totalPages,
        startIndex: 0,
        endIndex: Setting.CardsCountOnCatalog
      };

      mockUsePagination.mockReturnValue(pagination);

      render(<MainPage />, { wrapper: TestWrapper });

      const cardList = screen.queryByTestId('card-list');
      expect(cardList).not.toBeInTheDocument();
    });
  });

  describe('layout structure', () => {
    it('should have correct page structure', () => {
      const { container } = render(<MainPage />, { wrapper: TestWrapper });

      const pageContent = screen.getByTestId('main-page');
      expect(pageContent).toHaveClass('page-content');

      const catalogSection = container.querySelector('.catalog');
      expect(catalogSection).toBeInTheDocument();

      const containerDiv = container.querySelector('.container');
      expect(containerDiv).toBeInTheDocument();

      const columns = container.querySelector('.page-content__columns');
      expect(columns).toBeInTheDocument();
    });

    it('should have correct sidebar and content layout', () => {
      render(<MainPage />, { wrapper: TestWrapper });

      const aside = screen.getByTestId('catalog-filters').closest('.catalog__aside');
      expect(aside).toBeInTheDocument();

      const content = screen.getByTestId('sort').closest('.catalog__content');
      expect(content).toBeInTheDocument();
    });
  });

  describe('hooks integration with mock data', () => {
    it('should use all required hooks with mock data', () => {
      render(<MainPage />, { wrapper: TestWrapper });

      expect(mockUseFilteredProducts).toHaveBeenCalled();
      expect(mockUsePagination).toHaveBeenCalledWith({
        totalItems: mockOffers.length,
        itemsPerPage: Setting.CardsCountOnCatalog
      });
      expect(mockUsePriceSync).toHaveBeenCalled();
      expect(mockUseUrl).toHaveBeenCalled();
      expect(mockUseAppSelector).toHaveBeenCalled();
    });

    it('should pass mock promo offers to banner', () => {
      render(<MainPage />, { wrapper: TestWrapper });

      const banner = screen.getByTestId('banner-promo');
      expect(banner).toHaveTextContent(`Banner Promo - ${mockPromoOffers.length} offers`);
    });
  });

  describe('FilterSyncWrapper integration', () => {
    it('should wrap content with FilterSyncWrapper', () => {
      render(<MainPage />, { wrapper: TestWrapper });

      expect(screen.getByTestId('filter-sync-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('main-page')).toBeInTheDocument();
    });
  });
});

describe('MainPage - edge cases with mock data', () => {
  const EdgeCaseWrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={createMockStore()}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );

  const createDefaultPagination = (): UsePaginationReturn => ({
    currentPage: 1,
    totalPages: Math.ceil(mockOffers.length / Setting.CardsCountOnCatalog),
    startIndex: 0,
    endIndex: Setting.CardsCountOnCatalog,
    setPage: vi.fn(),
    nextPage: vi.fn(),
    prevPage: vi.fn(),
    paginationRange: [1, 2, 3],
    itemsPerPage: Setting.CardsCountOnCatalog
  });

  it('should handle single product from mock data', () => {
    const singleProduct = [mockOffers[0]];

    mockUseFilteredProducts.mockReturnValue({
      filteredProducts: singleProduct,
      filteredPriceRange: { min: 100, max: 100 }
    });

    const pagination: UsePaginationReturn = {
      ...createDefaultPagination(),
      currentPage: 1,
      totalPages: 1,
      startIndex: 0,
      endIndex: Setting.CardsCountOnCatalog
    };

    mockUsePagination.mockReturnValue(pagination);

    render(<MainPage />, { wrapper: EdgeCaseWrapper });

    const cardList = screen.getByTestId('card-list');
    expect(cardList).toHaveTextContent('Card List - 1 products');

    const paginationComponent = screen.getByTestId('pagination');
    expect(paginationComponent).toHaveTextContent('Pagination: 1 items, 9 per page');
  });

  it('should handle empty promo offers', () => {
    mockUseAppSelector.mockReturnValue([]);

    render(<MainPage />, { wrapper: EdgeCaseWrapper });

    const banner = screen.getByTestId('banner-promo');
    expect(banner).toHaveTextContent('Banner Promo - 0 offers');
  });

  it('should handle different price ranges from mock data', () => {
    const highPriceRange = { min: 5000, max: 50000 };

    mockUseFilteredProducts.mockReturnValue({
      filteredProducts: mockOffers,
      filteredPriceRange: highPriceRange
    });

    render(<MainPage />, { wrapper: EdgeCaseWrapper });

    const filters = screen.getByTestId('catalog-filters');
    expect(filters).toHaveTextContent('Catalog Filters - Range: 5000-50000');
  });
});

describe('MainPage - memoization with mock data', () => {
  const MemoWrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={createMockStore()}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );

  const createDefaultPagination = (): UsePaginationReturn => ({
    currentPage: 1,
    totalPages: Math.ceil(mockOffers.length / Setting.CardsCountOnCatalog),
    startIndex: 0,
    endIndex: Setting.CardsCountOnCatalog,
    setPage: vi.fn(),
    nextPage: vi.fn(),
    prevPage: vi.fn(),
    paginationRange: [1, 2, 3],
    itemsPerPage: Setting.CardsCountOnCatalog
  });

  it('should recalculate pagination when filtered products change', () => {
    const differentProducts = mockOffers.slice(0, 5);

    mockUseFilteredProducts.mockReturnValue({
      filteredProducts: differentProducts,
      filteredPriceRange: { min: 100, max: 1000 }
    });

    const totalPages = Math.ceil(differentProducts.length / Setting.CardsCountOnCatalog);

    const pagination: UsePaginationReturn = {
      ...createDefaultPagination(),
      currentPage: 1,
      totalPages: totalPages,
      startIndex: 0,
      endIndex: Setting.CardsCountOnCatalog
    };

    mockUsePagination.mockReturnValue(pagination);

    render(<MainPage />, { wrapper: MemoWrapper });

    const paginationComponent = screen.getByTestId('pagination');
    expect(paginationComponent).toHaveTextContent(`Pagination: ${differentProducts.length} items, ${Setting.CardsCountOnCatalog} per page`);
  });
});
