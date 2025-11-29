import { describe, it, expect, vi, beforeEach, MockedFunction } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sort from './sort';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { changeSortType, changeSortOrder, selectSortType, selectSortOrder } from '../../store/sort';
import { SortTypes, SortOrders } from './const';

vi.mock('../../hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../../store/sort', () => ({
  changeSortType: vi.fn(),
  changeSortOrder: vi.fn(),
  selectSortType: vi.fn(),
  selectSortOrder: vi.fn(),
}));

const mockUseAppDispatch = useAppDispatch as MockedFunction<typeof useAppDispatch>;
const mockUseAppSelector = useAppSelector as MockedFunction<typeof useAppSelector>;
const mockChangeSortType = changeSortType as MockedFunction<typeof changeSortType>;
const mockChangeSortOrder = changeSortOrder as MockedFunction<typeof changeSortOrder>;
const mockSelectSortType = selectSortType as MockedFunction<typeof selectSortType>;
const mockSelectSortOrder = selectSortOrder as MockedFunction<typeof selectSortOrder>;

describe('Sort', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAppDispatch.mockReturnValue(mockDispatch);
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === mockSelectSortType) {
        return SortTypes.Popular;
      }
      if (selector === mockSelectSortOrder) {
        return SortOrders.Asc;
      }
      return undefined;
    });
  });

  describe('component rendering', () => {
    it('should render all main elements', () => {
      render(<Sort />);

      expect(screen.getByText('Сортировать:')).toBeInTheDocument();
      expect(screen.getByLabelText('по цене')).toBeInTheDocument();
      expect(screen.getByLabelText('по популярности')).toBeInTheDocument();
      expect(screen.getByLabelText('По возрастанию')).toBeInTheDocument();
      expect(screen.getByLabelText('По убыванию')).toBeInTheDocument();
    });

    it('should render with correct initial state', () => {
      render(<Sort />);

      const popularRadio = screen.getByLabelText('по популярности');
      const priceRadio = screen.getByLabelText('по цене');
      const ascRadio = screen.getByLabelText('По возрастанию');
      const descRadio = screen.getByLabelText('По убыванию');

      expect(popularRadio).toBeChecked();
      expect(priceRadio).not.toBeChecked();
      expect(ascRadio).toBeChecked();
      expect(descRadio).not.toBeChecked();
    });

    it('should render correct class names', () => {
      render(<Sort />);

      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();

      const sortTitle = screen.getByText('Сортировать:');
      expect(sortTitle).toHaveClass('title', 'title--h5');
    });
  });

  describe('sort type functionality', () => {
    it('should call changeSortType with Price when price radio is clicked', () => {
      render(<Sort />);

      const priceRadio = screen.getByLabelText('по цене');
      fireEvent.click(priceRadio);

      expect(mockDispatch).toHaveBeenCalledWith(mockChangeSortType(SortTypes.Price));
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('should call changeSortType with Popular when popular radio is clicked', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === mockSelectSortType) {
          return SortTypes.Price;
        }
        if (selector === mockSelectSortOrder) {
          return SortOrders.Asc;
        }
        return undefined;
      });

      render(<Sort />);

      const popularRadio = screen.getByLabelText('по популярности');
      fireEvent.click(popularRadio);

      expect(mockDispatch).toHaveBeenCalledWith(mockChangeSortType(SortTypes.Popular));
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('sort order functionality', () => {
    it('should call changeSortOrder with Asc when ascending radio is clicked', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === mockSelectSortType) {
          return SortTypes.Popular;
        }
        if (selector === mockSelectSortOrder) {
          return SortOrders.Desc;
        }
        return undefined;
      });

      render(<Sort />);

      const ascRadio = screen.getByLabelText('По возрастанию');
      fireEvent.click(ascRadio);

      expect(mockDispatch).toHaveBeenCalledWith(mockChangeSortOrder(SortOrders.Asc));
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('should call changeSortOrder with Desc when descending radio is clicked', () => {
      render(<Sort />);

      const descRadio = screen.getByLabelText('По убыванию');
      fireEvent.click(descRadio);

      expect(mockDispatch).toHaveBeenCalledWith(mockChangeSortOrder(SortOrders.Desc));
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('integration between sort type and order', () => {
    it('should maintain independent state for type and order', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === mockSelectSortType) {
          return SortTypes.Price;
        }
        if (selector === mockSelectSortOrder) {
          return SortOrders.Desc;
        }
        return undefined;
      });

      render(<Sort />);

      const priceRadio = screen.getByLabelText('по цене');
      const descRadio = screen.getByLabelText('По убыванию');

      expect(priceRadio).toBeChecked();
      expect(descRadio).toBeChecked();
    });
  });

  describe('edge cases', () => {
    it('should handle undefined selectors gracefully', () => {
      mockUseAppSelector.mockReturnValue(undefined);

      render(<Sort />);

      expect(screen.getByText('Сортировать:')).toBeInTheDocument();
    });

    it('should call dispatch only for inactive radio buttons', () => {
      render(<Sort />);

      const priceRadio = screen.getByLabelText('по цене');
      const popularRadio = screen.getByLabelText('по популярности');

      fireEvent.click(priceRadio);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(mockChangeSortType(SortTypes.Price));

      fireEvent.click(popularRadio);
      expect(mockDispatch).toHaveBeenCalledTimes(1);

      fireEvent.click(priceRadio);
      expect(mockDispatch).toHaveBeenCalledTimes(2);
      expect(mockDispatch).toHaveBeenCalledWith(mockChangeSortType(SortTypes.Price));
    });

    it('should handle order radio buttons similarly', () => {
      render(<Sort />);

      const descRadio = screen.getByLabelText('По убыванию');
      const ascRadio = screen.getByLabelText('По возрастанию');

      fireEvent.click(descRadio);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(mockChangeSortOrder(SortOrders.Desc));

      fireEvent.click(ascRadio);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('should have proper input attributes', () => {
      render(<Sort />);

      const priceInput = screen.getByLabelText('по цене');
      const popularInput = screen.getByLabelText('по популярности');
      const ascInput = screen.getByLabelText('По возрастанию');
      const descInput = screen.getByLabelText('По убыванию');

      expect(priceInput).toHaveAttribute('type', 'radio');
      expect(popularInput).toHaveAttribute('type', 'radio');
      expect(ascInput).toHaveAttribute('type', 'radio');
      expect(descInput).toHaveAttribute('type', 'radio');

      expect(priceInput).toHaveAttribute('name', 'sort');
      expect(popularInput).toHaveAttribute('name', 'sort');
      expect(ascInput).toHaveAttribute('name', 'sort-icon');
      expect(descInput).toHaveAttribute('name', 'sort-icon');
    });

    it('should have unique ids for inputs', () => {
      render(<Sort />);

      const priceInput = screen.getByLabelText('по цене');
      const popularInput = screen.getByLabelText('по популярности');
      const ascInput = screen.getByLabelText('По возрастанию');
      const descInput = screen.getByLabelText('По убыванию');

      expect(priceInput).toHaveAttribute('id', 'sortPrice');
      expect(popularInput).toHaveAttribute('id', 'sortPopular');
      expect(ascInput).toHaveAttribute('id', 'up');
      expect(descInput).toHaveAttribute('id', 'down');
    });

    it('should have proper aria-labels for sort order', () => {
      render(<Sort />);

      const ascInput = screen.getByLabelText('По возрастанию');
      const descInput = screen.getByLabelText('По убыванию');

      expect(ascInput).toHaveAttribute('aria-label', 'По возрастанию');
      expect(descInput).toHaveAttribute('aria-label', 'По убыванию');
    });
  });

  describe('form structure', () => {
    it('should have proper form structure', () => {
      render(<Sort />);

      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('action', '#');

      const sortInner = form.querySelector('.catalog-sort__inner');
      expect(sortInner).toBeInTheDocument();

      const sortType = form.querySelector('.catalog-sort__type');
      expect(sortType).toBeInTheDocument();

      const sortOrder = form.querySelector('.catalog-sort__order');
      expect(sortOrder).toBeInTheDocument();
    });

    it('should have correct number of radio buttons in each group', () => {
      render(<Sort />);

      const allRadios = screen.getAllByRole('radio');

      const sortTypeRadios = allRadios.filter((radio) =>
        radio.getAttribute('name') === 'sort'
      );
      expect(sortTypeRadios).toHaveLength(2);

      const sortOrderRadios = allRadios.filter((radio) =>
        radio.getAttribute('name') === 'sort-icon'
      );
      expect(sortOrderRadios).toHaveLength(2);
    });

    it('should have proper visual structure with CSS classes', () => {
      render(<Sort />);

      const catalogSort = document.querySelector('.catalog-sort');
      expect(catalogSort).toBeInTheDocument();

      const catalogSortInner = document.querySelector('.catalog-sort__inner');
      expect(catalogSortInner).toBeInTheDocument();

      const catalogSortType = document.querySelector('.catalog-sort__type');
      expect(catalogSortType).toBeInTheDocument();

      const catalogSortOrder = document.querySelector('.catalog-sort__order');
      expect(catalogSortOrder).toBeInTheDocument();

      const btnTextElements = document.querySelectorAll('.catalog-sort__btn-text');
      expect(btnTextElements).toHaveLength(2);

      const btnElements = document.querySelectorAll('.catalog-sort__btn');
      expect(btnElements).toHaveLength(2);
    });
  });
});
