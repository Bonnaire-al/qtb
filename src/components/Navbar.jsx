import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  return (
    <header className="text-white shadow-lg sticky top-0 z-50 overflow-hidden">
      {/* Vidéo d'arrière-plan */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          className="w-full h-full object-cover"
        >
          <source src="/src/image/Design sans titre.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/80 to-cyan-800/80"></div>
      </div>

      {/* Contenu du Navbar */}
      <div className="relative z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-cyan-800/10"></div>
        <div className="relative flex items-center justify-between px-4 py-3">
          {/* Mobile menu button */}
          <button
            className="md:hidden text-white focus:outline-none cursor-pointer !rounded-button whitespace-nowrap"
            onClick={toggleMenu}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/accueil"
              className="font-medium hover:text-cyan-200 transition-colors duration-300 group relative cursor-pointer"
            >
              Accueil
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link
              to="/about"
              className="font-medium hover:text-cyan-200 transition-colors duration-300 group relative cursor-pointer"
            >
              À propos
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <div className="relative group cursor-pointer">
              <button
                className="font-medium hover:text-cyan-200 transition-colors duration-300 flex items-center !rounded-button whitespace-nowrap"
                onClick={toggleServices}
              >
                Services <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div
                className={`absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800 ${isServicesOpen ? "block" : "hidden"}`}
              >
                <Link
                  to="/service"
                  className="block px-4 py-2 hover:bg-cyan-100 transition-colors duration-200"
                >
                  Nos Services
                </Link>
                <Link
                  to="/service"
                  className="block px-4 py-2 hover:bg-cyan-100 transition-colors duration-200"
                >
                  Réalisations
                </Link>
              </div>
            </div>
            <Link
              to="/quote"
              className="font-medium hover:text-cyan-200 transition-colors duration-300 group relative cursor-pointer"
            >
              Devis
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          </nav>
          
          {/* Logo */}
          <div className="flex-1 flex justify-center md:flex-none md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
            <Link to="/accueil">
              <div 
                className="text-3xl font-bold flex items-center"
                style={{
                  background: 'linear-gradient(45deg, #06b6d4, #ffffff, #06b6d4)',
                  backgroundSize: '400% 400%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradientShift 10s ease-in-out infinite'
                }}
              >
                <i className="fas fa-bolt mr-3 text-yellow-300" style={{ WebkitTextFillColor: 'initial' }}></i>
                <span>QTB Electrotech</span>
              </div>
            </Link>
          </div>
          
          {/* Urgence téléphone */}
          <div className="hidden md:flex items-center">
            <div className="group">
              <a
                href="tel:+33123456789"
                className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer !rounded-button whitespace-nowrap font-semibold"
              >
                <i className="fas fa-bolt mr-2 group-hover:animate-pulse"></i>
                <span>Urgence: 01 23 45 67 89</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div
        className={`relative z-10 md:hidden bg-cyan-700/10 backdrop-blur-sm ${isMenuOpen ? "block" : "hidden"}`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/accueil"
            className="block px-3 py-2 hover:bg-cyan-600/80 rounded-md cursor-pointer transition-colors duration-200"
          >
            Accueil
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 hover:bg-cyan-600/80 rounded-md cursor-pointer transition-colors duration-200"
          >
            À propos
          </Link>
          <button
            className="flex justify-between items-center w-full px-3 py-2 hover:bg-cyan-600/80 rounded-md cursor-pointer !rounded-button whitespace-nowrap transition-colors duration-200"
            onClick={toggleServices}
          >
            Services
            <i
              className={`fas fa-chevron-${isServicesOpen ? "up" : "down"} text-xs`}
            ></i>
          </button>
          <div
            className={`pl-4 space-y-1 ${isServicesOpen ? "block" : "hidden"}`}
          >
            <Link
              to="/service"
              className="block px-3 py-2 hover:bg-cyan-600/80 rounded-md cursor-pointer transition-colors duration-200"
            >
              Nos Services
            </Link>
            <Link
              to="/service"
              className="block px-3 py-2 hover:bg-cyan-600/80 rounded-md cursor-pointer transition-colors duration-200"
            >
              Réalisations
            </Link>
          </div>
          <Link
            to="/quote"
            className="block px-3 py-2 hover:bg-cyan-600/80 rounded-md cursor-pointer transition-colors duration-200"
          >
            Devis
          </Link>
          <a
            href="tel:+33123456789"
            className="flex items-center px-3 py-2 hover:bg-cyan-600/80 rounded-md cursor-pointer transition-colors duration-200"
          >
            <i className="fas fa-bolt text-yellow-300 mr-2"></i>
            Urgence: 01 23 45 67 89
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

<style jsx>{`
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    25% { background-position: 100% 0%; }
    50% { background-position: 100% 100%; }
    75% { background-position: 0% 100%; }
    100% { background-position: 0% 50%; }
  }
`}</style> 