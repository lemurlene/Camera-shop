import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import NotFoundPage from './not-found-page';

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

describe('NotFoundPage', () => {
  it('should render correctly', () => {
    renderWithRouter(<NotFoundPage />);

    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText('404 Page not found')).toBeInTheDocument();
    expect(screen.getByText('Вернуться на главную')).toBeInTheDocument();
  });

  it('should render with correct classes', () => {
    renderWithRouter(<NotFoundPage />);

    const heading = screen.getByText('404 Page not found');
    const link = screen.getByTestId('link');

    expect(heading).toHaveClass('title', 'title--h2');
    expect(link).toHaveClass('btn', 'btn--purple');
  });

  it('should have correct link to home page', () => {
    renderWithRouter(<NotFoundPage />);

    const link = screen.getByTestId('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('should have correct page structure', () => {
    const { container } = renderWithRouter(<NotFoundPage />);

    const pageContent = container.querySelector('.page-content');
    expect(pageContent).toBeInTheDocument();
    expect(pageContent).toHaveAttribute('data-testid', 'not-found-page');

    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toBeInTheDocument();
  });

  it('should display 404 error message', () => {
    renderWithRouter(<NotFoundPage />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('404 Page not found');
  });
});
