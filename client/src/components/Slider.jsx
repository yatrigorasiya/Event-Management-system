import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    image: "./images/i1.jpg",
  },
  {
    image: "./images/i2.jpg",
  },
];

export const Slider = () => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="w-full "
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index} className="h-screen">
          <div
            className="sliderimage relative w-full flex flex-col items-center justify-center text-white bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="flex justify-end">
              <h2 className="text-3xl font-bold bg-black/50 p-4 rounded-lg">
                {slide.title}
              </h2>
              <p className="text-lg bg-black/50 p-2 rounded-lg">
                {slide.description}
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
