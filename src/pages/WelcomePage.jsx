import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Welcome from '../components/welcome';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import Home from './Home';

function WelcomePage() {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleWelcomeAnimationComplete = () => {
      // Masquer Welcome et afficher la navbar immédiatement
      setShowWelcome(false);
      setShowNavbar(true);
      
      // Redirection après un court délai
      setTimeout(() => {
        navigate('/accueil');
      }, 500);
    };

    window.addEventListener('welcomeAnimationComplete', handleWelcomeAnimationComplete);

    return () => {
      window.removeEventListener('welcomeAnimationComplete', handleWelcomeAnimationComplete);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen">
      {/* Page d'accueil en arrière-plan */}
      <div className="App flex flex-col min-h-screen">
        {showNavbar && <Navbar />}
        <main className="flex-grow">
          <Home />
        </main>
        {showNavbar && <Footer />}
      </div>
      
      {/* Composant Welcome par-dessus */}
      {showWelcome && <Welcome />}
    </div>
  );
}

export default WelcomePage; 