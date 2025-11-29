import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { SearchListMemo } from './search-list';
import { AppRoute } from '../../const/enum';
import { mockOffers } from '../../mocks/mock-offers';

const defaultProps = {
  isListOpen: true,
  searchValue: 'test',
  offers: mockOffers,
  focusedIndex: -1,
  onSuggestionClick: vi.fn(),
  onSuggestionHover: vi.fn(),
  listRef: { current: null },
};

const renderWithRouter = (component: React.ReactElement) => render(<BrowserRouter>{component}</BrowserRouter>);

describe('SearchList component', () => {
  it('should not render when isListOpen is false', () => {
    const props = {
      ...defaultProps,
      isListOpen: false,
    };

    renderWithRouter(<SearchListMemo {...props} />);

    const list = screen.queryByRole('listbox');
    expect(list).not.toBeInTheDocument();
  });

  it('should render "Ничего не найдено" when no offers and searchValue exists', () => {
    const props = {
      ...defaultProps,
      offers: [],
      searchValue: 'test',
    };

    renderWithRouter(<SearchListMemo {...props} />);

    const notFound = screen.getByText('Ничего не найдено');
    expect(notFound).toBeInTheDocument();
    expect(notFound).toHaveClass('form-search__select-item');
  });

  it('should not render when no offers and no searchValue', () => {
    const props = {
      ...defaultProps,
      offers: [],
      searchValue: '',
    };

    renderWithRouter(<SearchListMemo {...props} />);

    const list = screen.queryByRole('listbox');
    expect(list).not.toBeInTheDocument();
  });

  it('should render list with offers when isListOpen is true and offers exist', () => {
    renderWithRouter(<SearchListMemo {...defaultProps} />);

    const list = screen.getByRole('listbox');
    expect(list).toBeInTheDocument();
    expect(list).toHaveAttribute('id', 'search-suggestions');
    expect(list).toHaveAttribute('aria-label', 'Результаты поиска');
    expect(list).toHaveClass('form-search__select-list');

    const items = screen.getAllByRole('option');
    expect(items).toHaveLength(6);
  });

  it('should apply focused class to focused item', () => {
    const props = {
      ...defaultProps,
      focusedIndex: 1,
    };

    renderWithRouter(<SearchListMemo {...props} />);

    const items = screen.getAllByRole('option');
    expect(items[0]).not.toHaveClass('form-search__select-item--focused');
    expect(items[1]).toHaveClass('form-search__select-item--focused');
    expect(items[2]).not.toHaveClass('form-search__select-item--focused');
  });

  it('should set aria-selected for focused item', () => {
    const props = {
      ...defaultProps,
      focusedIndex: 0,
    };

    renderWithRouter(<SearchListMemo {...props} />);

    const items = screen.getAllByRole('option');
    expect(items[0]).toHaveAttribute('aria-selected', 'true');
    expect(items[1]).toHaveAttribute('aria-selected', 'false');
    expect(items[2]).toHaveAttribute('aria-selected', 'false');
  });

  it('should call onSuggestionHover when mouse enters item', async () => {
    const user = userEvent.setup();
    const mockOnSuggestionHover = vi.fn();

    const props = {
      ...defaultProps,
      onSuggestionHover: mockOnSuggestionHover,
    };

    renderWithRouter(<SearchListMemo {...props} />);

    const items = screen.getAllByRole('option');
    await user.hover(items[1]);

    expect(mockOnSuggestionHover).toHaveBeenCalledWith(1);
    expect(mockOnSuggestionHover).toHaveBeenCalledTimes(1);
  });

  it('should call onSuggestionClick and navigate when item is clicked', async () => {
    const user = userEvent.setup();
    const mockOnSuggestionClick = vi.fn();

    const props = {
      ...defaultProps,
      onSuggestionClick: mockOnSuggestionClick,
    };

    renderWithRouter(<SearchListMemo {...props} />);

    const firstItem = screen.getByText('Ретрокамера Dus Auge lV');
    await user.click(firstItem);

    expect(mockOnSuggestionClick).toHaveBeenCalledWith(mockOffers[0]);
    expect(mockOnSuggestionClick).toHaveBeenCalledTimes(1);

    expect(window.location.pathname).toBe(`${AppRoute.Catalog}/${mockOffers[0].id}`);
  });

  it('should have correct accessibility attributes', () => {
    renderWithRouter(<SearchListMemo {...defaultProps} />);

    const items = screen.getAllByRole('option');
    items.forEach((item) => {
      expect(item).toHaveAttribute('tabIndex', '-1');
      expect(item).toHaveAttribute('role', 'option');
      expect(item).toHaveClass('form-search__select-item');
    });
  });
});
