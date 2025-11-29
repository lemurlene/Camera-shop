import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReviewsHeader from './reviews-header';

describe('ReviewsHeader Component', () => {
  describe('header content', () => {
    it('should render correct title', () => {
      render(<ReviewsHeader />);

      const title = screen.getByText('Отзывы');
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('title', 'title--h3');
    });

    it('should render review button', () => {
      render(<ReviewsHeader />);

      const button = screen.getByRole('button', { name: 'Оставить свой отзыв' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('btn');
    });
  });

  describe('button attributes', () => {
    it('should have correct button type', () => {
      render(<ReviewsHeader />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should have button disabled', () => {
      render(<ReviewsHeader />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should not have aria-disabled when using native disabled', () => {
      render(<ReviewsHeader />);

      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('aria-disabled');
    });
  });

  describe('CSS classes and structure', () => {
    it('should apply correct CSS classes to main container', () => {
      const { container } = render(<ReviewsHeader />);

      const containerElement = container.querySelector('.page-content__headed');
      expect(containerElement).toBeInTheDocument();
    });

    it('should maintain correct DOM structure', () => {
      const { container } = render(<ReviewsHeader />);

      const containerElement = container.querySelector('.page-content__headed');
      expect(containerElement).toBeInTheDocument();

      const title = containerElement?.querySelector('.title--h3');
      expect(title).toHaveTextContent('Отзывы');

      const button = containerElement?.querySelector('.btn');
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  describe('accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<ReviewsHeader />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Отзывы');
      expect(heading).toHaveClass('title', 'title--h3');

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have proper disabled state for screen readers', () => {
      render(<ReviewsHeader />);

      const button = screen.getByRole('button');

      expect(button).toBeDisabled();

      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveTextContent('Оставить свой отзыв');
    });

    it('should have appropriate heading level for document structure', () => {
      render(<ReviewsHeader />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Отзывы');
    });
  });

  describe('visual presentation', () => {
    it('should have consistent styling classes', () => {
      render(<ReviewsHeader />);

      const container = screen.getByText('Отзывы').closest('.page-content__headed');
      expect(container).toBeInTheDocument();

      const title = screen.getByText('Отзывы');
      expect(title).toHaveClass('title', 'title--h3');

      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn');
    });
  });

  describe('component behavior', () => {
    it('should have all expected elements', () => {
      render(<ReviewsHeader />);

      expect(screen.getByText('Отзывы')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });
  });
});
