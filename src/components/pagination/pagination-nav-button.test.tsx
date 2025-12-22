import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PaginationNavButton from './pagination-nav-button';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    Link: ({
      to,
      children,
      onClick,
      className,
    }: {
      to: string;
      children: ReactNode;
      onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
      className?: string;
    }) => (
      <a
        href={to}
        className={className}
        onClick={(e) => {
          e.preventDefault();
          onClick?.(e);
        }}
      >
        {children}
      </a>
    ),
  };
});

describe('PaginationNavButton', () => {
  const defaultProps = {
    targetPage: 2,
    createPageUrl: (page: number) => `/page/${page}`,
    onPageClick: vi.fn(),
  };

  const renderWithRouter = (ui: React.ReactElement) =>
    render(<MemoryRouter>{ui}</MemoryRouter>);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render previous button with correct label', () => {
    renderWithRouter(<PaginationNavButton {...defaultProps} type="prev" />);
    expect(screen.getByText('Назад')).toBeInTheDocument();
  });

  it('should render next button with correct label', () => {
    renderWithRouter(<PaginationNavButton {...defaultProps} type="next" />);
    expect(screen.getByText('Далее')).toBeInTheDocument();
  });

  it('should render with correct link URL', () => {
    renderWithRouter(<PaginationNavButton {...defaultProps} type="next" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/page/2');
  });

  it('should call onPageClick when clicked', async () => {
    const user = userEvent.setup();
    const onPageClick = vi.fn();

    renderWithRouter(
      <PaginationNavButton {...defaultProps} type="next" onPageClick={onPageClick} />
    );

    await user.click(screen.getByRole('link'));

    expect(onPageClick).toHaveBeenCalledTimes(1);
    expect(onPageClick).toHaveBeenCalledWith(2);
  });

  it('should have correct CSS classes', () => {
    renderWithRouter(<PaginationNavButton {...defaultProps} type="next" />);

    expect(screen.getByRole('listitem')).toHaveClass('pagination__item');

    const link = screen.getByRole('link');
    expect(link).toHaveClass('pagination__link');
    expect(link).toHaveClass('pagination__link--text');
  });

  it('should use createPageUrl function to generate URL', () => {
    const createPageUrl = vi.fn((page: number) => `/custom/page/${page}`);

    renderWithRouter(
      <PaginationNavButton type="next" targetPage={5} createPageUrl={createPageUrl} onPageClick={vi.fn()} />
    );

    expect(createPageUrl).toHaveBeenCalledWith(5);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/custom/page/5');
  });

  it('should handle different target pages correctly', () => {
    const { rerender } = renderWithRouter(
      <PaginationNavButton type="next" targetPage={1} createPageUrl={(page) => `/page/${page}`} onPageClick={vi.fn()} />
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/page/1');

    rerender(
      <MemoryRouter>
        <PaginationNavButton type="prev" targetPage={10} createPageUrl={(page) => `/page/${page}`} onPageClick={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/page/10');
  });
});
