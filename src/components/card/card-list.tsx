import { memo } from 'react';
import CardMemo from './card';
import { FullOfferType } from '../../const/type';

type GetCardsProps = {
  cardsCount?: number;
  offers: FullOfferType[];
}

function CardList({ offers, cardsCount = offers.length }: GetCardsProps): JSX.Element {
  const cardsOnList = offers.slice(0, Math.min(cardsCount, offers.length));
  return (
    <>
      {cardsOnList.map((card) => (
        <div className="product-card" key={card.id} data-testid="card-list">
          <CardMemo
            data-testid="card"
            card={card}
          />
        </div>
      ))}
    </>
  );
}

const CardListMemo = memo(CardList);

export default CardListMemo;
