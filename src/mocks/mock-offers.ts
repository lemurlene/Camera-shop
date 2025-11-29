import { adaptOffersToClient } from '../adapters';
import { mockServerOffers } from './mock-server-offers';

export const mockOffers = adaptOffersToClient(mockServerOffers);
