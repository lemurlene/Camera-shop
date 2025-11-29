import { render, screen, fireEvent } from '@testing-library/react';
import ButtonUp from './button-up';

const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
});

describe('ButtonUp component', () => {
  beforeEach(() => {
    mockScrollTo.mockClear();
  });

  it('renders button with correct attributes', () => {
    render(<ButtonUp />);

    const button = screen.getByRole('link');
    expect(button).toHaveClass('up-btn');
    expect(button).toHaveAttribute('href', '#header');
  });

  it('renders arrow icon', () => {
    render(<ButtonUp />);

    const svg = screen.getByRole('link').querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '12');
    expect(svg).toHaveAttribute('height', '18');
    expect(svg).toHaveAttribute('aria-hidden', 'true');

    const useElement = svg?.querySelector('use');
    expect(useElement).toHaveAttribute('xlink:href', '#icon-arrow2');
  });

  it('calls scrollTo with smooth behavior when clicked', () => {
    render(<ButtonUp />);

    const button = screen.getByRole('link');
    fireEvent.click(button);

    expect(mockScrollTo).toHaveBeenCalledTimes(1);
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('prevents default link behavior when clicked', () => {
    render(<ButtonUp />);

    const button = screen.getByRole('link');
    const mockPreventDefault = vi.fn();
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    clickEvent.preventDefault = mockPreventDefault;

    fireEvent(button, clickEvent);

    expect(mockPreventDefault).toHaveBeenCalledTimes(1);
  });

  it('is memoized', () => {
    expect(ButtonUp.$$typeof).toBe(Symbol.for('react.memo'));
    expect(ButtonUp.type).toBeDefined();
  });
});
