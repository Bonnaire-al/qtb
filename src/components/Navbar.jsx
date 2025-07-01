import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isServicesOpen) setIsServicesOpen(false);
  };
  
  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
  };

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('header')) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header className="text-white shadow-lg sticky top-0 z-50">
      {/* Vidéo d'arrière-plan */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          className="w-full h-full object-cover"
        >
          <source src="/image/Design sans titre.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/80 to-cyan-800/80"></div>
      </div>

      {/* Contenu du Navbar */}
      <div className="relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-cyan-800/10"></div>
        <div className="relative flex items-center justify-between px-2 sm:px-4 py-3">
          {/* Mobile menu button - visible uniquement sur mobile */}
          <button
            className="md:hidden text-white focus:outline-none cursor-pointer z-20 relative p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
            </div>
          </button>
          
          {/* Navigation Desktop/Tablette - visible sur tablette et plus */}
          <nav className="hidden md:flex space-x-4 lg:space-x-6 xl:space-x-8 2xl:space-x-12">
            <Link
              to="/accueil"
              className="font-medium hover:text-cyan-200 transition-colors duration-300 group relative cursor-pointer text-sm lg:text-base xl:text-lg 2xl:text-xl"
            >
              Accueil
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link
              to="/about"
              className="font-medium hover:text-cyan-200 transition-colors duration-300 group relative cursor-pointer text-sm lg:text-base xl:text-lg 2xl:text-xl"
            >
              À propos
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <div className="relative group cursor-pointer">
              <button
                className="font-medium hover:text-cyan-200 transition-colors duration-300 flex items-center text-sm lg:text-base xl:text-lg 2xl:text-xl"
                onClick={toggleServices}
              >
                Services <i className="fas fa-chevron-down ml-1 text-xs lg:text-sm"></i>
              </button>
              <div
                className={`absolute left-0 mt-2 w-40 lg:w-48 xl:w-56 bg-white rounded-md shadow-lg py-1 text-gray-800 z-50 ${isServicesOpen ? "block" : "hidden"}`}
              >
                <Link
                  to="/service"
                  className="block px-3 lg:px-4 xl:px-5 py-2 hover:bg-cyan-100 transition-colors duration-200 text-sm lg:text-base"
                >
                  Nos Services
                </Link>
                <Link
                  to="/realisations"
                  className="block px-3 lg:px-4 xl:px-5 py-2 hover:bg-cyan-100 transition-colors duration-200 text-sm lg:text-base"
                >
                  Réalisations
                </Link>
              </div>
            </div>
            <Link
              to="/quote"
              className="font-medium hover:text-cyan-200 transition-colors duration-300 group relative cursor-pointer text-sm lg:text-base xl:text-lg 2xl:text-xl"
            >
              Devis
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          </nav>
          
          {/* Logo */}
          <div className="flex-1 flex justify-center md:flex-none md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
            <Link to="/accueil" onClick={closeMenu}>
              <div 
                className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold flex items-center"
                style={{
                  background: 'linear-gradient(45deg, #06b6d4, #ffffff, #06b6d4)',
                  backgroundSize: '400% 400%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradientShift 10s ease-in-out infinite'
                }}
              >
                <i className="fas fa-bolt mr-1 sm:mr-2 md:mr-3 lg:mr-3 text-yellow-300" style={{ WebkitTextFillColor: 'initial' }}></i>
                <span className="hidden sm:inline">QTB Electrotech</span>
                <span className="sm:hidden">QTB</span>
              </div>
            </Link>
          </div>
          
          {/* Urgence téléphone - visible sur tablette et plus */}
          <div className="hidden md:flex items-center">
            <div className="group">
              <a
                href="tel:+33123456789"
                className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 lg:px-4 xl:px-6 py-2 lg:py-3 rounded-full transition-all duration-300 cursor-pointer font-semibold text-sm lg:text-base xl:text-lg"
              >
                <i className="fas fa-bolt mr-1 lg:mr-2 xl:mr-3 group-hover:animate-pulse"></i>
                <span>Urgence: 01 23 45 67 89</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMenu}
        ></div>
      )}
      
      {/* Mobile menu */}
      <div
        className={`fixed top-0 left-0 w-72 h-full bg-cyan-900/95 backdrop-blur-md z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header du menu mobile */}
          <div className="flex items-center justify-between p-4 border-b border-cyan-700">
            <div className="text-xl font-bold text-white">Menu</div>
            <button
              onClick={closeMenu}
              className="text-white hover:text-cyan-200 transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          
          {/* Contenu du menu mobile */}
          <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
            <Link
              to="/accueil"
              className="block px-3 py-3 hover:bg-cyan-700/50 rounded-lg cursor-pointer transition-colors duration-200 text-white font-medium"
              onClick={closeMenu}
            >
              <i className="fas fa-home mr-3"></i>
              Accueil
            </Link>
            <Link
              to="/about"
              className="block px-3 py-3 hover:bg-cyan-700/50 rounded-lg cursor-pointer transition-colors duration-200 text-white font-medium"
              onClick={closeMenu}
            >
              <i className="fas fa-info-circle mr-3"></i>
              À propos
            </Link>
            <div className="space-y-2">
              <button
                className="flex justify-between items-center w-full px-3 py-3 hover:bg-cyan-700/50 rounded-lg cursor-pointer transition-colors duration-200 text-white font-medium"
                onClick={toggleServices}
              >
                <span>
                  <i className="fas fa-cogs mr-3"></i>
                  Services
                </span>
                <i
                  className={`fas fa-chevron-${isServicesOpen ? "up" : "down"} text-xs transition-transform duration-200`}
                ></i>
              </button>
              <div
                className={`ml-6 space-y-2 overflow-hidden transition-all duration-300 ${
                  isServicesOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <Link
                  to="/service"
                  className="block px-3 py-2 hover:bg-cyan-700/50 rounded-lg cursor-pointer transition-colors duration-200 text-cyan-200"
                  onClick={closeMenu}
                >
                  <i className="fas fa-tools mr-3"></i>
                  Nos Services
                </Link>
                <Link
                  to="/realisations"
                  className="block px-3 py-2 hover:bg-cyan-700/50 rounded-lg cursor-pointer transition-colors duration-200 text-cyan-200"
                  onClick={closeMenu}
                >
                  <i className="fas fa-project-diagram mr-3"></i>
                  Réalisations
                </Link>
              </div>
            </div>
            <Link
              to="/quote"
              className="block px-3 py-3 hover:bg-cyan-700/50 rounded-lg cursor-pointer transition-colors duration-200 text-white font-medium"
              onClick={closeMenu}
            >
              <i className="fas fa-calculator mr-3"></i>
              Devis
            </Link>
            <a
              href="tel:+33123456789"
              className="flex items-center px-3 py-3 hover:bg-cyan-700/50 rounded-lg cursor-pointer transition-colors duration-200 text-white font-medium"
              onClick={closeMenu}
            >
              <i className="fas fa-bolt text-yellow-300 mr-3"></i>
              Urgence: 01 23 45 67 89
            </a>
          </div>
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