import React from 'react';
import { Link } from 'react-router-dom';
import { FaFlask, FaCloudSun, FaSeedling } from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import backgroundVideo from '../assets/background.mp4';

const HomePage = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true
  };

  return (
    <div className="bg-gradient-to-b from-green-100 via-white to-green-50 min-h-screen flex flex-col">
      {/* Hero Section with Video */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-center items-center text-white text-center z-10 px-4">
          <Slider {...sliderSettings} className="w-full max-w-4xl px-4">
            <div className="flex justify-center">
              <h1 className="text-4xl md:text-6xl font-semibold tracking-wide leading-snug drop-shadow-lg animate-fadeIn">
                Crop Recommendations
              </h1>
            </div>
            <div className="flex justify-center">
              <h1 className="text-4xl md:text-6xl font-semibold tracking-wide leading-snug drop-shadow-lg animate-fadeIn">
                Fertilizer Planning
              </h1>
            </div>
            <div className="flex justify-center">
              <h1 className="text-4xl md:text-6xl font-semibold tracking-wide leading-snug drop-shadow-lg animate-fadeIn">
                Irrigation Strategy
              </h1>
            </div>
          </Slider>

          <Link
            to={user ? "/farmer" : "/login"}
            className="mt-8 bg-green-500 hover:bg-green-600 transition-all duration-100 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg"
          >
            {user ? 'Submit a Soil Test Now' : 'Get Started'}
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-12">🌱 Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-green-50 p-6 rounded shadow hover:shadow-lg transition">
            <div className="text-green-700 mb-4 text-4xl flex justify-center">
              <FaFlask />
            </div>
            <h4 className="text-xl font-semibold mb-2 text-center">Soil Health Analysis</h4>
            <p className="text-sm text-gray-700 text-center">
              Get insights on pH, NPK levels and receive actionable fertilizer guidance.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded shadow hover:shadow-lg transition">
            <div className="text-blue-700 mb-4 text-4xl flex justify-center">
              <FaCloudSun />
            </div>
            <h4 className="text-xl font-semibold mb-2 text-center">Smart Weather Integration</h4>
            <p className="text-sm text-gray-700 text-center">
              Access real-time weather alerts and smart irrigation plans for your fields.
            </p>
          </div>

          <div className="bg-yellow-50 p-6 rounded shadow hover:shadow-lg transition">
            <div className="text-yellow-700 mb-4 text-4xl flex justify-center">
              <FaSeedling />
            </div>
            <h4 className="text-xl font-semibold mb-2 text-center">Crop Recommendations</h4>
            <p className="text-sm text-gray-700 text-center">
              AI-based suggestions for the most profitable and sustainable crop choices.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-100 py-12 text-center">
        <h3 className="text-2xl font-bold mb-4 text-green-800">
          {user ? "Make the most of your soil insights!" : "Ready to Optimize Your Farming?"}
        </h3>
        <p className="text-gray-700 mb-6">
          {user
            ? "Access personalized plans and maximize your yield today."
            : "Sign up today and make smarter agricultural decisions."}
        </p>
        <Link
          to={user ? "/farmer" : "/register"}
          className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700 transition font-semibold"
        >
          {user ? "Get Your Free Irrigation Plan" : "Create Free Account"}
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-4 text-center text-sm">
        &copy; {new Date().getFullYear()} AgriExpert. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
