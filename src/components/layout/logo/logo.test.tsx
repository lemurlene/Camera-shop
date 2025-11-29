import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import Logo from './logo';
import { LogoConfigType } from './type';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useLocation: vi.fn((): Location => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default'
    })),
  };
});

vi.mock('../utils', () => ({
  getLayoutState: vi.fn(() => ({
    logoAriaLabel: 'Перейти на главную',
    correctStyle: {},
  })),
}));

const mockConfig: LogoConfigType = {
  logoClass: 'header__logo',
  logoImg: '#icon-logo',
};

describe('Logo component', () => {
  it('should render logo with correct attributes', () => {
    render(
      <MemoryRouter>
        <Logo config={mockConfig} />
      </MemoryRouter>
    );

    const logoLink = screen.getByRole('link', { name: 'Перейти на главную' });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveClass('header__logo');
    expect(logoLink).toHaveAttribute('href', '/');

    const svg = logoLink.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '100');
    expect(svg).toHaveAttribute('height', '36');
    expect(svg).toHaveAttribute('aria-hidden', 'true');

    const useElement = svg?.querySelector('use');
    expect(useElement).toHaveAttribute('xlink:href', '#icon-logo');
  });

  it('should render with different config', () => {
    const customConfig: LogoConfigType = {
      logoClass: 'footer__logo',
      logoImg: '#icon-logo-footer',
    };

    render(
      <MemoryRouter>
        <Logo config={customConfig} />
      </MemoryRouter>
    );

    const logoLink = screen.getByRole('link', { name: 'Перейти на главную' });
    expect(logoLink).toHaveClass('footer__logo');

    const svg = logoLink.querySelector('svg');
    const useElement = svg?.querySelector('use');
    expect(useElement).toHaveAttribute('xlink:href', '#icon-logo-footer');
  });
});
