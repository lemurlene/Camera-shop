import type { ChangeEvent } from 'react';
import { REVIEW_FIELDS, type ReviewUiFieldName } from './const';

type ReviewFieldsProps = {
  values: Record<ReviewUiFieldName, string>;
  isDisabled: boolean;
  onChange: (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

function ReviewFields({ values, isDisabled, onChange }: ReviewFieldsProps): JSX.Element {
  return (
    <>
      {REVIEW_FIELDS.map((field) => {
        const labelIcon = (
          <svg width="9" height="9" aria-hidden="true">
            <use xlinkHref="#icon-snowflake"></use>
          </svg>
        );

        if (field.kind === 'textarea') {
          return (
            <div key={field.name} className="custom-textarea form-review__item">
              <label>
                <span className="custom-textarea__label">
                  {field.label}
                  {labelIcon}
                </span>
                <textarea
                  name={field.name}
                  minLength={field.minLength}
                  placeholder={field.placeholder}
                  disabled={isDisabled}
                  value={values[field.name]}
                  onChange={onChange}
                />
              </label>
              <div className="custom-textarea__error">{field.errorText}</div>
            </div>
          );
        }

        return (
          <div key={field.name} className="custom-input form-review__item">
            <label>
              <span className="custom-input__label">
                {field.label}
                {labelIcon}
              </span>
              <input
                type="text"
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                disabled={isDisabled}
                value={values[field.name]}
                onChange={onChange}
              />
            </label>
            <p className="custom-input__error">{field.errorText}</p>
          </div>
        );
      })}
    </>
  );
}

export default ReviewFields;

