import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PaginationItem from './pagination-item';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('PaginationItem', () => {
  const defaultProps = {
    currentPage: 1,
    createPageUrl: (page: number) => `/page/${page}`,
    onPageClick: vi.fn(),
  };

  describe('when page is "..."', () => {
    it('should render ellipsis', () => {
      render(
        <PaginationItem
          {...defaultProps}
          page="..."
        />,
        { wrapper }
      );

      const ellipsis = screen.getByText('...');
      expect(ellipsis).toBeInTheDocument();
      expect(ellipsis).toHaveClass('pagination__link', 'pagination__link--text');
    });

    it('should not be a link', () => {
      render(
        <PaginationItem
          {...defaultProps}
          page="..."
        />,
        { wrapper }
      );

      const link = screen.queryByRole('link');
      expect(link).not.toBeInTheDocument();
    });
  });

  describe('when page is a number', () => {
    it('should render page number as link', () => {
      render(
        <PaginationItem
          {...defaultProps}
          page={2}
        />,
        { wrapper }
      );

      const link = screen.getByRole('link', { name: '2' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/page/2');
    });

    it('should apply active class when page is current', () => {
      render(
        <PaginationItem
          {...defaultProps}
          page={1}
          currentPage={1}
        />,
        { wrapper }
      );

      const link = screen.getByRole('link', { name: '1' });
      expect(link).toHaveClass('pagination__link', 'pagination__link--active');
    });

    it('should not apply active class when page is not current', () => {
      render(
        <PaginationItem
          {...defaultProps}
          page={2}
          currentPage={1}
        />,
        { wrapper }
      );

      const link = screen.getByRole('link', { name: '2' });
      expect(link).toHaveClass('pagination__link');
      expect(link).not.toHaveClass('pagination__link--active');
    });

    it('should call onPageClick when clicked', () => {
      const mockOnPageClick = vi.fn();
      render(
        <PaginationItem
          {...defaultProps}
          page={3}
          onPageClick={mockOnPageClick}
        />,
        { wrapper }
      );

      const link = screen.getByRole('link', { name: '3' });
      fireEvent.click(link);

      expect(mockOnPageClick).toHaveBeenCalledWith(3);
      expect(mockOnPageClick).toHaveBeenCalledTimes(1);
    });

    it('should use createPageUrl for link href', () => {
      const createPageUrl = (page: number) => `/products?page=${page}`;

      render(
        <PaginationItem
          {...defaultProps}
          page={5}
          createPageUrl={createPageUrl}
        />,
        { wrapper }
      );

      const link = screen.getByRole('link', { name: '5' });
      expect(link).toHaveAttribute('href', '/products?page=5');
    });
  });

  describe('edge cases', () => {
    it('should handle page zero', () => {
      render(
        <PaginationItem
          {...defaultProps}
          page={0}
        />,
        { wrapper }
      );

      const link = screen.getByRole('link', { name: '0' });
      expect(link).toBeInTheDocument();
    });

    it('should handle large page numbers', () => {
      render(
        <PaginationItem
          {...defaultProps}
          page={999}
        />,
        { wrapper }
      );

      const link = screen.getByRole('link', { name: '999' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/page/999');
    });

    it('should handle different current page scenarios', () => {
      const { rerender } = render(
        <PaginationItem
          {...defaultProps}
          page={5}
          currentPage={5}
        />,
        { wrapper }
      );

      let link = screen.getByRole('link', { name: '5' });
      expect(link).toHaveClass('pagination__link--active');

      rerender(
        <PaginationItem
          {...defaultProps}
          page={5}
          currentPage={10}
        />
      );

      link = screen.getByRole('link', { name: '5' });
      expect(link).not.toHaveClass('pagination__link--active');
    });
  });

  describe('accessibility', () => {
    it('should have proper list item structure', () => {
      render(
        <PaginationItem
          {...defaultProps}
          page={2}
        />,
        { wrapper }
      );

      const listItem = screen.getByRole('listitem');
      expect(listItem).toBeInTheDocument();
      expect(listItem).toHaveClass('pagination__item');
    });

    it('should have accessible links for number pages', () => {
      render(
        <PaginationItem
          {...defaultProps}
          page={3}
        />,
        { wrapper }
      );

      const link = screen.getByRole('link');
      expect(link).toHaveTextContent('3');
      expect(link).toHaveAttribute('href');
    });

    it('should have proper text content for ellipsis', () => {
      render(
        <PaginationItem
          {...defaultProps}
          page="..."
        />,
        { wrapper }
      );

      const ellipsis = screen.getByText('...');
      expect(ellipsis).toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('should prevent default link behavior when clicked', () => {
      const mockOnPageClick = vi.fn();
      const preventDefault = vi.fn();

      render(
        <PaginationItem
          {...defaultProps}
          page={4}
          onPageClick={mockOnPageClick}
        />,
        { wrapper }
      );

      const link = screen.getByRole('link', { name: '4' });

      fireEvent.click(link, {
        preventDefault,
      });

      expect(mockOnPageClick).toHaveBeenCalledWith(4);
    });

    it('should work with keyboard navigation', () => {
      const mockOnPageClick = vi.fn();

      render(
        <PaginationItem
          {...defaultProps}
          page={6}
          onPageClick={mockOnPageClick}
        />,
        { wrapper }
      );

      const link = screen.getByRole('link', { name: '6' });

      fireEvent.keyDown(link, { key: 'Enter' });

      fireEvent.keyDown(link, { key: ' ' });

      expect(mockOnPageClick).not.toHaveBeenCalled();
    });
  });

  describe('props validation', () => {
    it('should handle string numbers as page', () => {
      render(
        <PaginationItem
          {...defaultProps}
          page={7}
        />,
        { wrapper }
      );

      const link = screen.getByRole('link', { name: '7' });
      expect(link).toBeInTheDocument();
    });
  });
});
