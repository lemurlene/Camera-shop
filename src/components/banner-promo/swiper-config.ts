import { Autoplay, Pagination } from 'swiper/modules';

export const getSwiperConfig = (itemsCount: number) => {
  const shouldShowPagination = itemsCount > 1;

  return {
    modules: [Autoplay, Pagination],
    ...(shouldShowPagination && {
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        clickable: true,
      },
      loop: true
    }),
    slidesPerView: 1,
    spaceBetween: 0,
    className: 'banner-swiper container'
  };
};
