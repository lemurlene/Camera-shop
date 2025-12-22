import type { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
    description: 'Test description',
    level: 'Нулевой',
    price: 1000,
    rating: 4.5,
    reviewCount: 10,
    previewImg: 'test.jpg',
    previewImg2x: 'test@2x.jpg',
    previewImgWebp: 'test.webp',
    previewImgWebp2x: 'test@2x.webp',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseModal.mockReturnValue({
      modalState: null,
      openModal: vi.fn(),
      closeModal: mockCloseModal,
    });

    mockModal.mockImplementation(
      ({ children, onClose }: { children: ReactNode; onClose: () => void }) => (
        <div data-testid="modal">
          <div data-testid="modal-content">{children}</div>
          <button type="button" onClick={onClose} data-testid="close-button">
            Close
          </button>
        </div>
      )
    );

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

    expect(mockModal).toHaveBeenCalledTimes(1);
    const [modalProps] = mockModal.mock.calls[0] as unknown as [{ onClose: () => void }];
    expect(modalProps.onClose).toBe(mockCloseModal);

    expect(mockBasketCardMemo).toHaveBeenCalledTimes(1);
    const [basketProps] = mockBasketCardMemo.mock.calls[0] as unknown as [
      { card: FullOfferType; isModal: boolean }
    ];
    expect(basketProps.card).toBe(mockProductData);
    expect(basketProps.isModal).toBe(true);

    expect(mockButtonAddBasketMemo).toHaveBeenCalledTimes(1);
    const [buttonProps] = mockButtonAddBasketMemo.mock.calls[0] as unknown as [
      { productId: number; productData: FullOfferType }
    ];
    expect(buttonProps.productId).toBe(mockProductData.id);
    expect(buttonProps.productData).toBe(mockProductData);
  });

  it('calls closeModal when modal onClose is triggered', () => {
    render(<AddToCartModal productData={mockProductData} />);

    fireEvent.click(screen.getByTestId('close-button'));
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });
});
