const statsNavSwiper = new Swiper('.stats__nav', {
  loop: true,
  speed: 600,
  slidesPerView: 5,
  spaceBetween: 30,
  centeredSlides: true,
  watchSlidesProgress: true,
  navigation: {
    nextEl: '.stats__button--next',
    prevEl: '.stats__button--prev',
  },
});

const statsContentSwiper = new Swiper('.stats__content', {
  loop: true,
  speed: 600,
  slidesPerView: 1,
  allowTouchMove: false,
  autoHeight: true,
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
});

// syncs statsContentSwiper with statsNavSwiper using realIndex and slideToLoop to account for cloned slides caused by looping
statsNavSwiper.on('slideChange', function () {
  const statsNavSwiperIndex = statsNavSwiper.realIndex;
  statsContentSwiper.slideToLoop(statsNavSwiperIndex);
});
