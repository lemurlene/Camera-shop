import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavList from './nav-list';
import { NAV_ITEMS } from '../const';
import { AppRoute } from '../../../const/enum';

const mockClasses = {
  list: 'nav-list',
  item: 'nav-item',
  link: 'nav-link',
  active: 'active',
};

describe('NavList Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should render all the elements of the list', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <NavList items={NAV_ITEMS} classes={mockClasses} />
      </MemoryRouter>
    );

    expect(screen.getByText('Каталог')).toBeInTheDocument();
    expect(screen.getByText('Гарантии')).toBeInTheDocument();
    expect(screen.getByText('Доставка')).toBeInTheDocument();
    expect(screen.getByText('О компании')).toBeInTheDocument();

    const list = screen.getByRole('list');
    expect(list).toHaveClass('nav-list');

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(4);
    items.forEach((item) => {
      expect(item).toHaveClass('nav-item');
    });
  });


  it('should highlight the active link', () => {
    render(
      <MemoryRouter initialEntries={[AppRoute.Catalog]}>
        <NavList items={NAV_ITEMS} classes={mockClasses} />
      </MemoryRouter>
    );

    const catalogLink = screen.getByText('Каталог').closest('a');
    expect(catalogLink).toHaveClass('nav-link');
    expect(catalogLink).toHaveClass('active');
  });

  it('should not highlight inactive links', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <NavList items={NAV_ITEMS} classes={mockClasses} />
      </MemoryRouter>
    );

    const catalogLink = screen.getByText('Каталог').closest('a');
    const guaranteesLink = screen.getByText('Гарантии').closest('a');
    const deliveryLink = screen.getByText('Доставка').closest('a');

    expect(catalogLink).not.toHaveClass('active');
    expect(guaranteesLink).not.toHaveClass('active');
    expect(deliveryLink).not.toHaveClass('active');
  });

  it('must correctly handle the absence of a class active', () => {
    const classesWithoutActive = { ...mockClasses, active: undefined };

    render(
      <MemoryRouter initialEntries={['/']}>
        <NavList items={NAV_ITEMS} classes={classesWithoutActive} />
      </MemoryRouter>
    );

    const catalogLink = screen.getByText('Каталог').closest('a');
    expect(catalogLink).toHaveClass('nav-link');
    expect(catalogLink).not.toHaveClass('active');
  });

  it('must work correctly with an empty array items', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <NavList items={[]} classes={mockClasses} />
      </MemoryRouter>
    );

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(0);
  });
});
