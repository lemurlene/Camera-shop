import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './layout';
import { AppRoute } from '../../const/enum';
import { getLayoutState } from './utils';

vi.mock('./header-basket-link', () => ({
  default: vi.fn(() => <div data-testid="header-basket-link" />),
}));

vi.mock('./logo', () => ({
  default: vi.fn(() => <div data-testid="logo" />),
}));

vi.mock('./header-nav', () => ({
  default: vi.fn(() => <div data-testid="header-nav" />),
}));

vi.mock('../form-search', () => ({
  default: vi.fn(() => <div data-testid="form-search" />),
}));

vi.mock('../buttons', () => ({
  ButtonUpMemo: vi.fn(() => <div data-testid="button-up" />),
}));

vi.mock('./footer', () => ({
  default: vi.fn(() => <div data-testid="footer" />),
}));

vi.mock('../modals', () => ({
  default: vi.fn(() => <div data-testid="modal-container" />),
}));

vi.mock('../../contexts', () => ({
  ModalProvider: vi.fn(({ children }) => <div data-testid="modal-provider">{children}</div>),
}));

vi.mock('./utils', () => ({
  getLayoutState: vi.fn(() => ({
    logoAriaLabel: 'Переход на главную',
    correctStyle: {},
    isRenderButtonUp: false,
  })),
}));

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLayout = (initialRoute: string = AppRoute.Root) => render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="*" element={<Layout />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  );

  it('should render complete layout structure', () => {
    renderLayout();

    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();

    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('header-nav')).toBeInTheDocument();
    expect(screen.getByTestId('form-search')).toBeInTheDocument();
    expect(screen.getByTestId('header-basket-link')).toBeInTheDocument();

    expect(screen.getByTestId('footer')).toBeInTheDocument();

    expect(screen.getByTestId('modal-container')).toBeInTheDocument();
  });

  it('should conditionally render button up based on route', () => {
    vi.mocked(getLayoutState).mockReturnValueOnce({
      logoAriaLabel: 'Переход на главную',
      correctStyle: {},
      isRenderButtonUp: false,
    });
    renderLayout(AppRoute.Root);
    expect(screen.queryByTestId('button-up')).not.toBeInTheDocument();

    vi.mocked(getLayoutState).mockReturnValueOnce({
      logoAriaLabel: 'Переход на главную',
      correctStyle: {},
      isRenderButtonUp: true,
    });
    renderLayout(AppRoute.Offer);
    expect(screen.getByTestId('button-up')).toBeInTheDocument();
  });

  it('should render nested content via Outlet', () => {
    const TestContent = () => <div data-testid="outlet-content">Outlet Content</div>;

    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/test']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="test" element={<TestContent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
    expect(screen.getByText('Outlet Content')).toBeInTheDocument();
  });
});
