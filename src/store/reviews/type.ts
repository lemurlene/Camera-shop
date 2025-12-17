import { ReviewType } from '../../const/type';

export type InitialStateType = {
  offerComments: ReviewType[];
  isLoadingComments: boolean;
  isLoadingComment: boolean;
  commentsError: string | null;
  postCommentError: string | null;
};
