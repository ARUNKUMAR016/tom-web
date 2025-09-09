import OpenStatus from "@/components/OpenStatus";
import React from "react";
const foodImage = "/wing.jpg";

const HeroSection = () => {
  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between px-10 py-16 bg-gray-100">
      <div className="max-w-xl text-center md:text-left">
        <h1 className="cutive-font text-4xl md:text-5xl text-[#253428] leading-snug mb-4">
          Enjoy Authentic <br /> South Indian Flavors
        </h1>
        <OpenStatus className="bg-[#CDBF9C]/40 text-[#253428]" />
        <p className="cutive-font text-[#728175] mb-6">
          Experience the rich taste of Madurai — from crispy dosas to flavorful
          curries, made fresh with traditional recipes.
        </p>

        <div className="flex items-center gap-6">
          <button className="cutive-font bg-[#253428] text-[#CDBF9C] font-extrabold hover:bg-[#728175] px-6 py-3 rounded-full shadow-md">
            Explore Menu
          </button>
          {/* <button className="cutive-font flex items-center text-[#253428] hover:text-[#728175]">
            <span className="w-10 h-10 border-2 border-[#253428] text-[#253428] rounded-full flex items-center justify-center mr-2">
              ▶
            </span>
            Watch Our Story
          </button> */}
        </div>
      </div>

      <div className="mb-10 md:mb-0">
        <img
          src={foodImage}
          alt="Authentic South Indian Food"
          className="max-w-sm w-full rounded-full shadow-lg"
        />
      </div>
    </section>
  );
};

export default HeroSection;
