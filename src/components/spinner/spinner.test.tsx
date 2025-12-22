import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Spinner from './spinner';
import { Hourglass } from 'react-loader-spinner';

type HourglassProps = {
  visible: boolean;
  height: string;
  width: string;
  ariaLabel: string;
  wrapperStyle: Record<string, unknown>;
  wrapperClass: string;
  colors: string[];
};

vi.mock('react-loader-spinner', () => ({
  Hourglass: vi.fn(() => (
    <div data-testid="hourglass-spinner">Mock Hourglass Spinner</div>
  )),
}));

describe('Spinner Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders spinner wrapper', () => {
    render(<Spinner />);

    const wrapper = screen.getByTestId('spinner-wrapper');
    expect(wrapper).toBeInTheDocument();

    expect(wrapper.tagName).toBe('DIV');
  });

  it('renders Hourglass inside wrapper', () => {
    render(<Spinner />);

    const wrapper = screen.getByTestId('spinner-wrapper');
    const spinner = screen.getByTestId('hourglass-spinner');

    expect(spinner).toBeInTheDocument();
    expect(wrapper).toContainElement(spinner);
  });

  it('passes correct props to Hourglass', () => {
    render(<Spinner />);

    expect(vi.mocked(Hourglass)).toHaveBeenCalledTimes(1);

    const [props] = vi.mocked(Hourglass).mock.calls[0] as unknown as [HourglassProps];

    expect(props).toMatchObject({
      visible: true,
      height: '80',
      width: '80',
      ariaLabel: 'hourglass-loading',
      wrapperStyle: {},
      wrapperClass: '',
      colors: ['#65cd54', '#7575e2'],
    });
  });

  it('does not re-render with same props (memo)', () => {
    const { rerender } = render(<Spinner />);

    const initialCallCount = vi.mocked(Hourglass).mock.calls.length;

    rerender(<Spinner />);

    expect(vi.mocked(Hourglass).mock.calls.length).toBe(initialCallCount);
  });
});
