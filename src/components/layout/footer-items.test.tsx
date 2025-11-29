import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FooterItemsMemo } from './footer-items';

describe('FooterItems component', () => {
  const mockProps = {
    title: 'Навигация',
    items: [
      { href: '/catalog', text: 'Каталог' },
      { href: '/guarantees', text: 'Гарантии' },
      { href: '/delivery', text: 'Доставка' },
      { href: '/about', text: 'О компании' },
    ],
  };

  it('should render footer navigation section with title and items', () => {
    render(<FooterItemsMemo {...mockProps} />);

    const navItem = screen.getByText('Навигация').closest('li');
    expect(navItem).toBeInTheDocument();
    expect(navItem).toHaveClass('footer__nav-item');

    const title = screen.getByText('Навигация');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('footer__title');

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list).toHaveClass('footer__list');
  });

  it('should render all navigation links', () => {
    render(<FooterItemsMemo {...mockProps} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(mockProps.items.length);

    mockProps.items.forEach((item, index) => {
      const link = links[index];
      expect(link).toHaveAttribute('href', item.href);
      expect(link).toHaveTextContent(item.text);
      expect(link).toHaveClass('link');
    });
  });

  it('should render list items with correct structure', () => {
    render(<FooterItemsMemo {...mockProps} />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(1 + mockProps.items.length);

    const mainListItem = listItems[0];
    expect(mainListItem).toHaveClass('footer__nav-item');

    const innerListItems = listItems.slice(1);
    innerListItems.forEach((listItem) => {
      expect(listItem).toHaveClass('footer__item');
    });
  });

  it('should render with different props', () => {
    const differentProps = {
      title: 'Поддержка',
      items: [
        { href: '/support', text: 'Помощь' },
        { href: '/contacts', text: 'Контакты' },
      ],
    };

    render(<FooterItemsMemo {...differentProps} />);

    const title = screen.getByText('Поддержка');
    expect(title).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/support');
    expect(links[1]).toHaveAttribute('href', '/contacts');
  });

  it('should be memoized', () => {
    const { rerender } = render(<FooterItemsMemo {...mockProps} />);

    const firstRenderTitle = screen.getByText('Навигация');

    rerender(<FooterItemsMemo {...mockProps} />);

    const secondRenderTitle = screen.getByText('Навигация');
    expect(firstRenderTitle).toBe(secondRenderTitle);
  });

  it('should update when props change', () => {
    const { rerender } = render(<FooterItemsMemo {...mockProps} />);

    const newProps = {
      title: 'Информация',
      items: [
        { href: '/info', text: 'Инфо' },
      ],
    };

    rerender(<FooterItemsMemo {...newProps} />);

    const title = screen.getByText('Информация');
    expect(title).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', '/info');
  });

  it('should handle empty items array', () => {
    const emptyProps = {
      title: 'Пустой раздел',
      items: [],
    };

    render(<FooterItemsMemo {...emptyProps} />);

    const title = screen.getByText('Пустой раздел');
    expect(title).toBeInTheDocument();

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();

    const links = screen.queryAllByRole('link');
    expect(links).toHaveLength(0);
  });

  it('should use text as key for items', () => {
    render(<FooterItemsMemo {...mockProps} />);

    const links = screen.getAllByRole('link');

    links.forEach((link, index) => {
      expect(link).toHaveTextContent(mockProps.items[index].text);
    });
  });
});
