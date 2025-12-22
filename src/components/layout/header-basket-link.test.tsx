import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppRoute } from '../../const/enum';

let totalQuantity = 0;

vi.mock('../../contexts', () => ({
  useCart: () => ({
    getTotalQuantity: () => totalQuantity,
  }),
}));

import HeaderBasketLink from './header-basket-link';

describe('HeaderBasketLink', () => {
  beforeEach(() => {
    totalQuantity = 0;
  });

  it('renders basket link with correct class and href', () => {
    render(
      <MemoryRouter>
        <HeaderBasketLink />
      </MemoryRouter>
    );

    const link = screen.getByRole('link') ;

    expect(link).toBeTruthy();
    expect(link.classList.contains('header__basket-link')).toBe(true);
    expect(link.getAttribute('href')).toBe(AppRoute.Basket);
  });

  it('renders basket icon svg + use', () => {
    render(
      <MemoryRouter>
        <HeaderBasketLink />
      </MemoryRouter>
    );

    const link = screen.getByRole('link') ;
    const svg = link.querySelector('svg') as SVGElement | null;

    expect(svg).not.toBeNull();
    if (!svg) {
      return;
    }

    expect(svg.getAttribute('width')).toBe('16');
    expect(svg.getAttribute('height')).toBe('16');
    expect(svg.getAttribute('aria-hidden')).toBe('true');

    const useEl = svg.querySelector('use') ;
    expect(useEl).not.toBeNull();
    if (!useEl) {
      return;
    }

    const href =
      useEl.getAttribute('xlink:href') ??
      useEl.getAttribute('href') ??
      useEl.getAttribute('xlinkHref');

    expect(href).toBe('#icon-basket');
  });

  it('does not render counter when totalItems = 0', () => {
    totalQuantity = 0;

    render(
      <MemoryRouter>
        <HeaderBasketLink />
      </MemoryRouter>
    );

    const link = screen.getByRole('link') ;
    expect(link.querySelector('.header__basket-count')).toBeNull();
  });

  it('renders counter when totalItems > 0', () => {
    totalQuantity = 3;

    render(
      <MemoryRouter>
        <HeaderBasketLink />
      </MemoryRouter>
    );

    const link = screen.getByRole('link') ;
    const counter = link.querySelector('.header__basket-count') ;

    expect(counter).not.toBeNull();
    expect(counter?.textContent).toBe('3');
  });
});
