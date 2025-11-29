import { render, screen } from '@testing-library/react';
import ErrorMessage from './error-message';
import { useAppSelector } from '../../hooks';

vi.mock('../../hooks', () => ({
  useAppSelector: vi.fn(),
}));

const mockedUseAppSelector = useAppSelector as jest.MockedFunction<typeof useAppSelector>;

describe('ErrorMessage component', () => {
  it('renders error message when error exists', () => {
    mockedUseAppSelector.mockReturnValue('Test error message');

    render(<ErrorMessage />);

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('returns null when no error', () => {
    mockedUseAppSelector.mockReturnValue(null);

    const { container } = render(<ErrorMessage />);

    expect(container.firstChild).toBeNull();
  });

  it('applies correct CSS class', () => {
    mockedUseAppSelector.mockReturnValue('Error with style');

    render(<ErrorMessage />);

    expect(screen.getByTestId('error-message')).toHaveClass('error-message');
  });
});
