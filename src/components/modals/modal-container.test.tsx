import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FullOfferType } from '../../const/type';
import { ModalContainer } from './modal-container';
import { useModal } from '../../contexts';

vi.mock('../../contexts', () => ({
  useModal: vi.fn(),
}));

vi.mock('./add-to-cart-modal', () => ({
  AddToCartModal: vi.fn(() => <div data-testid="add-to-cart-modal">Add to Cart</div>),
}));

vi.mock('./success-add-cart-modal', () => ({
  SuccessAddCartModal: vi.fn(() => <div data-testid="success-add-cart-modal">Success Add</div>),
}));

vi.mock('./delete-from-cart-modal', () => ({
  DeleteFromCartModal: vi.fn(() => <div data-testid="delete-from-cart-modal">Delete</div>),
}));

vi.mock('./success-order-modal', () => ({
  SuccessOrderModal: vi.fn(() => <div data-testid="success-order-modal">Success Order</div>),
}));

vi.mock('./error-order-modal', () => ({
  ErrorOrderModal: vi.fn(({ error }: { error: string }) => (
    <div data-testid="error-order-modal">{error}</div>
  )),
}));

vi.mock('./review-modal', () => ({
  ReviewModal: vi.fn(() => <div data-testid="review-modal">Review</div>),
}));

vi.mock('./success-review-modal', () => ({
  SuccessReviewModal: vi.fn(() => <div data-testid="success-review-modal">Success Review</div>),
}));

const mockUseModal = vi.mocked(useModal);

describe('ModalContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when modalState is null', () => {
    mockUseModal.mockReturnValue({
      modalState: null,
      openModal: vi.fn(),
      closeModal: vi.fn(),
    });

    const { container } = render(<ModalContainer />);
    expect(container.firstChild).toBeNull();
  });

  it('renders AddToCartModal for add-to-cart type', () => {
    const productData: Partial<FullOfferType> = {
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

    mockUseModal.mockReturnValue({
      modalState: { type: 'add-to-cart', productData: productData as FullOfferType },
      openModal: vi.fn(),
      closeModal: vi.fn(),
    });

    render(<ModalContainer />);
    expect(screen.getByTestId('add-to-cart-modal')).toBeInTheDocument();
  });

  it('renders SuccessAddCartModal for success-add-cart type', () => {
    mockUseModal.mockReturnValue({
      modalState: { type: 'success-add-cart' },
      openModal: vi.fn(),
      closeModal: vi.fn(),
    });

    render(<ModalContainer />);
    expect(screen.getByTestId('success-add-cart-modal')).toBeInTheDocument();
  });

  it('renders DeleteFromCartModal for delete-from-cart type', () => {
    const productData = ({ id: 2 } as unknown) as FullOfferType;

    mockUseModal.mockReturnValue({
      modalState: { type: 'delete-from-cart', productData },
      openModal: vi.fn(),
      closeModal: vi.fn(),
    });

    render(<ModalContainer />);
    expect(screen.getByTestId('delete-from-cart-modal')).toBeInTheDocument();
  });

  it('renders SuccessOrderModal for success-order type', () => {
    mockUseModal.mockReturnValue({
      modalState: { type: 'success-order' },
      openModal: vi.fn(),
      closeModal: vi.fn(),
    });

    render(<ModalContainer />);
    expect(screen.getByTestId('success-order-modal')).toBeInTheDocument();
  });

  it('renders ErrorOrderModal for error-order type with provided error', () => {
    mockUseModal.mockReturnValue({
      modalState: { type: 'error-order', error: 'Сервер недоступен' },
      openModal: vi.fn(),
      closeModal: vi.fn(),
    });

    render(<ModalContainer />);
    expect(screen.getByTestId('error-order-modal')).toBeInTheDocument();
    expect(screen.getByTestId('error-order-modal')).toHaveTextContent('Сервер недоступен');
  });

  it('renders ErrorOrderModal for error-order type with default error text when error is empty', () => {
    mockUseModal.mockReturnValue({
      modalState: { type: 'error-order' },
      openModal: vi.fn(),
      closeModal: vi.fn(),
    });

    render(<ModalContainer />);
    expect(screen.getByTestId('error-order-modal')).toHaveTextContent('Ошибка при оформлении заказа');
  });

  it('renders ReviewModal for add-review type', () => {
    mockUseModal.mockReturnValue({
      modalState: { type: 'add-review' },
      openModal: vi.fn(),
      closeModal: vi.fn(),
    });

    render(<ModalContainer />);
    expect(screen.getByTestId('review-modal')).toBeInTheDocument();
  });

  it('renders SuccessReviewModal for success-review type', () => {
    mockUseModal.mockReturnValue({
      modalState: { type: 'success-review' },
      openModal: vi.fn(),
      closeModal: vi.fn(),
    });

    render(<ModalContainer />);
    expect(screen.getByTestId('success-review-modal')).toBeInTheDocument();
  });

  it('returns null for unknown modal type', () => {
    mockUseModal.mockReturnValue({
      modalState: { type: 'unknown-type' as unknown as 'success-order' },
      openModal: vi.fn(),
      closeModal: vi.fn(),
    });

    const { container } = render(<ModalContainer />);
    expect(container.firstChild).toBeNull();
  });
});
