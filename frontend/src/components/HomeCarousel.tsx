"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { RiArrowLeftDoubleLine } from "react-icons/ri";
import { RiArrowRightDoubleFill } from "react-icons/ri";
const banners = [
  { id: 1, image: "/banner1.jpg", link: "/offers/summer" },
  { id: 2, image: "/banner2.jpg", link: "/category/electronics" },
  { id: 3, image: "/banner3.jpg", link: "/category/fashion" },
];

export default function HomeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-[300px] md:h-[600px] overflow-hidden group">

      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
        >
          <Image
            src={banner.image}
            alt="Promotion"
            fill
            priority={index === 0}
            className="object-cover"
          />
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-0 top-30 z-30 px-4 text-black hidden group-hover:block transition-all"
      >
        <RiArrowLeftDoubleLine size={50} strokeWidth={1} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-30  z-30 px-4 text-black  hidden group-hover:block transition-all"
      >
        <RiArrowRightDoubleFill size={50} strokeWidth={1} />
 
      </button>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {banners.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-all 
              ${i === currentIndex ? "bg-white w-4" : "bg-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
} 