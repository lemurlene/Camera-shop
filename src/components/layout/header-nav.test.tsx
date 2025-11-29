import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HeaderNav from './header-nav';

vi.mock('./nav-list', () => ({
  default: vi.fn(() => <ul data-testid="nav-list">Navigation List</ul>),
}));

describe('HeaderNav', () => {
  it('should render navigation with correct attributes', () => {
    render(<HeaderNav />);

    const nav = screen.getByTestId('header-nav');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('main-nav');
    expect(nav).toHaveClass('header__main-nav');
  });

  it('should render NavList component', () => {
    render(<HeaderNav />);

    expect(screen.getByTestId('nav-list')).toBeInTheDocument();
  });
});
