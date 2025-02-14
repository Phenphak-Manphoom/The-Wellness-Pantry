import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import { Navigation, Pagination, Autoplay, EffectCards } from "swiper/modules";
import Search from "./Search";

const HeroSection = () => {
  const images = [
    "https://img.freepik.com/free-photo/supermarket-banner-concept-with-ingredients_23-2149421187.jpg",
    "https://img.freepik.com/free-photo/top-view-breakfast-with-cereals_23-2148604153.jpg?t=st=1736511784~exp=1736515384~hmac=731eec8f902c1dd470404a9d25194e7586b9d354fb2e6b989adce155ab70a91a&w=740",
    "https://img.freepik.com/free-photo/healthy-breakfast_23-2148079633.jpg?t=st=1736511861~exp=1736515461~hmac=e293b8cae17802f311116511ccb42919e69aaa196a38950343aaf59b62142871&w=740",
    "https://img.freepik.com/free-photo/top-view-muesli-bowl-with-nuts_23-2148431148.jpg?t=st=1736512061~exp=1736515661~hmac=93b8a88d4ee074884881bbb5ef692d432debcd0263e1877425a33af2203c5ddd&w=740",
  ];

  return (
    <section className="w-full h-[520px] relative overflow-hidden bg-[#527210] ">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectCards]}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop={true}
        speed={5000}
        effect={"cards"}
        grabCursor={true}
        className="h-full relative z-10"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

    <Search/>

      {/* เพิ่มปุ่ม Next/Prev ของ Swiper ที่จะใช้คลิก */}
      <button className="custom-prev absolute top-1/2 left-4 z-20 text-white text-3xl transform -translate-y-1/2">
        <FaArrowLeft />
      </button>
      <button className="custom-next absolute top-1/2 right-4 z-20 text-white text-3xl transform -translate-y-1/2">
        <FaArrowRight />
      </button>
    </section>
  );
};

export default HeroSection;
