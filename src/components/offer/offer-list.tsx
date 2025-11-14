import { memo } from 'react';
import CardMemo from './card';
import { CardType } from '../../const/type';

type GetCardsProps = {
  cardsCount?: number;
  offers: CardType[];
  handleHover?: (id: number | null) => void;
}

function OfferList({ offers, cardsCount = offers.length, handleHover }: GetCardsProps): JSX.Element {
  const cardsOnList = offers.slice(0, Math.min(cardsCount, offers.length));
  return (
    <>
      {cardsOnList.map((card) => (
        <CardMemo
          data-testid="card"
          key={card.id}
          card={card}
          handleHover={handleHover}
        />
      ))}
    </>
  );
}

const OfferListMemo = memo(OfferList);

export default OfferListMemo;
