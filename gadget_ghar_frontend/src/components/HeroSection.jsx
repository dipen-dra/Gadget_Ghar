import React from 'react';
import video from "../assets/banner.mp4";

const HeroSection = () => {
  return (
    <div className="relative w-full h-screen">
      <video
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better button visibility */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Centered Action Buttons - Positioned Lower */}
      <div className="absolute inset-0 flex items-end justify-center p-4 pb-24 sm:pb-32">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <a
            href="/dashboard/shop"
            className="px-10 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-full hover:shadow-xl hover:shadow-sky-500/30 transition-all transform hover:-translate-y-1 w-full sm:w-auto text-center"
          >
            Shop Now
          </a>
          <a
            href="/#categories"
            className="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all w-full sm:w-auto text-center"
          >
            Explore Deals
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;