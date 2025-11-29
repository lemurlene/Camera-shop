import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, type Mock } from 'vitest';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { changeType } from '../../store/filters';
import { TypeFilterMemo } from './type-filter';
import { Types, TYPE_KEYS } from '../../const/const';
import { State } from '../../store/type';
import { makeFakeStore } from '../../mocks/make-fake-store';

vi.mock('../../hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../../store/filters', async (): Promise<{ [key: string]: unknown }> => {
  const actual = await vi.importActual<{ [key: string]: unknown }>('../../store/filters');
  return {
    ...actual,
    changeType: vi.fn(),
  };
});

const mockedUseAppDispatch = useAppDispatch as Mock;
const mockedUseAppSelector = useAppSelector as Mock;
const mockedChangeType = vi.mocked(changeType);

describe('TypeFilter component', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    mockedUseAppDispatch.mockReturnValue(mockDispatch);
    mockedUseAppSelector.mockImplementation((selector: (state: State) => unknown) => {
      const mockState = makeFakeStore();
      return selector(mockState);
    });
    mockDispatch.mockClear();
    mockedChangeType.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders all type checkboxes', () => {
    render(<TypeFilterMemo />);

    TYPE_KEYS.forEach((typeKey) => {
      expect(screen.getByLabelText(Types[typeKey])).toBeInTheDocument();
    });

    expect(screen.getByText('Тип камеры')).toBeInTheDocument();
  });

  it('calls changeType when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(<TypeFilterMemo />);

    const checkbox = screen.getByLabelText(Types[TYPE_KEYS[0]]);
    await user.click(checkbox);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockedChangeType).toHaveBeenCalledWith(TYPE_KEYS[0]);
  });

  it('calls changeType when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<TypeFilterMemo />);

    const checkbox = screen.getByLabelText(Types[TYPE_KEYS[0]]);
    checkbox.focus();
    await user.keyboard('{Enter}');

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockedChangeType).toHaveBeenCalledWith(TYPE_KEYS[0]);
  });

  it('calls changeType when Space key is pressed', async () => {
    const user = userEvent.setup();
    render(<TypeFilterMemo />);

    const checkbox = screen.getByLabelText(Types[TYPE_KEYS[0]]);
    checkbox.focus();
    await user.keyboard(' ');

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockedChangeType).toHaveBeenCalledWith(TYPE_KEYS[0]);
  });

  it('disables film and snapshot types when category is videocamera', () => {
    mockedUseAppSelector.mockImplementation((selector: (state: State) => unknown) => {
      const mockState = makeFakeStore({
        FILTERS: {
          category: 'videocamera',
          level: [],
          type: [],
          minPrice: null,
          maxPrice: null,
        }
      });
      return selector(mockState);
    });

    render(<TypeFilterMemo />);

    const filmCheckbox = screen.getByLabelText(Types.film);
    const snapshotCheckbox = screen.getByLabelText(Types.snapshot);

    expect(filmCheckbox).toBeDisabled();
    expect(snapshotCheckbox).toBeDisabled();

    TYPE_KEYS
      .filter((typeKey) => typeKey !== 'film' && typeKey !== 'snapshot')
      .forEach((typeKey) => {
        expect(screen.getByLabelText(Types[typeKey])).not.toBeDisabled();
      });
  });

  it('marks checkboxes as checked based on currentType', () => {
    const selectedTypes = [TYPE_KEYS[0], TYPE_KEYS[2]];

    mockedUseAppSelector.mockImplementation((selector: (state: State) => unknown) => {
      const mockState = makeFakeStore({
        FILTERS: {
          category: null,
          level: [],
          type: selectedTypes,
          minPrice: null,
          maxPrice: null,
        }
      });
      return selector(mockState);
    });

    render(<TypeFilterMemo />);

    TYPE_KEYS.forEach((typeKey) => {
      const checkbox = screen.getByLabelText(Types[typeKey]);
      if (selectedTypes.includes(typeKey)) {
        expect(checkbox).toBeChecked();
      } else {
        expect(checkbox).not.toBeChecked();
      }
    });
  });

  it('sets correct aria attributes', () => {
    const selectedTypes = [TYPE_KEYS[0]];

    mockedUseAppSelector.mockImplementation((selector: (state: State) => unknown) => {
      const mockState = makeFakeStore({
        FILTERS: {
          category: 'videocamera',
          level: [],
          type: selectedTypes,
          minPrice: null,
          maxPrice: null,
        }
      });
      return selector(mockState);
    });

    render(<TypeFilterMemo />);

    const filmCheckbox = screen.getByLabelText(Types.film);
    expect(filmCheckbox).toHaveAttribute('aria-disabled', 'true');
    expect(filmCheckbox).toHaveAttribute('aria-checked', 'false');

    const selectedCheckbox = screen.getByLabelText(Types[selectedTypes[0]]);
    expect(selectedCheckbox).toHaveAttribute('aria-checked', 'true');
  });

  it('has correct fieldset structure', () => {
    render(<TypeFilterMemo />);

    const fieldset = screen.getByRole('group');
    expect(fieldset).toHaveClass('catalog-filter__block');

    const legend = screen.getByText('Тип камеры');
    expect(legend).toHaveClass('title', 'title--h5');

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(TYPE_KEYS.length);
  });

  it('is memoized component', () => {
    expect(typeof TypeFilterMemo).toBe('object');
    expect(TypeFilterMemo).toHaveProperty('$$typeof');
  });

  it('handles empty currentType correctly', () => {
    mockedUseAppSelector.mockImplementation((selector: (state: State) => unknown) => {
      const mockState = makeFakeStore({
        FILTERS: {
          category: null,
          level: [],
          type: [],
          minPrice: null,
          maxPrice: null,
        }
      });
      return selector(mockState);
    });

    render(<TypeFilterMemo />);

    TYPE_KEYS.forEach((typeKey) => {
      expect(screen.getByLabelText(Types[typeKey])).not.toBeChecked();
    });
  });
});
