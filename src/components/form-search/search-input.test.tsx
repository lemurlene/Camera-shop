import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SearchInputMemo } from './search-input';

describe('SearchInput component', () => {
  const defaultProps = {
    searchValue: '',
    isListOpen: false,
    onInputChange: vi.fn(),
    onInputFocus: vi.fn(),
    onKeyDown: vi.fn(),
    inputRef: { current: null },
  };

  it('should render correctly with basic props', () => {
    render(<SearchInputMemo {...defaultProps} />);

    const input = screen.getByPlaceholderText('Поиск по сайту');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('autoComplete', 'off');
    expect(input).toHaveValue('');
  });

  it('should display search value correctly', () => {
    const props = {
      ...defaultProps,
      searchValue: 'test search',
    };

    render(<SearchInputMemo {...props} />);

    const input = screen.getByPlaceholderText('Поиск по сайту');
    expect(input).toHaveValue('test search');
  });

  it('should call onInputChange when input value changes', async () => {
    const user = userEvent.setup();
    const mockOnInputChange = vi.fn();

    const props = {
      ...defaultProps,
      onInputChange: mockOnInputChange,
    };

    render(<SearchInputMemo {...props} />);

    const input = screen.getByPlaceholderText('Поиск по сайту');
    await user.click(input);
    await user.paste('new value');

    expect(mockOnInputChange).toHaveBeenCalledWith('new value');
    expect(mockOnInputChange).toHaveBeenCalledTimes(1);
  });

  it('should call onInputFocus when input is focused', async () => {
    const user = userEvent.setup();
    const mockOnInputFocus = vi.fn();

    const props = {
      ...defaultProps,
      onInputFocus: mockOnInputFocus,
    };

    render(<SearchInputMemo {...props} />);

    const input = screen.getByPlaceholderText('Поиск по сайту');
    await user.click(input);

    expect(mockOnInputFocus).toHaveBeenCalledTimes(1);
  });

  it('should call onKeyDown when key is pressed', async () => {
    const user = userEvent.setup();
    const mockOnKeyDown = vi.fn();

    const props = {
      ...defaultProps,
      onKeyDown: mockOnKeyDown,
    };

    render(<SearchInputMemo {...props} />);

    const input = screen.getByPlaceholderText('Поиск по сайту');
    await user.type(input, '{Enter}');

    expect(mockOnKeyDown).toHaveBeenCalledTimes(1);
  });

  it('should have correct aria attributes when list is closed', () => {
    const props = {
      ...defaultProps,
      isListOpen: false,
    };

    render(<SearchInputMemo {...props} />);

    const input = screen.getByPlaceholderText('Поиск по сайту');
    expect(input).toHaveAttribute('aria-haspopup', 'listbox');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-controls', 'search-suggestions');
  });

  it('should have correct aria attributes when list is open', () => {
    const props = {
      ...defaultProps,
      isListOpen: true,
    };

    render(<SearchInputMemo {...props} />);

    const input = screen.getByPlaceholderText('Поиск по сайту');
    expect(input).toHaveAttribute('aria-expanded', 'true');
  });

  it('should render search icon', () => {
    render(<SearchInputMemo {...defaultProps} />);

    const svg = document.querySelector('.form-search__icon');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
  });
});
