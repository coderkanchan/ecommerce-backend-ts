"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const banners = [
  { id: 1, image: "/baner1.jpg", link: "/offers/summer" },
  { id: 2, image: "/baner2.jpg", link: "/category/electronics" },
  { id: 3, image: "/baner3.jpg", link: "/category/fashion" },
];

export default function HomeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  //   }, 2000); 
  //   return () => clearInterval(timer);
  // }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden ">

      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
        >
          <Image src={banner.image} alt="Promotion" fill className="object-cover" />
        </div>
      ))}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full ${i === currentIndex ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}