import type { ChangeEvent } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReviewFields from './review-fields';
import { REVIEW_FIELDS } from './const';

type ReviewUiFieldName = (typeof REVIEW_FIELDS)[number]['name'];

const makeValues = (): Record<ReviewUiFieldName, string> =>
  REVIEW_FIELDS.reduce((acc, f) => {
    acc[f.name] = '';
    return acc;
  }, {} as Record<ReviewUiFieldName, string>);

const getControlByName = (name: string): HTMLInputElement | HTMLTextAreaElement => {
  const el = document.querySelector(`[name="${name}"]`);
  expect(el).not.toBeNull();
  return el as HTMLInputElement | HTMLTextAreaElement;
};

describe('ReviewFields', () => {
  it('renders all fields from REVIEW_FIELDS with labels and errors', () => {
    const values = makeValues();
    const onChange = vi.fn<[ChangeEvent<HTMLInputElement | HTMLTextAreaElement>], void>();

    render(<ReviewFields values={values} isDisabled={false} onChange={onChange} />);

    for (const field of REVIEW_FIELDS) {
      expect(screen.getByText(field.label)).toBeInTheDocument();
      expect(screen.getByText(field.errorText)).toBeInTheDocument();
    }

    const snowflakes = document.querySelectorAll('use[xlink\\:href="#icon-snowflake"]');
    expect(snowflakes).toHaveLength(REVIEW_FIELDS.length);
  });

  it('binds values to controls (input/textarea)', () => {
    const values = makeValues();
    const firstField = REVIEW_FIELDS[0];
    values[firstField.name] = 'Hello';

    const onChange = vi.fn<[ChangeEvent<HTMLInputElement | HTMLTextAreaElement>], void>();
    render(<ReviewFields values={values} isDisabled={false} onChange={onChange} />);

    const control = getControlByName(firstField.name);
    expect(control.value).toBe('Hello');
  });

  it('disables all controls when isDisabled=true', () => {
    const values = makeValues();
    const onChange = vi.fn<[ChangeEvent<HTMLInputElement | HTMLTextAreaElement>], void>();

    render(<ReviewFields values={values} isDisabled onChange={onChange} />);

    for (const field of REVIEW_FIELDS) {
      const el = getControlByName(field.name);
      expect(el).toBeDisabled();
    }
  });

  it('calls onChange when user types (input and textarea)', () => {
    const values = makeValues();
    const onChange = vi.fn<[ChangeEvent<HTMLInputElement | HTMLTextAreaElement>], void>();

    render(<ReviewFields values={values} isDisabled={false} onChange={onChange} />);

    const inputField = REVIEW_FIELDS.find((f) => f.kind !== 'textarea');
    const textareaField = REVIEW_FIELDS.find((f) => f.kind === 'textarea');

    if (inputField) {
      const input = getControlByName(inputField.name) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'abc' } });
    }

    if (textareaField) {
      const textarea = getControlByName(textareaField.name) as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'long text' } });
    }

    const expectedCalls = (inputField ? 1 : 0) + (textareaField ? 1 : 0);
    expect(onChange).toHaveBeenCalledTimes(expectedCalls);
  });

  it('passes textarea-specific props (minLength, placeholder)', () => {
    const values = makeValues();
    const onChange = vi.fn<[ChangeEvent<HTMLInputElement | HTMLTextAreaElement>], void>();

    render(<ReviewFields values={values} isDisabled={false} onChange={onChange} />);

    const textareaField = REVIEW_FIELDS.find((f) => f.kind === 'textarea');
    if (!textareaField) {
      return;
    }

    const textarea = document.querySelector(
      `textarea[name="${textareaField.name}"]`
    );

    expect(textarea).not.toBeNull();
    expect(textarea?.getAttribute('placeholder')).toBe(textareaField.placeholder);
    expect(textarea?.getAttribute('minLength')).toBe(String(textareaField.minLength));
  });

  it('passes input-specific props (required, placeholder, type=text)', () => {
    const values = makeValues();
    const onChange = vi.fn<[ChangeEvent<HTMLInputElement | HTMLTextAreaElement>], void>();

    render(<ReviewFields values={values} isDisabled={false} onChange={onChange} />);

    const inputField = REVIEW_FIELDS.find((f) => f.kind !== 'textarea');
    if (!inputField) {
      return;
    }

    const el = document.querySelector(`input[name="${inputField.name}"]`);
    expect(el).not.toBeNull();

    const input = el as HTMLInputElement;

    expect(input.type).toBe('text');
    expect(input.getAttribute('placeholder')).toBe(inputField.placeholder);
    expect(input.required).toBe(Boolean(inputField.required));
  });
});
