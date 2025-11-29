import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, type Mock } from 'vitest';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { resetFilters } from '../../store/filters';
import { ResetFilterButtonMemo } from './reset-filter-button';
import { State } from '../../store/type';
import { makeFakeStore } from '../../mocks/make-fake-store';

vi.mock('../../hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../../store/filters', () => ({
  resetFilters: vi.fn(),
  selectCurrentCategory: vi.fn(),
  selectCurrentType: vi.fn(),
  selectCurrentLevel: vi.fn(),
  selectMinPrice: vi.fn(),
  selectMaxPrice: vi.fn(),
}));

const mockedUseAppDispatch = useAppDispatch as Mock;
const mockedUseAppSelector = useAppSelector as Mock;
const mockedResetFilters = vi.mocked(resetFilters);

describe('ResetFilterButton component', () => {
  const mockDispatch = vi.fn();
  let onResetSpy: Mock;

  beforeEach(() => {
    mockedUseAppDispatch.mockReturnValue(mockDispatch);
    onResetSpy = vi.fn();
    mockedResetFilters.mockClear();
    mockDispatch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders button with correct text and attributes', () => {
    mockedUseAppSelector.mockImplementation((selector: (state: State) => unknown) => {
      const mockState = makeFakeStore();
      return selector(mockState);
    });

    render(<ResetFilterButtonMemo />);

    const button = screen.getByRole('button', { name: 'Сбросить фильтры' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn', 'catalog-filter__reset-btn');
    expect(button).toHaveAttribute('type', 'reset');
    expect(button).toHaveAttribute('tabindex', '0');
  });

  it('enables button when at least one filter is active', () => {
    mockedUseAppSelector.mockImplementation((selector: (state: State) => unknown) => {
      const mockState = makeFakeStore({
        FILTERS: { category: 'photocamera', type: [], level: [], minPrice: null, maxPrice: null },
      });
      return selector(mockState);
    });

    render(<ResetFilterButtonMemo />);

    const button = screen.getByRole('button', { name: 'Сбросить фильтры' });
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'false');
  });

  it('calls dispatch(resetFilters) on click', async () => {
    const user = userEvent.setup();
    mockedUseAppSelector.mockImplementation((selector: (state: State) => unknown) => {
      const mockState = makeFakeStore({
        FILTERS: {
          category: 'photocamera',
          level: [],
          type: [],
          minPrice: null,
          maxPrice: null,
        }
      });
      return selector(mockState);
    });

    render(<ResetFilterButtonMemo />);

    const button = screen.getByRole('button', { name: 'Сбросить фильтры' });
    await user.click(button);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockedResetFilters).toHaveBeenCalledTimes(1);
  });

  it('calls onReset callback if provided', async () => {
    const user = userEvent.setup();
    mockedUseAppSelector.mockImplementation((selector: (state: State) => unknown) => {
      const mockState = makeFakeStore({
        FILTERS: {
          category: 'photocamera',
          level: [],
          type: [],
          minPrice: null,
          maxPrice: null,
        }
      });
      return selector(mockState);
    });

    render(<ResetFilterButtonMemo onReset={onResetSpy} />);

    const button = screen.getByRole('button', { name: 'Сбросить фильтры' });
    await user.click(button);

    expect(onResetSpy).toHaveBeenCalledTimes(1);
  });

  it('calls reset on Enter key press', async () => {
    const user = userEvent.setup();
    mockedUseAppSelector.mockImplementation((selector: (state: State) => unknown) => {
      const mockState = makeFakeStore({
        FILTERS: {
          category: 'photocamera',
          level: [],
          type: [],
          minPrice: null,
          maxPrice: null,
        }
      });
      return selector(mockState);
    });

    render(<ResetFilterButtonMemo />);

    const button = screen.getByRole('button', { name: 'Сбросить фильтры' });
    button.focus();
    await user.keyboard('{Enter}');

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockedResetFilters).toHaveBeenCalledTimes(1);
  });

  it('calls reset on Space key press', async () => {
    const user = userEvent.setup();
    mockedUseAppSelector.mockImplementation((selector: (state: State) => unknown) => {
      const mockState = makeFakeStore({
        FILTERS: {
          category: 'photocamera',
          level: [],
          type: [],
          minPrice: null,
          maxPrice: null,
        }
      });
      return selector(mockState);
    });

    render(<ResetFilterButtonMemo />);

    const button = screen.getByRole('button', { name: 'Сбросить фильтры' });
    button.focus();
    await user.keyboard(' ');


    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockedResetFilters).toHaveBeenCalledTimes(1);
  });
});
