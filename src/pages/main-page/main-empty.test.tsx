import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MainEmpty from './main-empty';

describe('MainEmpty', () => {
  it('should render main empty component with correct structure', () => {
    render(<MainEmpty />);

    const mainEmpty = screen.getByTestId('main-empty');
    expect(mainEmpty).toBeInTheDocument();
    expect(mainEmpty).toHaveClass('catalog__cards');

    const title = screen.getByText(/Техника такой категории\/типа\/уровня не найдена/i);
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('title', 'title--h3');
  });

  it('should display correct message text', () => {
    render(<MainEmpty />);

    const message = screen.getByText(
      'Техника такой категории/типа/уровня не найдена. Поменяйте фильтры.'
    );
    expect(message).toBeInTheDocument();
  });

  it('should have proper semantic HTML structure', () => {
    const { container } = render(<MainEmpty />);

    const h3Element = container.querySelector('h3');
    expect(h3Element).toBeInTheDocument();
    expect(h3Element).toHaveClass('title', 'title--h3');
  });

  describe('accessibility', () => {
    it('should have proper heading level', () => {
      render(<MainEmpty />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(
        'Техника такой категории/типа/уровня не найдена. Поменяйте фильтры.'
      );
    });

    it('should have meaningful content for screen readers', () => {
      render(<MainEmpty />);

      const message = screen.getByText(/не найдена/i);
      expect(message).toBeInTheDocument();
    });
  });

  describe('styles and classes', () => {
    it('should have correct CSS classes for styling', () => {
      render(<MainEmpty />);

      const container = screen.getByTestId('main-empty');
      expect(container).toHaveClass('catalog__cards');

      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveClass('title', 'title--h3');
    });
  });

  describe('edge cases', () => {
    it('should render without errors when no props provided', () => {
      expect(() => render(<MainEmpty />)).not.toThrow();
    });

    it('should maintain consistent output on multiple renders', () => {
      const { rerender, container } = render(<MainEmpty />);
      const firstRender = container.innerHTML;

      rerender(<MainEmpty />);
      const secondRender = container.innerHTML;

      expect(firstRender).toBe(secondRender);
    });

    it('should have no interactive elements', () => {
      render(<MainEmpty />);

      const buttons = screen.queryByRole('button');
      const links = screen.queryByRole('link');
      const inputs = screen.queryByRole('textbox');

      expect(buttons).not.toBeInTheDocument();
      expect(links).not.toBeInTheDocument();
      expect(inputs).not.toBeInTheDocument();
    });
  });

  describe('content validation', () => {
    it('should contain specific keywords in the message', () => {
      render(<MainEmpty />);

      expect(screen.getByText(/Техника/i)).toBeInTheDocument();
      expect(screen.getByText(/категории/i)).toBeInTheDocument();
      expect(screen.getByText(/типа/i)).toBeInTheDocument();
      expect(screen.getByText(/уровня/i)).toBeInTheDocument();
      expect(screen.getByText(/не найдена/i)).toBeInTheDocument();
      expect(screen.getByText(/Поменяйте фильтры/i)).toBeInTheDocument();
    });

    it('should have exactly one text message', () => {
      render(<MainEmpty />);

      const texts = screen.getAllByText(/не найдена|фильтры/i);
      expect(texts).toHaveLength(1);
    });
  });
});
