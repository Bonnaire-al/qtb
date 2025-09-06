import React, { useState } from 'react';
import Form from '../components/QuoteForm';
import ModalQuote from '../components/QuoteFonction(pdf)';

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
  const [devisItems, setDevisItems] = useState([]); // Stockage des prestations sélectionnées

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
        // Aller directement au formulaire du service
        setShowServiceModal(true);
        setServiceModalAnim('in');
      }, 400); // durée de l'animation
    }
  };

  // Quand on valide le formulaire spécifique : slide out left puis afficher aperçu
  const handleCloseServiceModal = (items) => {
    setDevisItems(items || []); // Stocker les prestations sélectionnées
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

  // Rendu dynamique du formulaire selon le service
  const renderServiceForm = () => {
    return <Form 
      serviceType={formData.service} 
      onClose={handleCloseServiceModal} 
      onCancel={handleCancelToStep1} 
    />;
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
        {showServiceModal && (
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

        {/* Étape 2 : Aperçu du devis au format A4 */}
        {step === 2 && (
          <ModalQuote 
            formData={formData} 
            onBackToStep1={() => setStep(1)} 
            devisItems={devisItems}
          />
        )}
      </div>
    </div>
  );
}

export default Quote;
