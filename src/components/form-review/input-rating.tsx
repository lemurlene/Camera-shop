import type { ChangeEvent } from 'react';

type InputProps = {
  ratingValue: number;
  title: string;
  onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  isDisabled: boolean;
  checked: boolean;
};

function InputRating({
  ratingValue,
  title,
  onChange,
  isDisabled,
  checked,
}: InputProps): JSX.Element {
  const id = `star-${ratingValue}`;

  return (
    <>
      <input
        className="visually-hidden"
        id={id}
        name="rate"
        type="radio"
        value={ratingValue}
        onChange={onChange}
        disabled={isDisabled}
        checked={checked}
      />
      <label className="rate__label" htmlFor={id} title={title}></label>
    </>
  );
}

export default InputRating;
