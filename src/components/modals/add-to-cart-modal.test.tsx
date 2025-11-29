import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AddToCartModal } from './add-to-cart-modal';
import type { FullOfferType } from '../../const/type';

const { mockModal, mockBasketCardMemo, mockButtonAddBasketMemo, mockUseModal } = vi.hoisted(() => ({
  mockModal: vi.fn(),
  mockBasketCardMemo: vi.fn(),
  mockButtonAddBasketMemo: vi.fn(),
  mockUseModal: vi.fn(),
}));

vi.mock('./modal', () => ({
  Modal: mockModal,
}));

vi.mock('../card', () => ({
  BasketCardMemo: mockBasketCardMemo,
}));

vi.mock('../buttons', () => ({
  ButtonAddBasketMemo: mockButtonAddBasketMemo,
}));

vi.mock('../../contexts', () => ({
  useModal: mockUseModal,
}));

describe('AddToCartModal', () => {
  const mockCloseModal = vi.fn();
  const mockProductData: FullOfferType = {
    id: 1,
    name: 'Test Camera',
    vendorCode: 'TEST123',
    type: 'Цифровая',
    category: 'Фотокамера',
    level: 'Нулевой',
    description: 'Test description',
    price: 1000,
    previewImg: 'test.jpg',
    previewImg2x: 'test@2x.jpg',
    previewImgWebp: 'test.webp',
    previewImgWebp2x: 'test@2x.webp',
    rating: 4.5,
    reviewCount: 10,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseModal.mockReturnValue({
      modalState: null,
      openModal: vi.fn(),
      closeModal: mockCloseModal,
    });

    mockModal.mockImplementation(({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
      <div data-testid="modal">
        <div data-testid="modal-content">{children}</div>
        <button onClick={onClose} data-testid="close-button">Close</button>
      </div>
    ));

    mockBasketCardMemo.mockImplementation(() => (
      <div data-testid="basket-card">Basket Card</div>
    ));

    mockButtonAddBasketMemo.mockImplementation(() => (
      <button data-testid="add-basket-button">Add to Basket</button>
    ));
  });

  it('renders correctly with product data', () => {
    render(<AddToCartModal productData={mockProductData} />);

    expect(screen.getByText('Добавить товар в корзину')).toBeInTheDocument();
    expect(screen.getByTestId('basket-card')).toBeInTheDocument();
    expect(screen.getByTestId('add-basket-button')).toBeInTheDocument();
  });

  it('passes correct props to child components', () => {
    render(<AddToCartModal productData={mockProductData} />);

    expect(mockModal).toHaveBeenCalledWith(
      expect.objectContaining({
        onClose: mockCloseModal,
      }),
      {}
    );

    expect(mockBasketCardMemo).toHaveBeenCalledWith(
      expect.objectContaining({
        card: mockProductData,
        isModal: true,
      }),
      {}
    );

    expect(mockButtonAddBasketMemo).toHaveBeenCalledWith(
      expect.objectContaining({
        isModal: true,
      }),
      {}
    );
  });
});
