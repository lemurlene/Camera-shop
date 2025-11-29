import { describe, it, expect, vi, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PaginationList from './pagination-list';
import PaginationItem from './pagination-item';
import PaginationNavButton from './pagination-nav-button';

interface PaginationItemProps {
  page: number | string;
  currentPage: number;
  createPageUrl: (page: number) => string;
  onPageClick: (page: number) => void;
}

interface PaginationNavButtonProps {
  type: 'prev' | 'next';
  targetPage: number;
  createPageUrl: (page: number) => string;
  onPageClick: (page: number) => void;
}

vi.mock('./pagination-item', () => ({
  default: vi.fn(({ page }: PaginationItemProps) => (
    <li data-testid={`pagination-item-${page}`}>
      {typeof page === 'number' ? `Page ${page}` : page}
    </li>
  ))
}));

vi.mock('./pagination-nav-button', () => ({
  default: vi.fn(({ type, targetPage }: PaginationNavButtonProps) => (
    <li data-testid={`pagination-nav-${type}`}>
      {type === 'prev' ? 'Previous' : 'Next'} to {targetPage}
    </li>
  ))
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('PaginationList', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    paginationRange: [1, 2, 3, '...', 10] as (number | string)[],
    createPageUrl: (page: number) => `/page/${page}`,
    onPageClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render without crashing', () => {
      render(<PaginationList {...defaultProps} />, { wrapper });

      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getByRole('list')).toHaveClass('pagination__list');
    });

    it('should render all pagination items from range', () => {
      render(<PaginationList {...defaultProps} />, { wrapper });

      expect(PaginationItem).toHaveBeenCalledTimes(5);

      const expectedPage1: Partial<PaginationItemProps> = { page: 1 };
      const expectedPage2: Partial<PaginationItemProps> = { page: 2 };
      const expectedPage3: Partial<PaginationItemProps> = { page: 3 };
      const expectedDots: Partial<PaginationItemProps> = { page: '...' };
      const expectedPage10: Partial<PaginationItemProps> = { page: 10 };

      expect(PaginationItem).toHaveBeenCalledWith(
        expect.objectContaining(expectedPage1),
        {}
      );
      expect(PaginationItem).toHaveBeenCalledWith(
        expect.objectContaining(expectedPage2),
        {}
      );
      expect(PaginationItem).toHaveBeenCalledWith(
        expect.objectContaining(expectedPage3),
        {}
      );
      expect(PaginationItem).toHaveBeenCalledWith(
        expect.objectContaining(expectedDots),
        {}
      );
      expect(PaginationItem).toHaveBeenCalledWith(
        expect.objectContaining(expectedPage10),
        {}
      );
    });

    it('should generate unique keys for dots by checking calls order', () => {
      const paginationRange = [1, '...', 3, 4, 5, '...', 10] as (number | string)[];
      render(
        <PaginationList
          {...defaultProps}
          paginationRange={paginationRange}
        />,
        { wrapper }
      );

      const calls = (PaginationItem as Mock).mock.calls as [PaginationItemProps, unknown][];

      expect(calls[1][0].page).toBe('...');
      expect(calls[5][0].page).toBe('...');
      expect(calls).toHaveLength(7);
    });
  });

  describe('navigation buttons visibility', () => {
    it('should render previous button when currentPage > 1', () => {
      render(
        <PaginationList
          {...defaultProps}
          currentPage={2}
        />,
        { wrapper }
      );

      const expectedProps: Partial<PaginationNavButtonProps> = {
        type: 'prev',
        targetPage: 1
      };

      expect(PaginationNavButton).toHaveBeenCalledWith(
        expect.objectContaining(expectedProps),
        {}
      );
    });

    it('should not render previous button when currentPage is 1', () => {
      render(<PaginationList {...defaultProps} currentPage={1} />, { wrapper });

      const navButtonCalls = (PaginationNavButton as Mock).mock.calls as [PaginationNavButtonProps, unknown][];
      const hasPrevButton = navButtonCalls.some((call: [PaginationNavButtonProps, unknown]) =>
        call[0].type === 'prev'
      );

      expect(hasPrevButton).toBe(false);
    });

    it('should render next button when currentPage < totalPages', () => {
      render(
        <PaginationList
          {...defaultProps}
          currentPage={5}
          totalPages={10}
        />,
        { wrapper }
      );

      const expectedProps: Partial<PaginationNavButtonProps> = {
        type: 'next',
        targetPage: 6
      };

      expect(PaginationNavButton).toHaveBeenCalledWith(
        expect.objectContaining(expectedProps),
        {}
      );
    });

    it('should not render next button when currentPage equals totalPages', () => {
      render(
        <PaginationList
          {...defaultProps}
          currentPage={10}
          totalPages={10}
        />,
        { wrapper }
      );

      const navButtonCalls = (PaginationNavButton as Mock).mock.calls as [PaginationNavButtonProps, unknown][];
      const hasNextButton = navButtonCalls.some((call: [PaginationNavButtonProps, unknown]) =>
        call[0].type === 'next'
      );

      expect(hasNextButton).toBe(false);
    });

    it('should render both navigation buttons when on middle page', () => {
      render(
        <PaginationList
          {...defaultProps}
          currentPage={5}
          totalPages={10}
        />,
        { wrapper }
      );

      const navButtonCalls = (PaginationNavButton as Mock).mock.calls as [PaginationNavButtonProps, unknown][];

      const hasPrevButton = navButtonCalls.some((call: [PaginationNavButtonProps, unknown]) =>
        call[0].type === 'prev'
      );
      const hasNextButton = navButtonCalls.some((call: [PaginationNavButtonProps, unknown]) =>
        call[0].type === 'next'
      );

      expect(hasPrevButton).toBe(true);
      expect(hasNextButton).toBe(true);
    });
  });

  describe('props handling', () => {
    it('should pass correct props to PaginationItem', () => {
      const createPageUrl = vi.fn((page: number) => `/test/${page}`);
      const onPageClick = vi.fn();

      render(
        <PaginationList
          {...defaultProps}
          currentPage={3}
          createPageUrl={createPageUrl}
          onPageClick={onPageClick}
        />,
        { wrapper }
      );

      const expectedProps: Partial<PaginationItemProps> = {
        currentPage: 3,
        createPageUrl: createPageUrl,
        onPageClick: onPageClick
      };

      expect(PaginationItem).toHaveBeenCalledWith(
        expect.objectContaining(expectedProps),
        {}
      );
    });

    it('should pass correct props to PaginationNavButton', () => {
      const createPageUrl = vi.fn((page: number) => `/test/${page}`);
      const onPageClick = vi.fn();

      render(
        <PaginationList
          {...defaultProps}
          currentPage={5}
          createPageUrl={createPageUrl}
          onPageClick={onPageClick}
        />,
        { wrapper }
      );

      const expectedProps: Partial<PaginationNavButtonProps> = {
        createPageUrl: createPageUrl,
        onPageClick: onPageClick
      };

      expect(PaginationNavButton).toHaveBeenCalledWith(
        expect.objectContaining(expectedProps),
        {}
      );
    });
  });

  describe('edge cases', () => {
    it('should handle single page', () => {
      render(
        <PaginationList
          {...defaultProps}
          currentPage={1}
          totalPages={1}
          paginationRange={[1]}
        />,
        { wrapper }
      );

      const navButtonCalls = (PaginationNavButton as Mock).mock.calls;
      expect(navButtonCalls).toHaveLength(0);
      expect(PaginationItem).toHaveBeenCalledTimes(1);
    });

    it('should handle empty pagination range', () => {
      render(
        <PaginationList
          {...defaultProps}
          paginationRange={[]}
        />,
        { wrapper }
      );

      expect(PaginationItem).toHaveBeenCalledTimes(0);
    });

    it('should handle complex pagination range with multiple dots', () => {
      const complexRange = [1, '...', 4, 5, 6, '...', 20] as (number | string)[];
      render(
        <PaginationList
          {...defaultProps}
          paginationRange={complexRange}
        />,
        { wrapper }
      );

      expect(PaginationItem).toHaveBeenCalledTimes(7);

      const calls = (PaginationItem as Mock).mock.calls as [PaginationItemProps, unknown][];
      expect(calls[1][0].page).toBe('...');
      expect(calls[5][0].page).toBe('...');
    });

    it('should handle dots counter reset by checking render behavior', () => {
      const firstRange = [1, '...', 10] as (number | string)[];
      const { rerender } = render(
        <PaginationList
          {...defaultProps}
          paginationRange={firstRange}
        />,
        { wrapper }
      );
      (PaginationItem as Mock).mockClear();

      const secondRange = [1, '...', 5, '...', 10] as (number | string)[];
      rerender(
        <PaginationList
          {...defaultProps}
          paginationRange={secondRange}
        />
      );

      const calls = (PaginationItem as Mock).mock.calls as [PaginationItemProps, unknown][];

      const dotsPages = calls
        .map(([props]: [PaginationItemProps, unknown]) => props.page)
        .filter((page) => page === '...');

      expect(dotsPages).toHaveLength(2);
      expect(dotsPages[0]).toBe('...');
      expect(dotsPages[1]).toBe('...');
    });
  });

  describe('accessibility', () => {
    it('should have proper list structure', () => {
      render(<PaginationList {...defaultProps} />, { wrapper });

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(list).toHaveClass('pagination__list');
    });

    it('should maintain consistent structure across renders', () => {
      const { rerender } = render(
        <PaginationList {...defaultProps} currentPage={1} />,
        { wrapper }
      );

      const initialList = screen.getByRole('list');

      rerender(
        <PaginationList {...defaultProps} currentPage={2} />
      );

      const updatedList = screen.getByRole('list');
      expect(updatedList).toBe(initialList);
    });
  });
});
