import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFlask, FaCloudSun, FaSeedling, FaMapMarkerAlt, FaRegSun } from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import backgroundVideo from '../assets/background.mp4';

// Import local images
import image1 from '../assets/farm-img/1.jpg';
import image2 from '../assets/farm-img/2.jpg';
import image3 from '../assets/farm-img/3.jpg';
import image4 from '../assets/farm-img/4.jpg';
import image5 from '../assets/farm-img/5.jpg';
import image6 from '../assets/farm-img/6.jpg';
import image7 from '../assets/farm-img/7.jpg';
import image8 from '../assets/farm-img/8.jpg';
import image9 from '../assets/farm-img/9.jpg';
import image10 from '../assets/farm-img/10.jpg';

const farmImages = [image1, image2, image3, image4, image5, image6, image7, image8, image9, image10];

// Helper function to randomly pick images
const getRandomImage = () => {
  return farmImages[Math.floor(Math.random() * farmImages.length)];
};

const fetchWeatherData = () => {
  return Promise.resolve({
    temp: 25,
    condition: 'Sunny',
    humidity: 60,
  });
};

const fetchSoilHealthTips = () => {
  return Promise.resolve([
    { title: 'Cover Cropping for Better Soil', content: 'Planting cover crops can reduce erosion and increase soil fertility.' },
    { title: 'No-Till Farming Benefits', content: 'No-till farming helps preserve soil structure and supports beneficial microorganisms.' },
  ]);
};

const HomePage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [soilTips, setSoilTips] = useState([]);
  const [soilType, setSoilType] = useState('loamy');
  const [soilData, setSoilData] = useState({
    pH: 6.5,
    nitrogen: 0.18,
    phosphorus: 12,
  });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchWeatherData().then(setWeatherData);
    fetchSoilHealthTips().then(setSoilTips);
  }, [soilType, soilData]);

  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
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
                {user ? `Welcome back, ${user.name}!` : 'Crop Recommendations'}
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

      {/* Key Features Section with Images and Descriptions */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-12">🌱 Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-green-50 p-6 rounded shadow hover:shadow-lg transition">
            <div className="text-green-700 mb-4 text-4xl flex justify-center">
              <FaFlask />
            </div>
            <h4 className="text-xl font-semibold mb-2 text-center">Soil Health Analysis</h4>
            <p className="text-sm text-gray-700 text-center">
              Get insights on pH, NPK levels, and receive actionable fertilizer guidance.
            </p>
            <img src={getRandomImage()} alt="Soil Health Analysis" className="mt-4 w-full rounded-lg" />
          </div>

          <div className="bg-blue-50 p-6 rounded shadow hover:shadow-lg transition">
            <div className="text-blue-700 mb-4 text-4xl flex justify-center">
              <FaCloudSun />
            </div>
            <h4 className="text-xl font-semibold mb-2 text-center">Smart Weather Integration</h4>
            <p className="text-sm text-gray-700 text-center">
              Access real-time weather alerts and smart irrigation plans for your fields.
            </p>
            <img src={getRandomImage()} alt="Weather Forecast" className="mt-4 w-full rounded-lg" />
          </div>

          <div className="bg-yellow-50 p-6 rounded shadow hover:shadow-lg transition">
            <div className="text-yellow-700 mb-4 text-4xl flex justify-center">
              <FaSeedling />
            </div>
            <h4 className="text-xl font-semibold mb-2 text-center">Crop Recommendations</h4>
            <p className="text-sm text-gray-700 text-center">
              AI-based suggestions for the most profitable and sustainable crop choices.
            </p>
            <img src={getRandomImage()} alt="Crop Recommendations" className="mt-4 w-full rounded-lg" />
          </div>
        </div>
      </section>

      {/* Seasonal Farming Advice Section */}
      <section className="py-16 px-6 bg-green-100">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-12">🌾 Seasonal Farming Advice</h2>
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-semibold text-green-700 mb-4">Spring Planting Tips</h3>
          <p className="text-gray-700 mb-6">
            In the spring, consider planting crops that thrive in warmer soil temperatures. Ensure you plant early enough for a long growing season.
          </p>
          <img src={getRandomImage()} alt="Spring Planting" className="w-full rounded-lg mb-8" />
          <h3 className="text-2xl font-semibold text-green-700 mb-4">Winter Crop Protection</h3>
          <p className="text-gray-700 mb-6">
            In colder climates, protect your crops from frost by using mulch or fabric coverings. Choose varieties that are frost-tolerant.
          </p>
          <img src={getRandomImage()} alt="Winter Protection" className="w-full rounded-lg mb-8" />
        </div>
      </section>

      {/* Interactive Soil Test Section */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-12">🧪 Soil Test Results</h2>
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-semibold text-green-800 mb-4">Analyze Your Soil for Better Results</h3>
          <p className="text-gray-700 mb-6">
            Conducting a soil test helps you understand your soil's pH, nitrogen, phosphorus, and other key factors to improve crop growth.
          </p>
          <img src={getRandomImage()} alt="Soil Test" className="w-full rounded-lg" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-4 text-center text-sm">
        &copy; {new Date().getFullYear()} AgriExpert. All rights reserved.
        <div className="mt-4">
          <Link to="/privacy" className="text-white hover:text-green-400">Privacy Policy</Link>
          <span className="mx-4">|</span>
          <Link to="/terms" className="text-white hover:text-green-400">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
