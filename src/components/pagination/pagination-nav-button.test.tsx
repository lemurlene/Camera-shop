import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import PaginationNavButton from './pagination-nav-button';
import type { ReactNode } from 'react';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<object>('react-router-dom');
  return {
    ...actual,
    Link: ({
      to,
      children,
      onClick,
      className
    }: {
      to: string;
      children: ReactNode;
      onClick?: () => void;
      className?: string;
    }) => (
      <a href={to} onClick={onClick} className={className}>
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

  const renderWithRouter = (component: React.ReactElement) => render(<BrowserRouter>{component}</BrowserRouter>);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render previous button with correct label', () => {
    renderWithRouter(
      <PaginationNavButton {...defaultProps} type="prev" />
    );

    const button = screen.getByText('Назад');
    expect(button).toBeInTheDocument();
  });

  it('should render next button with correct label', () => {
    renderWithRouter(
      <PaginationNavButton {...defaultProps} type="next" />
    );

    const button = screen.getByText('Далее');
    expect(button).toBeInTheDocument();
  });

  it('should render with correct link URL', () => {
    renderWithRouter(
      <PaginationNavButton {...defaultProps} type="next" />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/page/2');
  });

  it('should call onPageClick when clicked', async () => {
    const user = userEvent.setup();
    const onPageClick = vi.fn();

    renderWithRouter(
      <PaginationNavButton
        {...defaultProps}
        type="next"
        onPageClick={onPageClick}
      />
    );

    const link = screen.getByRole('link');
    await user.click(link);

    expect(onPageClick).toHaveBeenCalledTimes(1);
    expect(onPageClick).toHaveBeenCalledWith(2);
  });

  it('should have correct CSS classes', () => {
    renderWithRouter(
      <PaginationNavButton {...defaultProps} type="next" />
    );

    const listItem = screen.getByRole('listitem');
    const link = screen.getByRole('link');

    expect(listItem).toHaveClass('pagination__item');
    expect(link).toHaveClass('pagination__link');
    expect(link).toHaveClass('pagination__link--text');
  });

  it('should use createPageUrl function to generate URL', () => {
    const createPageUrl = vi.fn((page: number) => `/custom/page/${page}`);

    renderWithRouter(
      <PaginationNavButton
        type="next"
        targetPage={5}
        createPageUrl={createPageUrl}
        onPageClick={vi.fn()}
      />
    );

    expect(createPageUrl).toHaveBeenCalledWith(5);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/custom/page/5');
  });

  it('should handle different target pages correctly', () => {
    const { rerender } = renderWithRouter(
      <PaginationNavButton
        type="next"
        targetPage={1}
        createPageUrl={(page) => `/page/${page}`}
        onPageClick={vi.fn()}
      />
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/page/1');

    rerender(
      <BrowserRouter>
        <PaginationNavButton
          type="prev"
          targetPage={10}
          createPageUrl={(page) => `/page/${page}`}
          onPageClick={vi.fn()}
        />
      </BrowserRouter>
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/page/10');
  });
});
