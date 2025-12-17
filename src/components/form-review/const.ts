export const ReviewRatingValues = [
  { ratingValue: 5, title: 'Отлично' },
  { ratingValue: 4, title: 'Хорошо' },
  { ratingValue: 3, title: 'Нормально' },
  { ratingValue: 2, title: 'Плохо' },
  { ratingValue: 1, title: 'Ужасно' },
] as const;

export type ReviewUiFieldName =
  | 'user-name'
  | 'user-plus'
  | 'user-minus'
  | 'user-comment';

export type ReviewFieldKind = 'input' | 'textarea';

export type ReviewFieldConfig = {
  name: ReviewUiFieldName;
  label: string;
  placeholder: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  kind: ReviewFieldKind;
  errorText: string;
};

export const REVIEW_FIELDS: ReviewFieldConfig[] = [
  {
    name: 'user-name',
    label: 'Ваше имя',
    placeholder: 'Введите ваше имя',
    required: true,
    kind: 'input',
    errorText: 'Нужно указать имя',
  },
  {
    name: 'user-plus',
    label: 'Достоинства',
    placeholder: 'Основные преимущества товара',
    required: true,
    kind: 'input',
    errorText: 'Нужно указать достоинства',
  },
  {
    name: 'user-minus',
    label: 'Недостатки',
    placeholder: 'Главные недостатки товара',
    required: true,
    kind: 'input',
    errorText: 'Нужно указать недостатки',
  },
  {
    name: 'user-comment',
    label: 'Комментарий',
    placeholder: 'Поделитесь своим опытом покупки',
    required: true,
    minLength: 10,
    kind: 'textarea',
    errorText: 'Нужно добавить комментарий',
  },
];

export const REVIEW_RULES = {
  rating: { min: 1, max: 5 },
  name: { min: 2, max: 15 },
  text: { min: 10, max: 160 },
} as const;
