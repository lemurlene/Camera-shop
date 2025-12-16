import { render, screen } from '@testing-library/react';
import LoaderOverlay from './loader-overlay';

vi.mock('../spinner/spinner', () => ({
  __esModule: true,
  default: () => <div data-testid="spinner" />,
}));

describe('LoaderOverlay component', () => {
  it('renders overlay with correct classes', () => {
    render(<LoaderOverlay />);

    const overlay = document.querySelector('.modal.is-active') ;
    expect(overlay).not.toBeNull();
  });

  it('renders spinner', () => {
    render(<LoaderOverlay />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders correct text', () => {
    render(<LoaderOverlay />);

    expect(screen.getByText(/проверка данных\.\.\./i)).toBeInTheDocument();
  });

  it('is memoized (not applicable)', () => {
    expect(LoaderOverlay).toBeDefined();
  });
});
