import type { State } from '../type';
import { NameSpace } from '../const';
import { LoadingStatus } from '../../const/enum';

const selectCoupon = (state: State) => state[NameSpace.Coupon].coupon;
const selectDiscount = (state: State) => state[NameSpace.Coupon].discount;
const selectCouponStatus = (state: State) => state[NameSpace.Coupon].status;
const selectCouponError = (state: State) => state[NameSpace.Coupon].error;
const selectIsCouponLoading = (state: State) => state[NameSpace.Coupon].status === LoadingStatus.Loading;

export { selectCoupon, selectDiscount, selectCouponStatus, selectCouponError, selectIsCouponLoading };
