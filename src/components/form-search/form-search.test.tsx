import { render, screen, fireEvent } from '@testing-library/react';
import { vi, type Mock } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { mockOffers } from '../../mocks/mock-offers';
import FormSearch from './form-search';

vi.mock('../../hooks', () => ({
  useAppSelector: vi.fn(),
}));

vi.mock('../../store/offers', () => ({
  selectOffers: vi.fn(),
}));

const mockedUseAppSelector = useAppSelector as Mock;

describe('FormSearch component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAppSelector.mockReturnValue(mockOffers);
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  const renderWithRouter = (component: React.ReactElement) => render(<MemoryRouter>{component}</MemoryRouter>);

  it('renders search input, reset button and list container', () => {
    renderWithRouter(<FormSearch />);

    const input = screen.getByPlaceholderText('Поиск по сайту');
    expect(input).toBeInTheDocument();

    const resetButton = screen.getByLabelText('Сбросить поиск');
    expect(resetButton).toBeInTheDocument();

    const list = screen.queryByRole('listbox');
    expect(list).not.toBeInTheDocument();
  });

  it('displays filtered offers when input value changes', () => {
    renderWithRouter(<FormSearch />);

    const input = screen.getByPlaceholderText('Поиск по сайту');
    fireEvent.change(input, { target: { value: 's' } });

    const list = screen.getByRole('listbox');
    expect(list).toBeInTheDocument();

    const items = screen.getAllByRole('option');
    expect(items.length).toBeGreaterThan(0);
  });

  it('closes list and clears input when reset button is clicked', () => {
    renderWithRouter(<FormSearch />);

    const input = screen.getByPlaceholderText('Поиск по сайту');
    const resetButton = screen.getByLabelText('Сбросить поиск');

    fireEvent.change(input, { target: { value: 's' } });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.click(resetButton);

    expect(input).toHaveValue('');

    expect(screen.queryByRole('listbox')).not.toHaveClass('list-open');
  });

  it('handles keyboard navigation (ArrowDown, ArrowUp, Escape)', () => {
    renderWithRouter(<FormSearch />);

    const input = screen.getByPlaceholderText('Поиск по сайту');

    fireEvent.change(input, { target: { value: 's' } });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'ArrowDown' });

    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes list when clicking outside', () => {
    renderWithRouter(<FormSearch />);

    const input = screen.getByPlaceholderText('Поиск по сайту');
    fireEvent.change(input, { target: { value: 's' } });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('scrolls to focused item when index changes', () => {
    renderWithRouter(<FormSearch />);

    const input = screen.getByPlaceholderText('Поиск по сайту');
    fireEvent.change(input, { target: { value: 'камера' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('applies "list-opened" class when list is open', () => {
    renderWithRouter(<FormSearch />);

    const formContainer = screen.getByRole('search').closest('.form-search');
    expect(formContainer).toBeInTheDocument();
    expect(formContainer).not.toHaveClass('list-opened');

    const input = screen.getByPlaceholderText('Поиск по сайту');
    fireEvent.change(input, { target: { value: 's' } });

    expect(formContainer).toHaveClass('list-opened');
  });

  it('does not submit form on Enter in input', () => {
    const mockSubmit = vi.fn();

    renderWithRouter(<FormSearch />);

    const form = screen.getByRole('search');
    form.onsubmit = mockSubmit;

    const input = screen.getByPlaceholderText('Поиск по сайту');

    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockSubmit).not.toHaveBeenCalled();
    expect(form).toBeInTheDocument();
  });

  it('selects offer on Enter when list is open', () => {
    renderWithRouter(<FormSearch />);

    const input = screen.getByPlaceholderText('Поиск по сайту');

    fireEvent.change(input, { target: { value: 'Ретрокамера' } });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input).toHaveValue('Ретрокамера Dus Auge lV');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('handles ArrowUp navigation correctly', () => {
    renderWithRouter(<FormSearch />);

    const input = screen.getByPlaceholderText('Поиск по сайту');

    fireEvent.change(input, { target: { value: 's' } });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'ArrowUp' });

    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });
});
