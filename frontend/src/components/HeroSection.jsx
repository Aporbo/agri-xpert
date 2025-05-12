import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 bg-green-50">
      <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-6">
        Empowering Agriculture with Smart Technology
      </h1>
      <p className="text-gray-600 text-lg max-w-2xl mb-8">
        Welcome to Agri Expert System — the all-in-one solution for farmers, researchers, and government officials to enhance productivity and decision-making.
      </p>
      <Link to="/register">
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full">
          Get Started
        </button>
      </Link>
    </div>
  );
}

export default HeroSection;
