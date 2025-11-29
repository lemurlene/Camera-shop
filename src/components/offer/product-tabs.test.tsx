import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductTabs } from './product-tabs';

const { mockTabsControls, mockSpecificationsTab, mockDescriptionTab } = vi.hoisted(() => ({
  mockTabsControls: vi.fn(),
  mockSpecificationsTab: vi.fn(),
  mockDescriptionTab: vi.fn(),
}));

vi.mock('./tabs-controls', () => ({
  TabsControls: mockTabsControls,
}));

vi.mock('./specifications-tab', () => ({
  SpecificationsTab: mockSpecificationsTab,
}));

vi.mock('./description-tab', () => ({
  DescriptionTab: mockDescriptionTab,
}));

describe('ProductTabs', () => {
  const mockOnTabChange = vi.fn();

  const defaultProps = {
    activeTab: 'specs' as const,
    onTabChange: mockOnTabChange,
    vendorCode: 'TEST123',
    category: 'Фотокамера',
    type: 'Цифровая',
    level: 'Любительский',
    description: 'Тестовое описание товара',
    id: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockTabsControls.mockImplementation(() => (
      <div data-testid="tabs-controls">Tabs Controls</div>
    ));

    mockSpecificationsTab.mockImplementation(() => (
      <div data-testid="specifications-tab">Specifications Tab</div>
    ));

    mockDescriptionTab.mockImplementation(() => (
      <div data-testid="description-tab">Description Tab</div>
    ));
  });

  it('renders correctly with all child components', () => {
    render(<ProductTabs {...defaultProps} />);

    expect(screen.getByTestId('tabs-controls')).toBeInTheDocument();
    expect(screen.getByTestId('specifications-tab')).toBeInTheDocument();
    expect(screen.getByTestId('description-tab')).toBeInTheDocument();
  });

  it('has correct CSS classes on container', () => {
    const { container } = render(<ProductTabs {...defaultProps} />);

    const tabsContainer = container.querySelector('.tabs');
    expect(tabsContainer).toBeInTheDocument();
    expect(tabsContainer).toHaveClass('tabs', 'product__tabs');
  });

  it('passes correct props to TabsControls', () => {
    render(<ProductTabs {...defaultProps} />);

    expect(mockTabsControls).toHaveBeenCalledWith(
      expect.objectContaining({
        activeTab: 'specs',
        onTabChange: mockOnTabChange,
      }),
      {}
    );
  });

  it('passes correct props to SpecificationsTab when activeTab is "specs"', () => {
    render(<ProductTabs {...defaultProps} activeTab="specs" />);

    expect(mockSpecificationsTab).toHaveBeenCalledWith(
      expect.objectContaining({
        vendorCode: 'TEST123',
        category: 'Фотокамера',
        type: 'Цифровая',
        level: 'Любительский',
        isActive: true,
      }),
      {}
    );
  });

  it('passes correct props to SpecificationsTab when activeTab is "description"', () => {
    render(<ProductTabs {...defaultProps} activeTab="description" />);

    expect(mockSpecificationsTab).toHaveBeenCalledWith(
      expect.objectContaining({
        vendorCode: 'TEST123',
        category: 'Фотокамера',
        type: 'Цифровая',
        level: 'Любительский',
        isActive: false,
      }),
      {}
    );
  });

  it('passes correct props to DescriptionTab when activeTab is "description"', () => {
    render(<ProductTabs {...defaultProps} activeTab="description" />);

    expect(mockDescriptionTab).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Тестовое описание товара',
        id: 1,
        isActive: true,
      }),
      {}
    );
  });

  it('passes correct props to DescriptionTab when activeTab is "specs"', () => {
    render(<ProductTabs {...defaultProps} activeTab="specs" />);

    expect(mockDescriptionTab).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Тестовое описание товара',
        id: 1,
        isActive: false,
      }),
      {}
    );
  });

  it('renders tabs content container', () => {
    const { container } = render(<ProductTabs {...defaultProps} />);

    const tabsContent = container.querySelector('.tabs__content');
    expect(tabsContent).toBeInTheDocument();
  });

  it('handles different prop values correctly', () => {
    const differentProps = {
      ...defaultProps,
      vendorCode: 'DIFFERENT123',
      category: 'Видеокамера',
      type: 'Плёночная',
      level: 'Профессиональный',
      description: 'Другое описание',
      id: 2,
    };

    render(<ProductTabs {...differentProps} />);

    expect(mockSpecificationsTab).toHaveBeenCalledWith(
      expect.objectContaining({
        vendorCode: 'DIFFERENT123',
        category: 'Видеокамера',
        type: 'Плёночная',
        level: 'Профессиональный',
      }),
      {}
    );

    expect(mockDescriptionTab).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Другое описание',
        id: 2,
      }),
      {}
    );
  });
});
