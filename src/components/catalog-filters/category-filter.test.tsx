import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, type Mock } from 'vitest';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { changeCategory } from '../../store/filters';
import { Categories, CATEGORY_KEYS } from '../../const/const';
import { CategoryFilterMemo } from './category-filter';
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
    changeCategory: vi.fn(),
  };
});

const mockedUseAppDispatch = useAppDispatch as Mock;
const mockedUseAppSelector = useAppSelector as Mock;
const mockedChangeCategory = vi.mocked(changeCategory);

describe('CategoryFilter component', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    mockedUseAppDispatch.mockReturnValue(mockDispatch);
    mockedChangeCategory.mockClear();
    mockDispatch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders all category radio buttons and legend', () => {
    mockedUseAppSelector.mockImplementation((selector: (state: State) => unknown) => {
      const mockState = makeFakeStore();
      return selector(mockState);
    });

    render(<CategoryFilterMemo />);

    expect(screen.getByText('Категория')).toBeInTheDocument();
    expect(screen.getByText('Категория')).toHaveClass('title', 'title--h5');

    CATEGORY_KEYS.forEach((categoryKey) => {
      const labelText = Categories[categoryKey];
      const radio = screen.getByLabelText(labelText);
      expect(radio).toBeInTheDocument();
      expect(radio).toHaveAttribute('type', 'radio');
      expect(radio).toHaveAttribute('name', 'category');
      expect(radio).not.toBeChecked(); //
    });
  });

  it('marks radio as checked when currentCategory matches', () => {
    const selectedCategory = CATEGORY_KEYS[1];

    mockedUseAppSelector.mockImplementation((selector: (state: State) => unknown) => {
      const mockState = makeFakeStore({
        FILTERS: {
          category: selectedCategory,
          level: [],
          type: [],
          minPrice: null,
          maxPrice: null,
        }
      });
      return selector(mockState);
    });

    render(<CategoryFilterMemo />);

    CATEGORY_KEYS.forEach((categoryKey) => {
      const radio = screen.getByLabelText(Categories[categoryKey]);
      if (categoryKey === selectedCategory) {
        expect(radio).toBeChecked();
        expect(radio).toHaveAttribute('aria-checked', 'true');
      } else {
        expect(radio).not.toBeChecked();
        expect(radio).toHaveAttribute('aria-checked', 'false');
      }
    });
  });

  it('calls changeCategory when radio is clicked', async () => {
    const user = userEvent.setup();
    const targetCategory = CATEGORY_KEYS[0];

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

    render(<CategoryFilterMemo />);

    const radio = screen.getByLabelText(Categories[targetCategory]);
    await user.click(radio);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockedChangeCategory).toHaveBeenCalledWith(targetCategory);
  });

  it('calls changeCategory when Enter is pressed on radio', async () => {
    const user = userEvent.setup();
    const targetCategory = CATEGORY_KEYS[0];


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


    render(<CategoryFilterMemo />);

    const radio = screen.getByRole('radio', {
      name: Categories[targetCategory],
    });
    radio.focus();
    await user.keyboard('{Enter}');


    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockedChangeCategory).toHaveBeenCalledWith(targetCategory);
  });

  it('calls changeCategory when Space is pressed on radio', async () => {
    const user = userEvent.setup();
    const targetCategory = CATEGORY_KEYS[1];

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

    render(<CategoryFilterMemo />);

    const radio = screen.getByLabelText(Categories[targetCategory]);
    radio.focus();
    await user.keyboard(' ');

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockedChangeCategory).toHaveBeenCalledWith(targetCategory);
  });

  it('resets category when Enter is pressed on already selected radio', () => {
    const currentCategory = CATEGORY_KEYS[2];

    mockedUseAppSelector.mockImplementation((selector: (state: State) => unknown) => {
      const mockState = makeFakeStore({
        FILTERS: {
          category: currentCategory,
          level: [],
          type: [],
          minPrice: null,
          maxPrice: null,
        }
      });
      return selector(mockState);
    });
  });
});
