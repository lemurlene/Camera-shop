import { render, screen, fireEvent } from '@testing-library/react';
import { vi, type Mock } from 'vitest';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  selectCurrentCategory,
  selectCurrentType,
  selectCurrentLevel,
  selectMinPrice,
  selectMaxPrice,
  selectAllFilters,
  changeMaxPrice,
  changeMinPrice
} from '../../store/filters';
import CatalogFiltersMemo from './catalog-filters';
import { makeFakeStore } from '../../mocks/make-fake-store';

vi.mock('../../hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../../store/filters', async () => {
  const actual = await vi.importActual<typeof import('../../store/filters')>('../../store/filters');
  return {
    ...actual,
    selectMinPrice: vi.fn(),
    selectMaxPrice: vi.fn(),
    selectCurrentType: vi.fn(),
    selectCurrentCategory: vi.fn(),
    selectCurrentLevel: vi.fn(),
    selectAllFilters: vi.fn(),
    changeMinPrice: vi.fn(),
    changeMaxPrice: vi.fn(),
  };
});

const mockedUseAppDispatch = useAppDispatch as Mock;
const mockedUseAppSelector = useAppSelector as Mock;
const mockedChangeMinPrice = vi.mocked(changeMinPrice) as Mock;
const mockedChangeMaxPrice = vi.mocked(changeMaxPrice) as Mock;

describe('CatalogFilters component', () => {
  const mockDispatch = vi.fn();
  const priceRange = { min: 1000, max: 50000 };

  beforeEach(() => {
    mockedUseAppDispatch.mockReturnValue(mockDispatch);
    mockedChangeMinPrice.mockClear();
    mockedChangeMaxPrice.mockClear();
    mockDispatch.mockClear();
    mockedUseAppSelector.mockImplementation((selector) => {
      const mockState = makeFakeStore();

      if (selector === selectMinPrice) {
        return mockState.FILTERS.minPrice;
      }
      if (selector === selectMaxPrice) {
        return mockState.FILTERS.maxPrice;
      }
      if (selector === selectCurrentType) {
        return mockState.FILTERS.type;
      }
      if (selector === selectCurrentCategory) {
        return mockState.FILTERS.category;
      }
      if (selector === selectCurrentLevel) {
        return mockState.FILTERS.level;
      }
      if (selector === selectAllFilters) {
        return mockState.FILTERS;
      }

      return undefined;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders catalog filter form and title', () => {
    render(<CatalogFiltersMemo priceRange={priceRange} />);

    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();

    const heading = screen.getByText('Фильтр');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('visually-hidden');
  });

  it('passes priceRange to PriceFilter', () => {
    render(<CatalogFiltersMemo priceRange={priceRange} />);

    const priceFilter = screen.getByTestId('price-filter');
    expect(priceFilter).toHaveAttribute('data-min', priceRange.min.toString());
    expect(priceFilter).toHaveAttribute('data-max', priceRange.max.toString());
  });

  it('calls changeMinPrice if minPrice < priceRange.min', () => {
    const initialMinPrice = 500;

    mockedUseAppSelector.mockImplementation((selector) => {
      const mockState = makeFakeStore();
      if (selector === selectMinPrice) {
        return initialMinPrice;
      }
      if (selector === selectMaxPrice) {
        return 20000;
      }
      if (selector === selectCurrentType) {
        return mockState.FILTERS.type;
      }
      return undefined;
    });

    render(<CatalogFiltersMemo priceRange={priceRange} />);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockedChangeMinPrice).toHaveBeenCalledWith(priceRange.min);
  });

  it('calls changeMaxPrice if maxPrice > priceRange.max', () => {
    const initialMaxPrice = 60000;

    mockedUseAppSelector.mockImplementation((selector) => {
      const mockState = makeFakeStore();
      if (selector === selectMinPrice) {
        return 2000;
      }
      if (selector === selectMaxPrice) {
        return initialMaxPrice;
      }
      if (selector === selectCurrentType) {
        return mockState.FILTERS.type;
      }
      return undefined;
    });

    render(<CatalogFiltersMemo priceRange={priceRange} />);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockedChangeMaxPrice).toHaveBeenCalledWith(priceRange.max);
  });

  it('does not call changeMinPrice/changeMaxPrice if prices are within range', () => {
    mockedUseAppSelector.mockImplementation((selector) => {
      const mockState = makeFakeStore();
      if (selector === selectMinPrice) {
        return 2000;
      }
      if (selector === selectMaxPrice) {
        return 30000;
      }
      if (selector === selectCurrentType) {
        return mockState.FILTERS.type;
      }
      return undefined;
    });

    render(<CatalogFiltersMemo priceRange={priceRange} />);

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockedChangeMinPrice).not.toHaveBeenCalled();
    expect(mockedChangeMaxPrice).not.toHaveBeenCalled();
  });

  it('renders all filter subcomponents', () => {
    render(<CatalogFiltersMemo priceRange={priceRange} />);

    expect(screen.getByTestId('price-filter')).toBeInTheDocument();
    expect(screen.getByTestId('category-filter')).toBeInTheDocument();
    expect(screen.getByTestId('type-filter')).toBeInTheDocument();
    expect(screen.getByTestId('level-filter')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Сбросить фильтры' })).toBeInTheDocument();
  });

  it('prevents form submission on submit', () => {
    render(<CatalogFiltersMemo priceRange={priceRange} />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
