import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Spinner from './spinner';
import { Hourglass } from 'react-loader-spinner';

vi.mock('react-loader-spinner', () => ({
  Hourglass: vi.fn((props) => (
    <div data-testid="hourglass-spinner" {...props}>
      Mock Hourglass Spinner
    </div>
  ))
}));

describe('Spinner Component', () => {
  describe('spinner rendering', () => {
    it('should render spinner wrapper', () => {
      render(<Spinner />);

      const wrapper = screen.getByTestId('spinner-wrapper');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper.tagName).toBe('P');
    });

    it('should render Hourglass spinner with correct props', () => {
      render(<Spinner />);

      expect(Hourglass).toHaveBeenCalledWith(
        {
          visible: true,
          height: '80',
          width: '80',
          ariaLabel: 'hourglass-loading',
          wrapperStyle: {},
          wrapperClass: '',
          colors: ['#65cd54', '#7575e2']
        },
        {}
      );
    });

    it('should render Hourglass spinner inside wrapper', () => {
      render(<Spinner />);

      const wrapper = screen.getByTestId('spinner-wrapper');
      const spinner = screen.getByTestId('hourglass-spinner');

      expect(spinner).toBeInTheDocument();
      expect(wrapper).toContainElement(spinner);
    });
  });

  describe('spinner props', () => {
    it('should have correct accessibility attributes', () => {
      render(<Spinner />);

      expect(Hourglass).toHaveBeenCalledWith(
        expect.objectContaining({
          ariaLabel: 'hourglass-loading',
          visible: true
        }),
        {}
      );
    });

    it('should have correct dimensions', () => {
      render(<Spinner />);

      expect(Hourglass).toHaveBeenCalledWith(
        expect.objectContaining({
          height: '80',
          width: '80'
        }),
        {}
      );
    });

    it('should have correct colors', () => {
      render(<Spinner />);

      expect(Hourglass).toHaveBeenCalledWith(
        expect.objectContaining({
          colors: ['#65cd54', '#7575e2']
        }),
        {}
      );
    });

    it('should have empty wrapper styles', () => {
      render(<Spinner />);

      expect(Hourglass).toHaveBeenCalledWith(
        expect.objectContaining({
          wrapperStyle: {},
          wrapperClass: ''
        }),
        {}
      );
    });
  });

  describe('memo functionality', () => {
    it('should be memoized', () => {
      expect(Spinner).toHaveProperty('type');
      expect(Spinner).toHaveProperty('compare');
    });

    it('should not re-render with same props', () => {
      const { rerender } = render(<Spinner />);

      const initialCallCount = vi.mocked(Hourglass).mock.calls.length;

      rerender(<Spinner />);

      expect(vi.mocked(Hourglass).mock.calls.length).toBe(initialCallCount);
    });
  });

  describe('visual presentation', () => {
    it('should render without errors', () => {
      expect(() => render(<Spinner />)).not.toThrow();
    });

    it('should match expected structure', () => {
      render(<Spinner />);

      const wrapper = screen.getByTestId('spinner-wrapper');
      const spinner = screen.getByTestId('hourglass-spinner');

      expect(wrapper).toBeInTheDocument();
      expect(spinner).toBeInTheDocument();
    });
  });
});
