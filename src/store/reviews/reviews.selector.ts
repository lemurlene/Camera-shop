import { NameSpace } from '../const';
import { State } from '../type';
import { ReviewType } from '../../const/type';

const selectOffersComments = (state: State):ReviewType[] => state[NameSpace.Reviews].offerComments;
const selectCommentsOffersStatus = (state: State):boolean => state[NameSpace.Reviews].isLoadingComments;
const selectCommentStatus = (state: State):boolean => state[NameSpace.Reviews].isLoadingComment;

export {selectOffersComments, selectCommentsOffersStatus, selectCommentStatus};
