import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import OfferPage from './offer-page';

vi.mock('../../components/wrappers', () => ({
  TabSyncWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tab-sync-wrapper">{children}</div>
  ),
}));

vi.mock('../../components/offer', () => ({
  Offer: () => <div data-testid="offer-component">Offer</div>,
}));

vi.mock('../../components/offers-similar', () => ({
  OffersSimilar: () => <div data-testid="offers-similar">Similar Offers</div>,
}));

vi.mock('../../components/breadcrumbs', () => ({
  default: () => <nav data-testid="breadcrumbs">Breadcrumbs</nav>,
}));

vi.mock('../../components/reviews', () => ({
  default: () => <div data-testid="reviews">Reviews</div>,
}));

vi.mock('../loading-page', () => ({
  default: () => <div data-testid="loading-page">Loading</div>,
}));

vi.mock('../not-found-page', () => ({
  default: () => <div data-testid="not-found-page">Not Found</div>,
}));

vi.mock('../../components/error-server', () => ({
  default: () => <div data-testid="error-server">Error</div>,
}));

vi.mock('../../hooks', () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: () => [
    { id: 1, name: 'Test' },
    false,
    false,
    [{ id: 2 }],
    false,
    [{ id: 1 }],
    false
  ],
  useId: () => '1',
}));

vi.mock('../../store/api-action', () => ({
  getOfferInfoById: vi.fn(),
  fetchOffersSimilar: vi.fn(),
  fetchOfferComments: vi.fn(),
}));

vi.mock('../../store/offer', () => ({
  setErrorConnectionStatusOffer: vi.fn(),
}));

const mockStore = configureStore({
  reducer: {
    offer: () => ({}),
    offersSimilar: () => ({}),
    reviews: () => ({}),
  }
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={mockStore}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </Provider>
);

describe('OfferPage', () => {
  it('рендерит все компоненты', () => {
    render(<OfferPage />, { wrapper: TestWrapper });

    expect(screen.getByTestId('tab-sync-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('offer-component')).toBeInTheDocument();
    expect(screen.getByTestId('offers-similar')).toBeInTheDocument();
    expect(screen.getByTestId('reviews')).toBeInTheDocument();
  });
});
