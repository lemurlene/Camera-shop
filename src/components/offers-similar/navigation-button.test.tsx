import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NavigationButton from './navigation-button';

describe('NavigationButton', () => {
  describe('rendering', () => {
    it('renders as a button element', () => {
      render(<NavigationButton direction="prev" />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });

    it('has correct type attribute', () => {
      render(<NavigationButton direction="prev" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('direction-specific properties', () => {
    it('applies correct classes and label for "prev" direction', () => {
      render(<NavigationButton direction="prev" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('slider-controls', 'slider-controls--prev');
      expect(button).toHaveAttribute('aria-label', 'Предыдущий слайд');
    });

    it('applies correct classes and label for "next" direction', () => {
      render(<NavigationButton direction="next" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('slider-controls', 'slider-controls--next');
      expect(button).toHaveAttribute('aria-label', 'Следующий слайд');
    });
  });

  describe('icon rendering', () => {
    it('renders SVG icon with correct attributes', () => {
      render(<NavigationButton direction="prev" />);

      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '7');
      expect(svg).toHaveAttribute('height', '12');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders arrow icon using xlink', () => {
      render(<NavigationButton direction="next" />);

      const svg = screen.getByRole('button').querySelector('svg');
      const useElement = svg?.querySelector('use');
      expect(useElement).toBeInTheDocument();
      expect(useElement).toHaveAttribute('xlink:href', '#icon-arrow');
    });
  });

  describe('accessibility', () => {
    it('provides meaningful labels for screen readers', () => {
      const testCases = [
        { direction: 'prev' as const, expectedLabel: 'Предыдущий слайд' },
        { direction: 'next' as const, expectedLabel: 'Следующий слайд' },
      ];

      testCases.forEach(({ direction, expectedLabel }) => {
        const { unmount } = render(<NavigationButton direction={direction} />);

        expect(screen.getByLabelText(expectedLabel)).toBeInTheDocument();
        unmount();
      });
    });

    it('hides decorative SVG from accessibility tree', () => {
      render(<NavigationButton direction="prev" />);

      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
