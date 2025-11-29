import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import DevelopmentPage from './development-page';
import { AppRoute } from '../../const/enum';

vi.mock('../../components/breadcrumbs', () => ({
  default: function Breadcrumbs() {
    return <div data-testid="breadcrumbs">Breadcrumbs</div>;
  },
}));

vi.mock('react-router-dom', () => ({
  Link: function Link({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
    return (
      <a href={to} className={className} data-testid="link">
        {children}
      </a>
    );
  },
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const renderWithRouter = (component: React.ReactElement) => render(<BrowserRouter>{component}</BrowserRouter>);

describe('DevelopmentPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    renderWithRouter(<DevelopmentPage />);

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText('Cтраница в разработке')).toBeInTheDocument();
    expect(screen.getByText('Вернуться на главную')).toBeInTheDocument();
  });

  it('should render with correct classes', () => {
    renderWithRouter(<DevelopmentPage />);

    expect(screen.getByText('Cтраница в разработке')).toHaveClass('title', 'title--h2');
    expect(screen.getByTestId('link')).toHaveClass('btn', 'btn--purple');
  });

  it('should have correct link to home page', () => {
    renderWithRouter(<DevelopmentPage />);

    const link = screen.getByTestId('link');
    expect(link).toHaveAttribute('href', AppRoute.Root);
  });

  it('should contain breadcrumbs element', () => {
    renderWithRouter(<DevelopmentPage />);

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });
});
