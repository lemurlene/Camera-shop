import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HeaderBasketLink from './header-basket-link';
import { AppRoute } from '../../const/enum';

describe('HeaderBasketLink', () => {
  it('should render basket link with correct attributes', () => {
    render(
      <MemoryRouter>
        <HeaderBasketLink />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass('header__basket-link');
    expect(link).toHaveAttribute('href', AppRoute.Basket);
  });

  it('should render basket icon', () => {
    render(
      <MemoryRouter>
        <HeaderBasketLink />
      </MemoryRouter>
    );

    const svg = screen.getByRole('link').querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
    expect(svg).toHaveAttribute('aria-hidden', 'true');

    const useElement = svg?.querySelector('use');
    expect(useElement).toBeInTheDocument();
    expect(useElement).toHaveAttribute('xlink:href', '#icon-basket');
  });
});
