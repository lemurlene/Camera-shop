import { useParams } from 'react-router-dom';

export const useId = (): string | null => {
  const { offerId } = useParams();
  return offerId ?? null;
};
