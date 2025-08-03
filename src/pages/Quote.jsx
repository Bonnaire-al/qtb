import React, { useState } from 'react';
import DomotiqueForm1 from '../components/DomotiqueForm';
import DomotiqueForm2 from '../components/DomotiqueForm2';
import InstallationForm1 from '../components/InstallationForm';
import InstallationForm2 from '../components/InstallationForm2';
import SecuriteForm1 from '../components/SecuriteForm';
import PortailForm1 from '../components/PortailForm';
// import jsPDF from 'jspdf';

const SERVICES = [
  { key: 'domotique', label: 'Domotique', icon: '🏠' },
  { key: 'installation', label: 'Installation électrique générale', icon: '💡' },
  { key: 'securite', label: 'Système de sécurité', icon: '🔒' },
  { key: 'portail', label: 'Portail électrique / Volet roulant', icon: '🚪' },
];

function Quote() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    company: '',
    service: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceModalAnim, setServiceModalAnim] = useState('in'); // 'in', 'out'
  const [modalAnim, setModalAnim] = useState('in'); // pour le modal de choix
  // Ajouter un nouvel état pour le type de projet (renovation/petit travaux)
  const [projectType, setProjectType] = useState(''); // '' | 'renovation' | 'petit_travaux'

  // Gestion des champs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Étape 1 : validation et passage au choix service
  const handleContinue = (e) => {
    e.preventDefault();
    setShowModal(true);
    setModalAnim('in');
    setProjectType(''); // reset à chaque fois
  };

  // Sélection du service
  const handleServiceSelect = (key) => {
    setFormData({ ...formData, service: key });
  };

  // Validation du service
  const handleValidateService = () => {
    if (formData.service) {
      setModalAnim('out');
      setTimeout(() => {
        setShowModal(false);
        // Pour portail et sécurité, aller directement au formulaire
        if (formData.service === 'portail' || formData.service === 'securite') {
          setShowServiceModal(true);
          setServiceModalAnim('in');
        } else {
          // Pour domotique et installation, afficher le choix rénovation/petit travaux
          setShowServiceModal(true);
          setServiceModalAnim('in');
        }
      }, 400); // durée de l'animation
    }
  };

  // Quand on valide le formulaire spécifique : slide out left puis afficher aperçu
  const handleCloseServiceModal = () => {
    setServiceModalAnim('out');
    setTimeout(() => {
      setShowServiceModal(false);
      setStep(2); // On passe à l'aperçu final
    }, 400); // durée de l'animation
  };

  // Fonction pour retourner à la saisie des identifiants
  const handleCancelToStep1 = () => {
    setServiceModalAnim('out');
    setTimeout(() => {
      setShowServiceModal(false);
      setStep(1); // On retourne à l'étape 1 (saisie des identifiants)
    }, 400); // durée de l'animation
  };

  // Aperçu PDF (placeholder)
  const handleDownloadPDF = () => {
    alert('Fonction de génération PDF à implémenter');
  };

  // Rendu dynamique du formulaire selon le service ET le type de projet
  const renderServiceForm = () => {
    if (formData.service === 'domotique') {
      if (projectType === 'renovation') return <DomotiqueForm1 onClose={handleCloseServiceModal} onCancel={handleCancelToStep1} />;
      if (projectType === 'petit_travaux') return <DomotiqueForm2 onClose={handleCloseServiceModal} onCancel={handleCancelToStep1} />;
    }
    if (formData.service === 'installation') {
      if (projectType === 'renovation') return <InstallationForm1 onClose={handleCloseServiceModal} onCancel={handleCancelToStep1} />;
      if (projectType === 'petit_travaux') return <InstallationForm2 onClose={handleCloseServiceModal} onCancel={handleCancelToStep1} />;
    }
    if (formData.service === 'securite') {
      return <SecuriteForm1 onClose={handleCloseServiceModal} onCancel={handleCancelToStep1} />;
    }
    if (formData.service === 'portail') {
      return <PortailForm1 onClose={handleCloseServiceModal} onCancel={handleCancelToStep1} />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Demander un Devis</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Remplissez ce formulaire pour recevoir un devis personnalisé pour votre projet
          </p>
        </div>

        {/* Étape 1 : Formulaire infos de base */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleContinue} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Entreprise (optionnel)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors transform hover:scale-105"
                >
                  Continuer
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal choix service */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className={`bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative transition-transform duration-400 ${modalAnim === 'in' ? 'animate-slide-in-center' : 'animate-slide-out-left'}`}>
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                onClick={() => setShowModal(false)}
                aria-label="Fermer"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-cyan-800 mb-6 text-center">Choisissez un service</h2>
              <div className="grid grid-cols-1 gap-4">
                {SERVICES.map((srv) => (
                  <button
                    key={srv.key}
                    className={`w-full py-4 rounded-lg border-2 font-semibold text-lg transition-colors flex items-center justify-start gap-4 ${formData.service === srv.key ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-gray-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100'}`}
                    onClick={() => handleServiceSelect(srv.key)}
                  >
                    <span className="text-2xl">{srv.icon}</span>
                    <span>{srv.label}</span>
                  </button>
                ))}
              </div>
              <div className="text-center mt-6">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
                  onClick={handleValidateService}
                  disabled={!formData.service}
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal formulaire spécifique au service (slide-in depuis la droite) */}
        {showServiceModal && !projectType && (formData.service === 'domotique' || formData.service === 'installation') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className={`bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative transition-transform duration-400 ${serviceModalAnim === 'in' ? 'animate-slide-in-center' : 'animate-slide-out-left'}`}>
              <h2 className="text-2xl font-bold text-cyan-800 mb-6 text-center">Quel est le type de projet ?</h2>
              <div className="flex flex-col gap-4">
                <button
                  className="w-full py-4 rounded-lg border-2 font-semibold text-lg transition-colors bg-cyan-600 text-white border-cyan-600 hover:bg-cyan-700"
                  onClick={() => setProjectType('renovation')}
                >
                  Renovation / Installation neuf
                </button>
                <button
                  className="w-full py-4 rounded-lg border-2 font-semibold text-lg transition-colors bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200"
                  onClick={() => setProjectType('petit_travaux')}
                >
                  Petit travaux
                </button>
              </div>
            </div>
          </div>
        )}
        {showServiceModal && ((projectType && (formData.service === 'domotique' || formData.service === 'installation')) || (formData.service === 'portail' || formData.service === 'securite')) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className={`bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative transition-transform duration-400 ${serviceModalAnim === 'in' ? 'animate-slide-in-right' : 'animate-slide-out-left'}`}>
              {/* Titre du service uniquement */}
              <div className="mb-6 border-b pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{SERVICES.find(s => s.key === formData.service)?.icon}</span>
                  <span className="text-xl font-bold text-cyan-800">{SERVICES.find(s => s.key === formData.service)?.label}</span>
                </div>
              </div>
              {/* Formulaire spécifique */}
              {renderServiceForm()}
            </div>
          </div>
        )}

        {/* Étape 2 : Aperçu et PDF */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-lg p-8 animate-slide-in-right">
            <h2 className="text-2xl font-bold text-cyan-800 mb-6 text-center">Aperçu de votre demande de devis</h2>
            <div className="space-y-4 text-lg text-gray-700 max-w-xl mx-auto">
              <div><strong>Nom complet :</strong> {formData.name}</div>
              <div><strong>Email :</strong> {formData.email}</div>
              <div><strong>Adresse :</strong> {formData.address}</div>
              <div><strong>Téléphone :</strong> {formData.phone}</div>
              {formData.company && <div><strong>Entreprise :</strong> {formData.company}</div>}
              <div><strong>Service choisi :</strong> {SERVICES.find(s => s.key === formData.service)?.label}</div>
            </div>
            <div className="text-center mt-8">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors transform hover:scale-105"
                onClick={handleDownloadPDF}
              >
                Télécharger en PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quote;
