import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SpecificationsTab } from './specifications-tab';

describe('SpecificationsTab', () => {
  const defaultProps = {
    vendorCode: 'DA4IU67AD5',
    category: 'Видеокамера',
    type: 'Коллекционная',
    level: 'Нулевой',
    isActive: true,
  };

  describe('rendering', () => {
    it('renders all specification items with correct data', () => {
      render(<SpecificationsTab {...defaultProps} />);

      expect(screen.getByText('Артикул:')).toBeInTheDocument();
      expect(screen.getByText('Категория:')).toBeInTheDocument();
      expect(screen.getByText('Тип камеры:')).toBeInTheDocument();
      expect(screen.getByText('Уровень:')).toBeInTheDocument();

      expect(screen.getByText(defaultProps.vendorCode)).toBeInTheDocument();
      expect(screen.getByText(defaultProps.category)).toBeInTheDocument();
      expect(screen.getByText(defaultProps.type)).toBeInTheDocument();
      expect(screen.getByText(defaultProps.level)).toBeInTheDocument();
    });

    it('renders correct number of list items', () => {
      render(<SpecificationsTab {...defaultProps} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(4);
    });
  });

  describe('CSS classes', () => {
    it('applies is-active class when isActive is true', () => {
      render(<SpecificationsTab {...defaultProps} isActive />);

      const tabElement = screen.getByText('Артикул:').closest('.tabs__element');
      expect(tabElement).toHaveClass('is-active');
    });

    it('does not apply is-active class when isActive is false', () => {
      render(<SpecificationsTab {...defaultProps} isActive={false} />);

      const tabElement = screen.getByText('Артикул:').closest('.tabs__element');
      expect(tabElement).not.toHaveClass('is-active');
    });

    it('has correct CSS classes for list structure', () => {
      render(<SpecificationsTab {...defaultProps} />);

      expect(screen.getByRole('list')).toHaveClass('product__tabs-list');

      const listItems = screen.getAllByRole('listitem');
      listItems.forEach((item) => {
        expect(item).toHaveClass('item-list');
      });

      const titles = screen.getAllByText(/:/);
      titles.forEach((title) => {
        expect(title).toHaveClass('item-list__title');
      });

      const values = [
        defaultProps.vendorCode,
        defaultProps.category,
        defaultProps.type,
        defaultProps.level,
      ];

      values.forEach((value) => {
        const valueElement = screen.getByText(value);
        expect(valueElement).toHaveClass('item-list__text');
      });
    });
  });

  describe('accessibility', () => {
    it('has proper list semantics', () => {
      render(<SpecificationsTab {...defaultProps} />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(4);
    });
  });
});
