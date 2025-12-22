import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

let isSendingValue = false;
let postErrorValue: string | null = null;

vi.mock('../../utils', () => ({
  useId: () => '1',
}));

const openModalMock = vi.fn();
vi.mock('../../contexts', () => ({
  useModal: () => ({
    openModal: openModalMock,
  }),
}));

vi.mock('../../store/reviews', () => ({
  selectCommentStatus: () => isSendingValue,
  selectPostCommentError: () => postErrorValue,
}));

type PostCommentPayload = {
  cameraId: number;
  userName: string;
  advantage: string;
  disadvantage: string;
  review: string;
  rating: number;
};

const postOfferCommentMock = vi.fn((payload: PostCommentPayload) => ({
  type: 'postOfferComment',
  payload,
}));

vi.mock('../../store/api-action', () => ({
  postOfferComment: (payload: PostCommentPayload) => postOfferCommentMock(payload),
}));

const unwrapMock = vi.fn(() => Promise.resolve(undefined));
const dispatchMock = vi.fn(() => ({ unwrap: unwrapMock }));

vi.mock('../../hooks', () => ({
  useAppDispatch: () => dispatchMock,
  useAppSelector: (selector: (state: unknown) => unknown) => selector({}),
}));

type InputRatingProps = {
  ratingValue: number;
  title: string;
  onChange: (e: unknown) => void;
  isDisabled: boolean;
  checked: boolean;
};

vi.mock('./input-rating', () => ({
  default: ({ ratingValue, title, onChange, isDisabled, checked }: InputRatingProps) => (
    <label>
      <input
        data-testid={`rating-${ratingValue}`}
        type="radio"
        name="rate"
        value={String(ratingValue)}
        aria-label={title}
        onChange={onChange}
        disabled={isDisabled}
        checked={checked}
      />
    </label>
  ),
}));

type ButtonSubmitProps = { isDisabled: boolean };
vi.mock('./button-submit', () => ({
  default: ({ isDisabled }: ButtonSubmitProps) => (
    <button data-testid="submit" type="submit" disabled={isDisabled}>
      Submit
    </button>
  ),
}));

type ErrorMessageProps = { message: string };
vi.mock('../error-message', () => ({
  default: ({ message }: ErrorMessageProps) => (
    <div data-testid="error-message">{message}</div>
  ),
}));

import { REVIEW_RULES } from './const';

import FormReview from './form-review';

const makeStr = (len: number) => 'a'.repeat(Math.max(1, len));

function getInput(form: HTMLElement, name: string): HTMLInputElement {
  const el = form.querySelector(`input[name="${name}"]`);
  if (!(el instanceof HTMLInputElement)) {
    throw new Error(`Input "${name}" not found`);
  }
  return el;
}

function getTextarea(form: HTMLElement, name: string): HTMLTextAreaElement {
  const el = form.querySelector(`textarea[name="${name}"]`);
  if (!(el instanceof HTMLTextAreaElement)) {
    throw new Error(`Textarea "${name}" not found`);
  }
  return el;
}

describe('FormReview', () => {
  beforeEach(() => {
    isSendingValue = false;
    postErrorValue = null;
    openModalMock.mockClear();
    dispatchMock.mockClear();
    unwrapMock.mockClear();
    postOfferCommentMock.mockClear();
  });

  it('renders form and submit is disabled initially (invalid form)', () => {
    render(<FormReview />);

    const form = screen.getByTestId('review-form');
    expect(form).toBeTruthy();

    const submitBtn = screen.getByTestId('submit');
    expect(submitBtn.hasAttribute('disabled')).toBe(true);
  });

  it('renders error message when postError exists', () => {
    postErrorValue = 'Ошибка отправки комментария';

    render(<FormReview />);

    const err = screen.getByTestId('error-message');
    expect(err).toBeTruthy();
    expect(err.textContent).toBe('Ошибка отправки комментария');
  });

  it('does not dispatch when submitting invalid form', async () => {
    render(<FormReview />);

    const form = screen.getByTestId('review-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledTimes(0);
      expect(openModalMock).toHaveBeenCalledTimes(0);
      expect(postOfferCommentMock).toHaveBeenCalledTimes(0);
    });
  });

  it('dispatches postOfferComment, resets form and opens success modal on valid submit', async () => {
    render(<FormReview />);

    const form = screen.getByTestId('review-form');

    // рейтинг
    const rating = screen.getByTestId(`rating-${REVIEW_RULES.rating.max}`);
    fireEvent.click(rating);

    // поля
    fireEvent.change(getInput(form, 'user-name'), {
      target: { name: 'user-name', value: makeStr(REVIEW_RULES.name.min) },
    });

    fireEvent.change(getInput(form, 'user-plus'), {
      target: { name: 'user-plus', value: makeStr(REVIEW_RULES.text.min) },
    });

    fireEvent.change(getInput(form, 'user-minus'), {
      target: { name: 'user-minus', value: makeStr(REVIEW_RULES.text.min) },
    });

    fireEvent.change(getTextarea(form, 'user-comment'), {
      target: { name: 'user-comment', value: makeStr(REVIEW_RULES.text.min) },
    });

    fireEvent.submit(form);

    await waitFor(() => {
      expect(postOfferCommentMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(unwrapMock).toHaveBeenCalledTimes(1);
      expect(openModalMock).toHaveBeenCalledWith('success-review');
    });

    expect(getInput(form, 'user-name').value).toBe('');
    expect(getInput(form, 'user-plus').value).toBe('');
    expect(getInput(form, 'user-minus').value).toBe('');
    expect(getTextarea(form, 'user-comment').value).toBe('');

    const stars = form.querySelector('.rate__stars');
    expect(stars?.textContent).toBe('0');
  });

  it('disables inputs when isSending = true', () => {
    isSendingValue = true;

    render(<FormReview />);

    const form = screen.getByTestId('review-form');

    expect(getInput(form, 'user-name').disabled).toBe(true);
    expect(getInput(form, 'user-plus').disabled).toBe(true);
    expect(getInput(form, 'user-minus').disabled).toBe(true);
    expect(getTextarea(form, 'user-comment').disabled).toBe(true);

    const rating1 = screen.getByTestId('rating-1');
    expect((rating1 as HTMLInputElement).disabled).toBe(true);

    const submitBtn = screen.getByTestId('submit');
    expect(submitBtn.hasAttribute('disabled')).toBe(true);
  });
});
