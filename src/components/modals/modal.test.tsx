import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Modal } from './modal';
import { useModalFocus } from '../../hooks';
import { getFocusableElements } from './utils';

vi.mock('../../hooks', () => ({
  useModalFocus: vi.fn(),
}));

vi.mock('./utils', () => ({
  getFocusableElements: vi.fn(),
}));

const mockUseModalFocus = vi.mocked(useModalFocus);
const mockGetFocusableElements = vi.mocked(getFocusableElements);

describe('Modal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.className = '';

    mockUseModalFocus.mockReturnValue({ current: document.createElement('div') });
    mockGetFocusableElements.mockReturnValue([]);
  });

  afterEach(() => {
    document.body.className = '';
  });

  it('renders children and close button', () => {
    render(
      <Modal onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /закрыть попап/i })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<Modal onClose={mockOnClose}>Content</Modal>);

    fireEvent.click(screen.getByRole('button', { name: /закрыть попап/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<Modal onClose={mockOnClose}>Content</Modal>);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when isActive is false', () => {
    const { container } = render(
      <Modal onClose={mockOnClose} isActive={false}>
        Content
      </Modal>
    );

    expect(container.firstChild).toBeNull();
  });

  it('applies narrow class when narrow prop is true', () => {
    render(
      <Modal onClose={mockOnClose} narrow>
        Content
      </Modal>
    );

    const modalRoot = document.querySelector('.modal') ;
    expect(modalRoot).not.toBeNull();
    expect(modalRoot?.className).toContain('modal--narrow');
  });

  it('adds scroll-lock class to body on mount and removes on unmount', () => {
    const { unmount } = render(<Modal onClose={mockOnClose}>Content</Modal>);

    expect(document.body.classList.contains('scroll-lock')).toBe(true);

    unmount();
    expect(document.body.classList.contains('scroll-lock')).toBe(false);
  });

  it('calls onClose when clicking on overlay, but not when clicking inside content', () => {
    render(<Modal onClose={mockOnClose}>Content</Modal>);

    const overlay = document.querySelector('.modal__overlay') as HTMLElement;
    const content = document.querySelector('.modal__content') as HTMLElement;

    fireEvent.click(content);
    expect(mockOnClose).not.toHaveBeenCalled();

    fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('traps focus on Tab when focusable elements exist (last -> first)', () => {
    const modalRoot = document.createElement('div');

    const btn1 = document.createElement('button');
    btn1.textContent = 'first';
    const btn2 = document.createElement('button');
    btn2.textContent = 'last';

    modalRoot.appendChild(btn1);
    modalRoot.appendChild(btn2);

    document.body.appendChild(modalRoot);

    mockUseModalFocus.mockReturnValue({ current: modalRoot });
    mockGetFocusableElements.mockReturnValue([btn1, btn2]);

    render(<Modal onClose={mockOnClose}>Content</Modal>);

    btn2.focus();
    expect(document.activeElement).toBe(btn2);

    const preventDefault = vi.fn();
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    Object.defineProperty(event, 'preventDefault', { value: preventDefault });

    document.dispatchEvent(event);

    expect(document.activeElement).toBe(btn1);
    expect(preventDefault).toHaveBeenCalledTimes(1);

    modalRoot.remove();
  });

  it('traps focus on Shift+Tab when focusable elements exist (first -> last)', () => {
    const modalRoot = document.createElement('div');

    const btn1 = document.createElement('button');
    btn1.textContent = 'first';
    const btn2 = document.createElement('button');
    btn2.textContent = 'last';

    modalRoot.appendChild(btn1);
    modalRoot.appendChild(btn2);

    document.body.appendChild(modalRoot);

    mockUseModalFocus.mockReturnValue({ current: modalRoot });
    mockGetFocusableElements.mockReturnValue([btn1, btn2]);

    render(<Modal onClose={mockOnClose}>Content</Modal>);

    btn1.focus();
    expect(document.activeElement).toBe(btn1);

    const preventDefault = vi.fn();
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
    Object.defineProperty(event, 'preventDefault', { value: preventDefault });

    document.dispatchEvent(event);

    expect(document.activeElement).toBe(btn2);
    expect(preventDefault).toHaveBeenCalledTimes(1);

    modalRoot.remove();
  });
});
