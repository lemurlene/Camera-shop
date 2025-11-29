import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from './footer';

vi.mock('./logo', () => ({
  default: vi.fn(() => <div data-testid="logo" />),
}));

vi.mock('./social-links', () => ({
  default: vi.fn(() => <div data-testid="social-links" />),
}));

vi.mock('./nav-list', () => ({
  default: vi.fn(() => <ul data-testid="nav-list" />),
}));

vi.mock('./footer-items', () => ({
  FooterItemsMemo: vi.fn(() => <li data-testid="footer-items" />),
}));

describe('Footer Component', () => {
  it('should render footer with correct structure', () => {
    render(<Footer />);

    expect(screen.getByTestId('footerId')).toBeInTheDocument();
    expect(screen.getByTestId('footerId')).toHaveClass('footer');
  });

  it('should render all required sections', () => {
    render(<Footer />);

    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('social-links')).toBeInTheDocument();
    expect(screen.getByTestId('nav-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('footer-items')).toHaveLength(2);
  });

  it('should render description text', () => {
    render(<Footer />);

    expect(screen.getByText('Интернет-магазин фото- и видеотехники')).toBeInTheDocument();
  });
});
