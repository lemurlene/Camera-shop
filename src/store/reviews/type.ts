import { ReviewType } from '../../const/type';

export type InitialStateType = {
  offerComments: ReviewType[];
  isLoadingComments: boolean;
  isLoadingComment: boolean;
};
