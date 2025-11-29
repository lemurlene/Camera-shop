import { render, screen } from '@testing-library/react';
import BasketCard from './basket-card';
import { FullOfferType } from '../../const/type';

const mockCard: FullOfferType = {
  'id': 1,
  'name': 'Ретрокамера Dus Auge lV',
  'vendorCode': 'DA4IU67AD5',
  'type': 'Коллекционная',
  'category': 'Видеокамера',
  'description': 'Немецкий концерн BRW разработал видеокамеру Das Auge IV в начале 80-х годов, однако она до сих пор пользуется популярностью среди коллекционеров и яростных почитателей старинной техники. Вы тоже можете прикоснуться к волшебству аналоговой съёмки, заказав этот чудо-аппарат. Кто знает, может с Das Auge IV начнётся ваш путь к наградам всех престижных кинофестивалей.',
  'previewImg': 'img/content/das-auge.jpg',
  'level': 'Любительский',
  'price': 73450,
  'previewImg2x': 'img/content/das-auge@2x.jpg',
  'previewImgWebp': 'img/content/das-auge.webp',
  'previewImgWebp2x': 'img/content/das-auge@2x.webp',
  'rating': 3,
  'reviewCount': 15
};

describe('BasketCard component', () => {
  it('renders card information correctly', () => {
    render(<BasketCard card={mockCard} />);

    expect(screen.getByText(mockCard.name)).toBeInTheDocument();
    expect(screen.getByText(mockCard.vendorCode)).toBeInTheDocument();
    expect(screen.getByText(`${mockCard.type} ${mockCard.category.toLowerCase()}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockCard.level} уровень`)).toBeInTheDocument();
    expect(screen.getByText('73 450 ₽')).toBeInTheDocument();
  });

  it('renders images with correct sources', () => {
    render(<BasketCard card={mockCard} />);

    const image = screen.getByAltText(mockCard.name);
    expect(image).toHaveAttribute('src', mockCard.previewImg);
    expect(image).toHaveAttribute('srcset', `${mockCard.previewImg2x} 2x`);
    expect(image).toHaveAttribute('width', '140');
    expect(image).toHaveAttribute('height', '120');
    expect(image).toHaveAttribute('loading', 'lazy');

    const picture = image.closest('picture');
    const source = picture?.querySelector('source');
    expect(source).toHaveAttribute('type', 'image/webp');
    expect(source).toHaveAttribute('srcset', `${mockCard.previewImgWebp}, ${mockCard.previewImgWebp2x} 2x`);
  });

  it('renders price in modal when isModal is true', () => {
    render(<BasketCard card={mockCard} isModal />);

    const description = screen.getByText(mockCard.name).closest('.basket-item__description');
    const priceInDescription = description?.querySelector('.basket-item__price');
    expect(priceInDescription).toBeInTheDocument();
  });

  it('renders price separately when isModal is false', () => {
    render(<BasketCard card={mockCard} isModal={false} />);

    const description = screen.getByText(mockCard.name).closest('.basket-item__description');
    const priceInDescription = description?.querySelector('.basket-item__price');
    expect(priceInDescription).not.toBeInTheDocument();

    expect(screen.getByText('73 450 ₽')).toBeInTheDocument();
  });

  it('renders vendor code with correct formatting', () => {
    render(<BasketCard card={mockCard} />);

    expect(screen.getByText('Артикул:')).toBeInTheDocument();
    expect(screen.getByText(mockCard.vendorCode)).toBeInTheDocument();
  });

  it('renders category in lowercase', () => {
    render(<BasketCard card={mockCard} />);

    expect(screen.getByText(`${mockCard.type} ${mockCard.category.toLowerCase()}`)).toBeInTheDocument();
  });

  it('formats price with thousand separators', () => {
    const expensiveCard = {
      ...mockCard,
      price: 1_000_000,
    };

    render(<BasketCard card={expensiveCard} />);

    expect(screen.getByText('1 000 000 ₽')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    const TestChild = () => <div data-testid="test-child">Test Child</div>;

    render(
      <BasketCard card={mockCard}>
        <TestChild />
      </BasketCard>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('renders without children', () => {
    render(<BasketCard card={mockCard} />);

    expect(screen.getByText(mockCard.name)).toBeInTheDocument();
  });

  it('has visually hidden text for price', () => {
    render(<BasketCard card={mockCard} />);

    const visuallyHidden = screen.getByText('Цена:');
    expect(visuallyHidden).toHaveClass('visually-hidden');
  });

  it('is memoized component', () => {
    expect(typeof BasketCard).toBe('object');
    expect(BasketCard).toHaveProperty('$$typeof');
  });
});
