import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

vi.mock('../../contexts/', () => ({
  UrlProvider: ({ children }: { children: React.ReactNode }) => children,
  ModalProvider: ({ children }: { children: React.ReactNode }) => children,
}));

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

import * as apiActions from '../../store/api-action';
import App from '.';

describe('App component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState = makeFakeStore();
    mockDispatch.mockImplementation(() => ({
      unwrap: () => Promise.resolve(),
    }));
  });

  it('renders LoadingPage while the application is being initialized', () => {
    render(<App />);
    expect(screen.getByTestId('loading-page')).toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('renders MainPage after successful initialization', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('main-page')).toBeInTheDocument();
    });
  });

  it('renders ErrorServer if the state has a connection error flag', () => {
    mockState = makeFakeStore({
      OFFERS: {
        offers: [],
        isLoadingOffers: false,
        isErrorConnectionOffers: true,
      },
    });

    render(<App />);

    expect(screen.getByTestId('error-server')).toBeInTheDocument();
  });

  it('calls fetchOffers and fetchOffersPromo on mounted', async () => {
    render(<App />);

    await waitFor(() => {
      expect(apiActions.fetchOffers).toHaveBeenCalledTimes(1);
      expect(apiActions.fetchOffersPromo).toHaveBeenCalledTimes(1);
    });
  });

  it('renders MainPage using the /catalog route', async () => {
    window.history.pushState({}, '', '/catalog');

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('main-page')).toBeInTheDocument();
    });
  });


  it('renders OfferPage using the /catalog/1 route', async () => {
    window.history.pushState({}, '', '/catalog/1');

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('offer-page')).toBeInTheDocument();
    });
  });

  it('renders DevelopmentPage using the /guarantees route', async () => {
    window.history.pushState({}, '', '/guarantees');

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('development-page')).toBeInTheDocument();
    });
  });

  it('renders NotFoundPage using the /Error404 route', async () => {
    window.history.pushState({}, '', '/Error404');

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });
  });
});
