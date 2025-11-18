import { AppRoute } from './enum';

export const Setting = {
  CardsCountOnCatalog: 9,
  MaxRatingStars: 5,
  ProductSimilarCount: 3,
  MaxShowReviews: 3,
} as const;

export const RouteNames = {
  [AppRoute.Root]: 'Главная',
  [AppRoute.Catalog]: 'Каталог',
  [AppRoute.Offer]: 'Товар',
  [AppRoute.Guarantees]: 'Гарантии',
  [AppRoute.Delivery]: 'Доставка',
  [AppRoute.About]: 'О компании',
  [AppRoute.Basket]: 'Корзина',
  [AppRoute.Loading]: 'Загрузка',
  [AppRoute.Error404]: 'Страница не найдена',
} as const;

export const Categories = {
  photocamera: 'Фотокамера',
  videocamera: 'Видеокамера',
} as const;

export const Levels = {
  zero: 'Нулевой',
  'non-professional': 'Любительский',
  professional: 'Профессиональный',
} as const;

export const Types = {
  digital: 'Цифровая',
  film: 'Плёночная',
  snapshot: 'Моментальная',
  collection: 'Коллекционная',
} as const;

export const CategoryToKey = {
  'Фотокамера': 'photocamera',
  'Видеокамера': 'videocamera',
} as const;

export const TypeToKey = {
  'Цифровая': 'digital',
  'Плёночная': 'film',
  'Моментальная': 'snapshot',
  'Коллекционная': 'collection',
} as const;

export const LevelToKey = {
  'Нулевой': 'zero',
  'Любительский': 'non-professional',
  'Профессиональный': 'professional',
} as const;

export const CATEGORY_KEYS = Object.keys(Categories) as (keyof typeof Categories)[];
export const LEVEL_KEYS = Object.keys(Levels) as (keyof typeof Levels)[];
export const TYPE_KEYS = Object.keys(Types) as (keyof typeof Types)[];
