import { memo } from 'react';
import CardMemo from './card';
import { FullOfferType } from '../../const/type';

type GetCardsProps = {
  cardsCount?: number;
  offers: FullOfferType[];
  handleHover?: (id: number | null) => void;
}

function OfferList({ offers, cardsCount = offers.length, handleHover }: GetCardsProps): JSX.Element {
  const cardsOnList = offers.slice(0, Math.min(cardsCount, offers.length));
  return (
    <>
      {cardsOnList.map((card) => (
        <div className="product-card" key={card.id}>
          <CardMemo
            data-testid="card"
            card={card}
            handleHover={handleHover}
          />
        </div>
      ))}
    </>
  );
}

const OfferListMemo = memo(OfferList);

export default OfferListMemo;
