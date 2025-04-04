import axios from "axios";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { NavLink } from "react-router-dom";

export const Category = () => {
  const [category, setCategory] = useState([]);

  const getCategory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/category/get-category"
      );
      setCategory(data.category);
    } catch (error) {
      console.log("Get category error", error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={3}
        navigation
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {category.map((c, index) => (
          <SwiperSlide key={index}>
            <NavLink to={`/category/${c.slug}`}>
              <div className="bg-white shadow-md rounded-xl overflow-hidden cursor-pointer">
                <img
                  src={`http://localhost:3000${c.imagePath}`}
                  alt={c.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{c.name}</h2>
                </div>
              </div>
            </NavLink>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
