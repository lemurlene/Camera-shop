import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingPage from './loading-page';

vi.mock('../../components/spinner', () => ({
  default: () => <div data-testid="spinner">Spinner Component</div>
}));

describe('LoadingPage', () => {
  it('should render loading page with correct structure', () => {
    render(<LoadingPage />);

    const pageContent = screen.getByTestId('loading-page');
    expect(pageContent).toBeInTheDocument();
    expect(pageContent).toHaveClass('page-content');

    const title = screen.getByText('Page loading...');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('title', 'title--h2');

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('should have correct container structure', () => {
    render(<LoadingPage />);

    const container = screen.getByText('Page loading...').closest('.container');
    expect(container).toBeInTheDocument();
    expect(container).toContainElement(screen.getByText('Page loading...'));
    expect(container).toContainElement(screen.getByTestId('spinner'));
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      render(<LoadingPage />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Page loading...');
    });

    it('should have semantic HTML structure', () => {
      const { container } = render(<LoadingPage />);

      const divElements = container.querySelectorAll('div');
      expect(divElements.length).toBeGreaterThan(0);

      const h1Element = container.querySelector('h1');
      expect(h1Element).toHaveClass('title', 'title--h2');
    });
  });

  describe('styles and classes', () => {
    it('should have correct CSS classes', () => {
      render(<LoadingPage />);

      const pageContent = screen.getByTestId('loading-page');
      expect(pageContent).toHaveClass('page-content');

      const container = pageContent.querySelector('.container');
      expect(container).toBeInTheDocument();

      const title = screen.getByText('Page loading...');
      expect(title).toHaveClass('title', 'title--h2');
    });
  });

  describe('component integration', () => {
    it('should integrate with Spinner component correctly', () => {
      render(<LoadingPage />);

      const spinner = screen.getByTestId('spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveTextContent('Spinner Component');

      const container = screen.getByText('Page loading...').closest('.container');
      expect(container).toContainElement(spinner);
    });
  });

  describe('edge cases', () => {
    it('should render without errors when no props provided', () => {
      expect(() => render(<LoadingPage />)).not.toThrow();
    });

    it('should maintain consistent output on multiple renders', () => {
      const { rerender, container } = render(<LoadingPage />);
      const firstRender = container.innerHTML;

      rerender(<LoadingPage />);
      const secondRender = container.innerHTML;

      expect(firstRender).toBe(secondRender);
    });
  });
});
