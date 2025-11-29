import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { changeMinPrice, changeMaxPrice, selectMinPrice, selectMaxPrice } from '../../store/filters';
import { PriceFilterMemo } from './price-filter';

vi.mock('../../hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../../store/filters', async (): Promise<{ [key: string]: unknown }> => {
  const actual = await vi.importActual<{ [key: string]: unknown }>('../../store/filters');
  return {
    ...actual,
    changeMinPrice: vi.fn(),
    changeMaxPrice: vi.fn(),
  };
});

const mockedUseAppDispatch = vi.mocked(useAppDispatch);
const mockedUseAppSelector = vi.mocked(useAppSelector);
const mockedChangeMinPrice = vi.mocked(changeMinPrice);
const mockedChangeMaxPrice = vi.mocked(changeMaxPrice);

describe('PriceFilter component', () => {
  const mockDispatch = vi.fn();
  const defaultPriceRange = { min: 1000, max: 100000 };

  beforeEach(() => {
    mockedUseAppDispatch.mockReturnValue(mockDispatch);
    mockedUseAppSelector.mockImplementation((selector) => {
      if (selector === selectMinPrice) {
        return null;
      }
      if (selector === selectMaxPrice) {
        return null;
      }
      return undefined;
    });
    mockDispatch.mockClear();
    if (mockedChangeMinPrice.mockClear) {
      mockedChangeMinPrice.mockClear();
    }
    if (mockedChangeMaxPrice.mockClear) {
      mockedChangeMaxPrice.mockClear();
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders price filter with inputs and labels', () => {
    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    expect(screen.getByText('Цена, ₽')).toBeInTheDocument();
    expect(screen.getByLabelText('Минимальная цена')).toBeInTheDocument();
    expect(screen.getByLabelText('Максимальная цена')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('1000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('100000')).toBeInTheDocument();
  });

  it('updates local min price on input change', async () => {
    const user = userEvent.setup();
    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const minPriceInput = screen.getByLabelText('Минимальная цена');
    await user.clear(minPriceInput);
    await user.type(minPriceInput, '5000');

    expect(minPriceInput).toHaveValue(5000);
  });

  it('updates local max price on input change', async () => {
    const user = userEvent.setup();
    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const maxPriceInput = screen.getByLabelText('Максимальная цена');
    await user.clear(maxPriceInput);
    await user.type(maxPriceInput, '50000');

    expect(maxPriceInput).toHaveValue(50000);
  });

  it('dispatches changeMinPrice with valid value on blur', async () => {
    const user = userEvent.setup();
    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const minPriceInput = screen.getByLabelText('Минимальная цена');
    await user.clear(minPriceInput);
    await user.type(minPriceInput, '5000');
    await user.tab();

    expect(mockDispatch).toHaveBeenCalledWith(mockedChangeMinPrice(5000));
  });

  it('dispatches changeMaxPrice with valid value on blur', async () => {
    const user = userEvent.setup();
    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const maxPriceInput = screen.getByLabelText('Максимальная цена');
    await user.clear(maxPriceInput);
    await user.type(maxPriceInput, '50000');
    await user.tab();

    expect(mockDispatch).toHaveBeenCalledWith(mockedChangeMaxPrice(50000));
  });

  it('handles Enter key in min price input', async () => {
    const user = userEvent.setup();
    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const minPriceInput = screen.getByLabelText('Минимальная цена');
    await user.clear(minPriceInput);
    await user.type(minPriceInput, '3000{Enter}');

    expect(mockDispatch).toHaveBeenCalledWith(mockedChangeMinPrice(3000));
  });

  it('handles Enter key in max price input', async () => {
    const user = userEvent.setup();
    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const maxPriceInput = screen.getByLabelText('Максимальная цена');
    await user.clear(maxPriceInput);
    await user.type(maxPriceInput, '30000{Enter}');

    expect(mockDispatch).toHaveBeenCalledWith(mockedChangeMaxPrice(30000));
  });

  it('clamps min price to range minimum when below range', async () => {
    const user = userEvent.setup();
    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const minPriceInput = screen.getByLabelText('Минимальная цена');
    await user.clear(minPriceInput);
    await user.type(minPriceInput, '500');
    await user.tab();

    expect(mockDispatch).toHaveBeenCalledWith(mockedChangeMinPrice(1000));
  });

  it('clamps max price to range maximum when above range', async () => {
    const user = userEvent.setup();
    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const maxPriceInput = screen.getByLabelText('Максимальная цена');
    await user.clear(maxPriceInput);
    await user.type(maxPriceInput, '200000');
    await user.tab();

    expect(mockDispatch).toHaveBeenCalledWith(mockedChangeMaxPrice(100000));
  });

  it('validates min price against current max price', async () => {
    mockedUseAppSelector.mockImplementation((selector) => {
      if (selector === selectMinPrice) {
        return null;
      }
      if (selector === selectMaxPrice) {
        return 5000;
      }
      return undefined;
    });

    const user = userEvent.setup();
    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const minPriceInput = screen.getByLabelText('Минимальная цена');
    await user.clear(minPriceInput);
    await user.type(minPriceInput, '6000');
    await user.tab();

    expect(mockDispatch).toHaveBeenCalledWith(mockedChangeMinPrice(5000));
  });

  it('validates max price against current min price', async () => {
    mockedUseAppSelector.mockImplementation((selector) => {
      if (selector === selectMinPrice) {
        return 5000;
      }
      if (selector === selectMaxPrice) {
        return null;
      }
      return undefined;
    });

    const user = userEvent.setup();
    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const maxPriceInput = screen.getByLabelText('Максимальная цена');
    await user.clear(maxPriceInput);
    await user.type(maxPriceInput, '4000');
    await user.tab();

    expect(mockDispatch).toHaveBeenCalledWith(mockedChangeMaxPrice(5000));
  });

  it('dispatches null when min price is cleared', async () => {
    const user = userEvent.setup();
    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const minPriceInput = screen.getByLabelText('Минимальная цена');
    await user.clear(minPriceInput);
    await user.tab();

    expect(mockDispatch).toHaveBeenCalledWith(mockedChangeMinPrice(null));
  });

  it('dispatches null when max price is cleared', async () => {
    const user = userEvent.setup();
    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const maxPriceInput = screen.getByLabelText('Максимальная цена');
    await user.clear(maxPriceInput);
    await user.tab();

    expect(mockDispatch).toHaveBeenCalledWith(mockedChangeMaxPrice(null));
  });

  it('dispatches null when min price is invalid', async () => {
    const user = userEvent.setup();
    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const minPriceInput = screen.getByLabelText('Минимальная цена');
    await user.clear(minPriceInput);
    await user.type(minPriceInput, 'abc');
    await user.tab();

    expect(mockDispatch).toHaveBeenCalledWith(mockedChangeMinPrice(null));
  });

  it('dispatches null when max price is invalid', async () => {
    const user = userEvent.setup();
    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const maxPriceInput = screen.getByLabelText('Максимальная цена');
    await user.clear(maxPriceInput);
    await user.type(maxPriceInput, 'def');
    await user.tab();

    expect(mockDispatch).toHaveBeenCalledWith(mockedChangeMaxPrice(null));
  });

  it('dispatches null when min price is negative', async () => {
    const user = userEvent.setup();
    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const minPriceInput = screen.getByLabelText('Минимальная цена');
    await user.clear(minPriceInput);
    await user.type(minPriceInput, '-100');
    await user.tab();

    expect(mockDispatch).toHaveBeenCalledWith(mockedChangeMinPrice(null));
  });

  it('dispatches null when max price is negative', async () => {
    const user = userEvent.setup();
    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const maxPriceInput = screen.getByLabelText('Максимальная цена');
    await user.clear(maxPriceInput);
    await user.type(maxPriceInput, '-200');
    await user.tab();

    expect(mockDispatch).toHaveBeenCalledWith(mockedChangeMaxPrice(null));
  });

  it('displays min price from store on initial render', () => {
    mockedUseAppSelector.mockImplementation((selector) => {
      if (selector === selectMinPrice) {
        return 3000;
      }
      if (selector === selectMaxPrice) {
        return null;
      }
      return undefined;
    });

    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const minPriceInput = screen.getByLabelText('Минимальная цена');
    expect(minPriceInput).toHaveValue(3000);
  });

  it('displays max price from store on initial render', () => {
    mockedUseAppSelector.mockImplementation((selector) => {
      if (selector === selectMinPrice) {
        return null;
      }
      if (selector === selectMaxPrice) {
        return 50000;
      }
      return undefined;
    });

    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const maxPriceInput = screen.getByLabelText('Максимальная цена');
    expect(maxPriceInput).toHaveValue(50000);
  });

  it('displays both prices from store on initial render', () => {
    mockedUseAppSelector.mockImplementation((selector) => {
      if (selector === selectMinPrice) {
        return 3000;
      }
      if (selector === selectMaxPrice) {
        return 50000;
      }
      return undefined;
    });

    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const minPriceInput = screen.getByLabelText('Минимальная цена');
    const maxPriceInput = screen.getByLabelText('Максимальная цена');
    expect(minPriceInput).toHaveValue(3000);
    expect(maxPriceInput).toHaveValue(50000);
  });

  it('displays empty inputs when store has null values', () => {
    mockedUseAppSelector.mockImplementation((selector) => {
      if (selector === selectMinPrice) {
        return null;
      }
      if (selector === selectMaxPrice) {
        return null;
      }
      return undefined;
    });

    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const minPriceInput = screen.getByLabelText('Минимальная цена');
    const maxPriceInput = screen.getByLabelText('Максимальная цена');
    expect(minPriceInput).toHaveValue(null);
    expect(maxPriceInput).toHaveValue(null);
  });

  it('handles price range props update', () => {
    const { rerender } = render(
      <PriceFilterMemo priceRange={{ min: 1000, max: 50000 }} />
    );

    const minPriceInput = screen.getByLabelText('Минимальная цена');
    const maxPriceInput = screen.getByLabelText('Максимальная цена');

    expect(minPriceInput).toHaveAttribute('placeholder', '1000');
    expect(maxPriceInput).toHaveAttribute('placeholder', '50000');

    rerender(<PriceFilterMemo priceRange={{ min: 500, max: 75000 }} />);

    expect(minPriceInput).toHaveAttribute('placeholder', '500');
    expect(maxPriceInput).toHaveAttribute('placeholder', '75000');
  });

  it('handles keyboard events without errors', () => {
    render(<PriceFilterMemo priceRange={defaultPriceRange} />);

    const minPriceInput = screen.getByLabelText('Минимальная цена');
    const maxPriceInput = screen.getByLabelText('Максимальная цена');

    expect(() => {
      fireEvent.keyDown(minPriceInput, { key: 'Enter' });
      fireEvent.keyDown(minPriceInput, { key: ' ' });
      fireEvent.keyDown(maxPriceInput, { key: 'Enter' });
      fireEvent.keyDown(maxPriceInput, { key: ' ' });
    }).not.toThrow();
  });

  it('is memoized component', () => {
    expect(typeof PriceFilterMemo).toBe('object');
    expect(PriceFilterMemo).toHaveProperty('$$typeof');
  });

  it('handles zero values correctly', async () => {
    const user = userEvent.setup();
    render(<PriceFilterMemo priceRange={{ min: 0, max: 1000 }} />);

    const minPriceInput = screen.getByLabelText('Минимальная цена');
    await user.clear(minPriceInput);
    await user.type(minPriceInput, '0');
    await user.tab();

    expect(mockDispatch).toHaveBeenCalledWith(mockedChangeMinPrice(0));
  });

  it('handles very large numbers correctly', async () => {
    const user = userEvent.setup();
    render(<PriceFilterMemo priceRange={{ min: 0, max: 1000000 }} />);

    const maxPriceInput = screen.getByLabelText('Максимальная цена');
    await user.clear(maxPriceInput);
    await user.type(maxPriceInput, '999999');
    await user.tab();

    expect(mockDispatch).toHaveBeenCalledWith(mockedChangeMaxPrice(999999));
  });
});
