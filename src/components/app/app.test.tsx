import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Outlet } from 'react-router-dom';
import { makeFakeStore } from '../../mocks/make-fake-store';

let mockState = makeFakeStore();

const mockDispatch = vi.fn(() => ({
  unwrap: () => Promise.resolve(),
}));

vi.mock('../../hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: unknown) => unknown) => selector(mockState),
}));

vi.mock('../../contexts/', async () => {
  const actual = await vi.importActual<typeof import('../../contexts/')>('../../contexts/');
  const PassThrough = ({ children }: { children: React.ReactNode }) =>
    children;

  return {
    ...actual,
    UrlProvider: PassThrough,
    ModalProvider: PassThrough,
    CartProvider: PassThrough,
  };
});

vi.mock('../layout', () => ({
  default: () => (
    <div data-testid="layout">
      <Outlet />
    </div>
  ),
}));

vi.mock('../../pages/main-page', () => ({
  default: () => <div data-testid="main-page">MainPage</div>,
}));

vi.mock('../../pages/loading-page', () => ({
  default: () => <div data-testid="loading-page">LoadingPage</div>,
}));

vi.mock('../../pages/offer-page', () => ({
  default: () => <div data-testid="offer-page">OfferPage</div>,
}));

vi.mock('../../pages/development-page', () => ({
  default: () => <div data-testid="development-page">DevelopmentPage</div>,
}));

vi.mock('../../pages/not-found-page', () => ({
  default: () => <div data-testid="not-found-page">NotFoundPage</div>,
}));

vi.mock('../error-server', () => ({
  default: ({ mainPage }: { mainPage?: boolean }) => (
    <div data-testid="error-server">
      ErrorServer {mainPage ? 'with main page' : ''}
    </div>
  ),
}));

vi.mock('../../store/api-action', () => ({
  fetchOffers: vi.fn(() => ({})),
  fetchOffersPromo: vi.fn(() => ({})),
}));

vi.mock('../spinner/spinner', () => ({
  default: () => <div data-testid="spinner" />,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  const { MemoryRouter } = actual;

  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={[window.location.pathname]}>{children}</MemoryRouter>
    ),
  };
});

import * as apiActions from '../../store/api-action';
import App from '.';

describe('App component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState = makeFakeStore();
    window.history.pushState({}, '', '/');

    mockDispatch.mockImplementation(() => ({
      unwrap: () => Promise.resolve(),
    }));
  });

  const never = new Promise<void>(() => undefined);

  it('renders LoadingPage while the application is being initialized', () => {
    mockDispatch.mockImplementation(() => ({
      unwrap: () => never,
    }));

    render(<App />);

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('renders MainPage after successful initialization', async () => {
    render(<App />);
    expect(await screen.findByTestId('main-page')).toBeInTheDocument();
  });

  it('renders ErrorServer if the state has a connection error flag', async () => {
    mockState = makeFakeStore({
      OFFERS: {
        offers: [],
        isLoadingOffers: false,
        isErrorConnectionOffers: true,
      },
    });

    render(<App />);
    expect(await screen.findByTestId('error-server')).toBeInTheDocument();
  });

  it('calls fetchOffers and fetchOffersPromo on mounted', async () => {
    render(<App />);

    await screen.findByTestId('loading-page');

    expect(apiActions.fetchOffers).toHaveBeenCalledTimes(1);
    expect(apiActions.fetchOffersPromo).toHaveBeenCalledTimes(1);
  });

  it('renders MainPage using the /catalog route', async () => {
    window.history.pushState({}, '', '/catalog');

    render(<App />);
    expect(await screen.findByTestId('main-page')).toBeInTheDocument();
  });

  it('renders OfferPage using the /catalog/1 route', async () => {
    window.history.pushState({}, '', '/catalog/1');

    render(<App />);
    expect(await screen.findByTestId('offer-page')).toBeInTheDocument();
  });

  it('renders DevelopmentPage using the /guarantees route', async () => {
    window.history.pushState({}, '', '/guarantees');

    render(<App />);
    expect(await screen.findByTestId('development-page')).toBeInTheDocument();
  });

  it('renders NotFoundPage using the /Error404 route', async () => {
    window.history.pushState({}, '', '/Error404');

    render(<App />);
    expect(await screen.findByTestId('not-found-page')).toBeInTheDocument();
  });
});
