import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  
  // Double-clic sur le copyright pour accéder à l'admin
  const handleAdminAccess = () => {
    navigate('/admin');
  };

  return (
    <footer className="bg-gradient-to-r from-cyan-900 to-cyan-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Colonne 1 - À propos */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <i className="fas fa-bolt text-yellow-300 mr-2"></i>
              QTB Electrotech
            </h3>
            <p className="text-cyan-200 mb-4">
              Votre partenaire de confiance pour toutes vos installations électriques professionnelles.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-cyan-300 hover:text-white transition-colors duration-300">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-cyan-300 hover:text-white transition-colors duration-300">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="#" className="text-cyan-300 hover:text-white transition-colors duration-300">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>

          {/* Colonne 2 - Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nos Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-cyan-200 hover:text-white transition-colors duration-300">
                  Installation électrique
                </a>
              </li>
              <li>
                <a href="#" className="text-cyan-200 hover:text-white transition-colors duration-300">
                  Domotique
                </a>
              </li>
              <li>
                <a href="#" className="text-cyan-200 hover:text-white transition-colors duration-300">
                  Systémes de sécurité
                </a>
              </li>
              <li>
                <a href="#" className="text-cyan-200 hover:text-white transition-colors duration-300">
                  Dépannage
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 3 - Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2">
              <p className="text-cyan-200 flex items-center">
                <i className="fas fa-phone mr-2"></i>
                07 77 11 71 78
              </p>
              <p className="text-cyan-200 flex items-center">
                <i className="fas fa-envelope mr-2"></i>
                contact@qtbelectro.fr
              </p>
              <p className="text-cyan-200 flex items-center">
                <i className="fas fa-map-marker-alt mr-2"></i>
                Nevers, France
              </p>
            </div>
          </div>

          {/* Colonne 4 - Urgence */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Urgence 24/7</h3>
            <div className="bg-cyan-700 p-4 rounded-lg">
              <p className="text-sm text-cyan-200 mb-2">
                Service d'urgence disponible
              </p>
              <a
                href="tel:+33123456789"
                className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-full transition-all duration-300 font-semibold"
              >
                <i className="fas fa-bolt mr-2"></i>
                Appel d'urgence
              </a>
            </div>
          </div>
        </div>

        {/* Section copyright */}
        <div className="border-t border-cyan-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p 
                className="text-cyan-300 cursor-pointer select-none"
                onDoubleClick={handleAdminAccess}
                title="Double-cliquez pour accéder à l'administration"
              >
                &copy; {new Date().getFullYear()} QTB Electrotech. Tous droits réservés.
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-cyan-300 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                Mentions légales
              </a>
              <a
                href="#"
                className="text-cyan-300 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                Politique de confidentialité
              </a>
              <a
                href="#"
                className="text-cyan-300 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                CGV
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
