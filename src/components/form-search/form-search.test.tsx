import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, type MockedFunction } from 'vitest';

import FormSearch from './form-search';
import { useAppSelector } from '../../hooks';

vi.mock('../../store/offers', () => ({
  selectOffers: vi.fn(),
}));

vi.mock('../../hooks', async () => {
  const actual = await vi.importActual<typeof import('../../hooks')>('../../hooks');
  return {
    ...actual,
    useAppSelector: vi.fn(),
  };
});

type OfferLike = { id: number; name: string };

describe('FormSearch', () => {
  const mockedUseAppSelector = useAppSelector as unknown as MockedFunction<typeof useAppSelector>;

  const offers: OfferLike[] = [
    { id: 1, name: 'Ретрокамера Dus Auge lV' },
    { id: 2, name: 'Камера SnapShot Pro' },
    { id: 3, name: 'Экшен-камера Go Action' },
  ];

  const renderWithRouter = (ui: React.ReactElement) =>
    render(<MemoryRouter>{ui}</MemoryRouter>);

  const getContainer = () =>
    screen.getByRole('search').closest('.form-search') as HTMLElement;

  const getInput = () =>
    screen.getByPlaceholderText('Поиск по сайту') ;

  const getResetButton = () =>
    document.querySelector('button.form-search__reset') ;

  const queryListContainer = () =>
    document.querySelector('.form-search__select-list') ;

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAppSelector.mockReturnValue(offers as unknown);
  });

  it('renders input; list is closed initially; reset hidden', () => {
    renderWithRouter(<FormSearch />);

    expect(getInput()).toBeInTheDocument();
    expect(getInput()).toHaveAttribute('aria-expanded', 'false');

    expect(getContainer()).not.toHaveClass('list-opened');
    expect(queryListContainer()).toBeNull();

    const reset = getResetButton();
    expect(reset).toBeTruthy();
    expect(reset!).toHaveAttribute('aria-label', 'Сбросить поиск');
    expect(reset!).toHaveStyle('display: none');
  });

  it('does not open list when input has < 3 chars; reset becomes visible after 1 char', () => {
    renderWithRouter(<FormSearch />);

    fireEvent.change(getInput(), { target: { value: 'ка' } });

    expect(getInput()).toHaveValue('ка');
    expect(getContainer()).not.toHaveClass('list-opened');
    expect(getInput()).toHaveAttribute('aria-expanded', 'false');
    expect(queryListContainer()).toBeNull();

    expect(getResetButton()).toBeTruthy();
    expect(getResetButton()!).toHaveStyle('display: flex');
  });

  it('opens list and shows results when input has 3+ chars and matches exist', () => {
    renderWithRouter(<FormSearch />);

    fireEvent.change(getInput(), { target: { value: 'кам' } });

    expect(getContainer()).toHaveClass('list-opened');
    expect(getInput()).toHaveAttribute('aria-expanded', 'true');

    const list = queryListContainer();
    expect(list).toBeInTheDocument();

    expect(screen.queryByText(/ничего не найдено/i)).not.toBeInTheDocument();
  });

  it('shows "Ничего не найдено" when 3+ chars but nothing matches', () => {
    renderWithRouter(<FormSearch />);

    fireEvent.change(getInput(), { target: { value: 'zzz' } });

    expect(getContainer()).toHaveClass('list-opened');
    expect(queryListContainer()).toBeInTheDocument();
    expect(screen.getByText(/ничего не найдено/i)).toBeInTheDocument();
  });

  it('closes list and clears input when reset button is clicked', async () => {
    renderWithRouter(<FormSearch />);

    fireEvent.change(getInput(), { target: { value: 'кам' } });
    expect(getContainer()).toHaveClass('list-opened');

    const reset = getResetButton();
    expect(reset).toBeTruthy();

    fireEvent.click(reset!);

    await waitFor(() => {
      expect(getInput()).toHaveValue('');
      expect(getInput()).toHaveAttribute('aria-expanded', 'false');
      expect(getContainer()).not.toHaveClass('list-opened');
      expect(queryListContainer()).toBeNull();
      expect(getResetButton()!).toHaveStyle('display: none');
    });
  });

  it('closes list on outside click', async () => {
    renderWithRouter(<FormSearch />);

    fireEvent.change(getInput(), { target: { value: 'кам' } });
    expect(getContainer()).toHaveClass('list-opened');

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(getContainer()).not.toHaveClass('list-opened');
      expect(getInput()).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('closes list on Escape when list is open', async () => {
    renderWithRouter(<FormSearch />);

    fireEvent.change(getInput(), { target: { value: 'кам' } });
    expect(getContainer()).toHaveClass('list-opened');

    fireEvent.keyDown(getInput(), { key: 'Escape' });

    await waitFor(() => {
      expect(getContainer()).not.toHaveClass('list-opened');
      expect(getInput()).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
