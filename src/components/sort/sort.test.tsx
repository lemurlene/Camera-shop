import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import Sort from './sort';

import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  changeSortType,
  changeSortOrder,
  selectSortType,
  selectSortOrder,
} from '../../store/sort';

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

describe('Sort', () => {
  type AppDispatch = ReturnType<typeof useAppDispatch>;

  const mockUseAppDispatch = vi.mocked(useAppDispatch);
  const mockUseAppSelector = vi.mocked(useAppSelector);

  const mockChangeSortType = vi.mocked(changeSortType);
  const mockChangeSortOrder = vi.mocked(changeSortOrder);

  const mockDispatch = vi.fn() as unknown as AppDispatch;

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAppDispatch.mockReturnValue(mockDispatch);
    mockChangeSortType.mockImplementation(
      (type) =>
        ({
          type: 'SORT/changeSortType',
          payload: type,
        }) as ReturnType<typeof changeSortType>
    );

    mockChangeSortOrder.mockImplementation(
      (order) =>
        ({
          type: 'SORT/changeSortOrder',
          payload: order,
        }) as ReturnType<typeof changeSortOrder>
    );

    mockUseAppSelector.mockImplementation((selector: unknown) => {
      if (selector === selectSortType) {
        return SortTypes.Popular;
      }
      if (selector === selectSortOrder) {
        return SortOrders.Asc;
      }
      return undefined;
    });
  });

  it('renders all main controls', () => {
    render(<Sort />);

    expect(screen.getByText('Сортировать:')).toBeInTheDocument();

    expect(screen.getByLabelText('по цене')).toBeInTheDocument();
    expect(screen.getByLabelText('по популярности')).toBeInTheDocument();

    expect(screen.getByLabelText('По возрастанию')).toBeInTheDocument();
    expect(screen.getByLabelText('По убыванию')).toBeInTheDocument();
  });

  it('renders with correct initial checked state from selectors', () => {
    render(<Sort />);

    expect(screen.getByLabelText('по популярности')).toBeChecked();
    expect(screen.getByLabelText('по цене')).not.toBeChecked();

    expect(screen.getByLabelText('По возрастанию')).toBeChecked();
    expect(screen.getByLabelText('По убыванию')).not.toBeChecked();
  });

  it('dispatches changeSortType(Price) when "по цене" clicked', () => {
    render(<Sort />);

    fireEvent.click(screen.getByLabelText('по цене'));

    expect(mockChangeSortType).toHaveBeenCalledTimes(1);
    expect(mockChangeSortType).toHaveBeenCalledWith(SortTypes.Price);

    const expectedAction = {
      type: 'SORT/changeSortType',
      payload: SortTypes.Price,
    };

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('dispatches changeSortType(Popular) when "по популярности" clicked', () => {
    mockUseAppSelector.mockImplementation((selector: unknown) => {
      if (selector === selectSortType) {
        return SortTypes.Price;
      }
      if (selector === selectSortOrder) {
        return SortOrders.Asc;
      }
      return undefined;
    });

    render(<Sort />);

    fireEvent.click(screen.getByLabelText('по популярности'));

    expect(mockChangeSortType).toHaveBeenCalledTimes(1);
    expect(mockChangeSortType).toHaveBeenCalledWith(SortTypes.Popular);

    const expectedAction = {
      type: 'SORT/changeSortType',
      payload: SortTypes.Popular,
    };

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('dispatches changeSortOrder(Desc) when "По убыванию" clicked', () => {
    render(<Sort />);

    fireEvent.click(screen.getByLabelText('По убыванию'));

    expect(mockChangeSortOrder).toHaveBeenCalledTimes(1);
    expect(mockChangeSortOrder).toHaveBeenCalledWith(SortOrders.Desc);

    const expectedAction = {
      type: 'SORT/changeSortOrder',
      payload: SortOrders.Desc,
    };

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('dispatches changeSortOrder(Asc) when "По возрастанию" clicked', () => {
    mockUseAppSelector.mockImplementation((selector: unknown) => {
      if (selector === selectSortType) {
        return SortTypes.Popular;
      }
      if (selector === selectSortOrder) {
        return SortOrders.Desc;
      }
      return undefined;
    });

    render(<Sort />);

    fireEvent.click(screen.getByLabelText('По возрастанию'));

    expect(mockChangeSortOrder).toHaveBeenCalledTimes(1);
    expect(mockChangeSortOrder).toHaveBeenCalledWith(SortOrders.Asc);

    const expectedAction = {
      type: 'SORT/changeSortOrder',
      payload: SortOrders.Asc,
    };

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('has correct attributes (radio groups)', () => {
    render(<Sort />);

    const price = screen.getByLabelText('по цене');
    const popular = screen.getByLabelText('по популярности');

    const asc = screen.getByLabelText('По возрастанию');
    const desc = screen.getByLabelText('По убыванию');

    expect(price).toHaveAttribute('type', 'radio');
    expect(popular).toHaveAttribute('type', 'radio');
    expect(asc).toHaveAttribute('type', 'radio');
    expect(desc).toHaveAttribute('type', 'radio');

    expect(price).toHaveAttribute('name', 'sort');
    expect(popular).toHaveAttribute('name', 'sort');

    expect(asc).toHaveAttribute('name', 'sort-icon');
    expect(desc).toHaveAttribute('name', 'sort-icon');

    expect(price).toHaveAttribute('id', 'sortPrice');
    expect(popular).toHaveAttribute('id', 'sortPopular');
    expect(asc).toHaveAttribute('id', 'up');
    expect(desc).toHaveAttribute('id', 'down');
  });
});
