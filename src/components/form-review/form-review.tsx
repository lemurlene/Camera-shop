import type { ChangeEvent, FocusEvent, FormEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { postOfferComment } from '../../store/api-action';
import { selectCommentStatus, selectPostCommentError } from '../../store/reviews';
import { useId } from '../../utils';
import { useModal } from '../../contexts';

import InputRating from './input-rating';
import ButtonSubmit from './button-submit';
import ErrorMessage from '../error-message';

import {
  ReviewRatingValues,
  REVIEW_FIELDS,
  REVIEW_RULES,
  type ReviewUiFieldName,
} from './const';

type Values = Record<ReviewUiFieldName, string> & { rating: number };
type Errors = Partial<Record<ReviewUiFieldName | 'rating', string>>;
type Touched = Partial<Record<ReviewUiFieldName | 'rating', boolean>>;

const initialValues: Values = {
  rating: 0,
  'user-name': '',
  'user-plus': '',
  'user-minus': '',
  'user-comment': '',
};

const isReviewFieldName = (name: string): name is ReviewUiFieldName =>
  name === 'user-name' ||
  name === 'user-plus' ||
  name === 'user-minus' ||
  name === 'user-comment';

const FIELD_ERROR_TEXT: Record<ReviewUiFieldName, string> = REVIEW_FIELDS.reduce(
  (acc, f) => {
    acc[f.name] = f.errorText;
    return acc;
  },
  {} as Record<ReviewUiFieldName, string>
);

function FormReview(): JSX.Element {
  const dispatch = useAppDispatch();
  const { openModal } = useModal();

  const offerId = useId();
  const isSending = useAppSelector(selectCommentStatus);
  const postError = useAppSelector(selectPostCommentError);

  const [values, setValues] = useState<Values>(initialValues);
  const [touched, setTouched] = useState<Touched>({});

  const validate = useCallback((v: Values): Errors => {
    const e: Errors = {};

    if (
      !Number.isInteger(v.rating) ||
      v.rating < REVIEW_RULES.rating.min ||
      v.rating > REVIEW_RULES.rating.max
    ) {
      e.rating = 'Нужно оценить товар';
    }

    const name = v['user-name'].trim();
    if (name.length < REVIEW_RULES.name.min || name.length > REVIEW_RULES.name.max) {
      e['user-name'] = FIELD_ERROR_TEXT['user-name'];
    }

    (['user-plus', 'user-minus', 'user-comment'] as const).forEach((key) => {
      const text = v[key].trim();
      if (text.length < REVIEW_RULES.text.min || text.length > REVIEW_RULES.text.max) {
        e[key] = FIELD_ERROR_TEXT[key];
      }
    });

    return e;
  }, []);

  const liveErrors = useMemo(() => validate(values), [validate, values]);
  const isFormValid = useMemo(() => Object.keys(liveErrors).length === 0, [liveErrors]);

  const hasAnyTouched = useMemo(() => Object.values(touched).some(Boolean), [touched]);
  const shouldShowRatingState = hasAnyTouched || Boolean(touched.rating);

  const isRatingInvalid = shouldShowRatingState && Boolean(liveErrors.rating);
  const isRatingValid = shouldShowRatingState && !liveErrors.rating;

  const ratingClass = useMemo(() => {
    const base = 'rate form-review__item';
    if (isRatingInvalid) {
      return `${base} is-invalid`;
    }
    if (isRatingValid) {
      return `${base} is-valid`;
    }
    return base;
  }, [isRatingInvalid, isRatingValid]);

  const showError = useCallback(
    (key: keyof Errors) => Boolean(touched[key] && liveErrors[key]),
    [touched, liveErrors]
  );

  const getFieldClass = useCallback(
    (key: keyof Errors, base: string) => {
      if (!touched[key]) {
        return base;
      }
      if (liveErrors[key]) {
        return `${base} is-invalid`;
      }
      return `${base} is-valid`;
    },
    [touched, liveErrors]
  );

  const handleInputChange = useCallback((evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = evt.target;

    if (name === 'rate') {
      setValues((p) => ({ ...p, rating: Number(value) }));
      setTouched((t) => ({ ...t, rating: true }));
      return;
    }

    if (isReviewFieldName(name)) {
      setValues((p) => ({ ...p, [name]: value }));
      setTouched((t) => ({ ...t, [name]: true }));
    }
  }, []);

  const handleInputBlur = useCallback((evt: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = evt.target;

    if (name === 'rate') {
      setTouched((t) => ({ ...t, rating: true }));
      return;
    }

    if (isReviewFieldName(name)) {
      setTouched((t) => ({ ...t, [name]: true }));
    }
  }, []);

  const submit = useCallback(async () => {
    const cameraId = Number(offerId);
    if (!cameraId) {
      return;
    }
    if (!isFormValid) {
      return;
    }

    await dispatch(
      postOfferComment({
        cameraId,
        userName: values['user-name'],
        advantage: values['user-plus'],
        disadvantage: values['user-minus'],
        review: values['user-comment'],
        rating: values.rating,
      })
    ).unwrap();

    setValues(initialValues);
    setTouched({});
    openModal('success-review');
  }, [dispatch, isFormValid, offerId, openModal, values]);

  const handleFormSubmit = useCallback(
    (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      void submit();
    },
    [submit]
  );

  return (
    <div className="form-review">
      <form method="post" onSubmit={handleFormSubmit} data-testid="review-form">
        <fieldset className={ratingClass}>
          <legend className="rate__caption">
            Рейтинг
            <svg width="9" height="9" aria-hidden="true">
              <use xlinkHref="#icon-snowflake"></use>
            </svg>
          </legend>

          <div className="rate__bar">
            <div className="rate__group">
              {ReviewRatingValues.map((f) => (
                <InputRating
                  key={f.ratingValue}
                  ratingValue={f.ratingValue}
                  title={f.title}
                  onChange={handleInputChange}
                  isDisabled={isSending}
                  checked={values.rating === f.ratingValue}
                />
              ))}
            </div>

            <div className="rate__progress">
              <span className="rate__stars">{values.rating}</span>
              <span>/</span>
              <span className="rate__all-stars">5</span>
            </div>
          </div>
          <p className="rate__message">Нужно оценить товар</p>
        </fieldset>

        {REVIEW_FIELDS.map((field) => {
          const icon = (
            <svg width="9" height="9" aria-hidden="true">
              <use xlinkHref="#icon-snowflake"></use>
            </svg>
          );

          if (field.kind === 'textarea') {
            return (
              <div
                key={field.name}
                className={getFieldClass(field.name, 'custom-textarea form-review__item')}
              >
                <label>
                  <span className="custom-textarea__label">
                    {field.label}
                    {icon}
                  </span>

                  <textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    minLength={REVIEW_RULES.text.min}
                    maxLength={REVIEW_RULES.text.max}
                    disabled={isSending}
                    value={values[field.name]}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                  />
                </label>

                {showError(field.name) ? (
                  <div className="custom-textarea__error">{liveErrors[field.name]}</div>
                ) : null}
              </div>
            );
          }

          const minLength =
            field.name === 'user-name' ? REVIEW_RULES.name.min : REVIEW_RULES.text.min;
          const maxLength =
            field.name === 'user-name' ? REVIEW_RULES.name.max : REVIEW_RULES.text.max;

          return (
            <div
              key={field.name}
              className={getFieldClass(field.name, 'custom-input form-review__item')}
            >
              <label>
                <span className="custom-input__label">
                  {field.label}
                  {icon}
                </span>

                <input
                  type="text"
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  minLength={minLength}
                  maxLength={maxLength}
                  disabled={isSending}
                  value={values[field.name]}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />
              </label>

              {showError(field.name) ? (
                <p className="custom-input__error">{liveErrors[field.name]}</p>
              ) : null}
            </div>
          );
        })}

        <ButtonSubmit isDisabled={isSending || !isFormValid} />
        {postError ? <ErrorMessage message={postError} /> : null}
      </form>
    </div>
  );
}

export default FormReview;
