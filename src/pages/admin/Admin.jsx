import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ApiService from '../../services/api';

// Hook personnalisé pour la gestion des données (Matériel/Prestations)
const useDataManagement = (apiService, initialCategory = '') => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [dataList, setDataList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingValues, setEditingValues] = useState({});

  // Charger les catégories une seule fois au montage
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await apiService.getAll();
        const uniqueCategories = [...new Set(data.map(item => item.categorie))].sort();
        setCategories(uniqueCategories);
        if (uniqueCategories.length > 0 && !selectedCategory) {
          setSelectedCategory(uniqueCategories[0]);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
      }
    };
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiService]); // Se déclenche seulement si apiService change (jamais avec useMemo)

  // Charger les données quand la catégorie change
  useEffect(() => {
    if (!selectedCategory) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getByCategory(selectedCategory);
        setDataList(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Erreur lors du chargement des données:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedCategory, apiService]);

  const handleInputChange = (id, field, value) => {
    setEditingValues(prev => ({
      ...prev,
      [`${id}-${field}`]: value
    }));
  };

  const handleUpdate = useCallback(async (id, field, value, numericFields = []) => {
    const item = dataList.find(d => d.id === id);
    if (!item) return;
    
    const currentValue = item[field];
    let newValue = value;
    
    if (numericFields.includes(field)) {
      const parsed = parseFloat(value);
      newValue = (isNaN(parsed) || value === '' || value === null) ? 0 : parsed;
    }
    
    if (currentValue === newValue) {
      setEditingValues(prev => {
        const newValues = { ...prev };
        delete newValues[`${id}-${field}`];
        return newValues;
      });
      return;
    }
    
    try {
      const updatedData = { ...item, [field]: newValue };
      await apiService.update(id, updatedData);
      
      setDataList(prev => prev.map(d => 
        d.id === id ? { ...d, [field]: newValue } : d
      ));
      
      setEditingValues(prev => {
        const newValues = { ...prev };
        delete newValues[`${id}-${field}`];
        return newValues;
      });
    } catch (err) {
      alert(`Erreur lors de la mise à jour : ${err.message}`);
      // Recharger les données en cas d'erreur
      if (!selectedCategory) return;
      try {
        const data = await apiService.getByCategory(selectedCategory);
        setDataList(data);
      } catch (reloadErr) {
        console.error('Erreur lors du rechargement:', reloadErr);
      }
    }
  }, [dataList, selectedCategory, apiService]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    try {
      await apiService.delete(id);
      // Recharger les données
      if (!selectedCategory) return;
      setLoading(true);
      const data = await apiService.getByCategory(selectedCategory);
      setDataList(data);
      setLoading(false);
    } catch (err) {
      alert(`Erreur lors de la suppression : ${err.message}`);
      setLoading(false);
    }
  }, [selectedCategory, apiService]);

  const getFieldValue = (item, field) => {
    const key = `${item.id}-${field}`;
    return editingValues[key] !== undefined ? editingValues[key] : item[field];
  };

  const reloadData = useCallback(async () => {
    if (!selectedCategory) return;
    
    try {
      setLoading(true);
      const data = await apiService.getByCategory(selectedCategory);
      setDataList(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du chargement des données:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, apiService]);

  return {
    selectedCategory,
    setSelectedCategory,
    dataList,
    categories,
    loading,
    error,
    handleInputChange,
    handleUpdate,
    handleDelete,
    getFieldValue,
    loadData: reloadData
  };
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('materiel');
  const [savedQuotes, setSavedQuotes] = useState([]);

  useEffect(() => {
    const quotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
    setSavedQuotes(quotes);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
    } else {
      alert('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setPassword('');
  };

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Composant de connexion
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Administration QTBE
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez le mot de passe"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Se connecter
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Mot de passe par défaut : admin123
            </p>
          </form>
        </div>
      </div>
    );
  }

  // Interface admin principale
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Panneau d'Administration
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('materiel')}
              className={`${
                activeTab === 'materiel'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Matériel
            </button>
            <button
              onClick={() => setActiveTab('prestation')}
              className={`${
                activeTab === 'prestation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Prestations
            </button>
            <button
              onClick={() => setActiveTab('devis')}
              className={`${
                activeTab === 'devis'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Devis ({savedQuotes.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="mt-8 pb-8">
          {activeTab === 'materiel' && <MaterielManager />}
          {activeTab === 'prestation' && <PrestationManager />}
          {activeTab === 'devis' && <DevisManager quotes={savedQuotes} setQuotes={setSavedQuotes} />}
        </div>
      </div>
    </div>
  );
};

// Composant de gestion du matériel
const MaterielManager = () => {
  const [selectedCategory, setSelectedCategory] = useState('domotique');
  const [materielList, setMaterielList] = useState([]);
  const [availablePrestations, setAvailablePrestations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    categorie: 'domotique',
    nom: '',
    service_values: [],
    type_produit: 'materiel',
    prix_ht: 0
  });

  const categories = ['domotique', 'installation', 'portail', 'securite'];

  // Charger les prestations disponibles selon la catégorie
  useEffect(() => {
    const loadPrestations = async () => {
      try {
        const prestations = await ApiService.getPrestationsByCategorie(selectedCategory);
        setAvailablePrestations(prestations);
      } catch (err) {
        console.error('Erreur lors du chargement des prestations:', err);
      }
    };
    loadPrestations();
  }, [selectedCategory]);

  // Charger les données du matériel selon la catégorie
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const materiel = await ApiService.getMaterielByCategorie(selectedCategory);
        setMaterielList(materiel || []);
      } catch (err) {
        const errorMessage = err.message || 'Erreur lors de la récupération du matériel';
        setError(errorMessage);
        console.error('❌ Erreur lors du chargement des données:', err);
        console.error('Détails:', err);
        
        // Afficher un message d'erreur plus détaillé dans la console
        if (err.message && err.message.includes('Erreur lors de la récupération du matériel')) {
          console.warn('⚠️ La table materiel pourrait ne pas exister ou avoir besoin d\'être migrée');
          console.warn('💡 Essayez d\'exécuter: node backend/migrations/restructure-materiel-table.js');
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedCategory]);

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    try {
      await ApiService.deleteMateriel(id);
      const materiel = await ApiService.getMaterielByCategorie(selectedCategory);
      setMaterielList(materiel || []);
    } catch (err) {
      alert(`Erreur lors de la suppression : ${err.message}`);
    }
  };

  const handleEdit = (item) => {
    // Convertir service_value (string ou array) en array pour l'édition
    const serviceValues = Array.isArray(item.service_values) 
      ? item.service_values 
      : (item.service_value ? (typeof item.service_value === 'string' ? item.service_value.split(',').map(s => s.trim()) : [item.service_value]) : []);
    
    setEditingItem({
      ...item,
      service_values: serviceValues
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingItem(null);
  };

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-red-600 font-semibold mb-2">Erreur : {error}</p>
            <p className="text-red-500 text-sm">
              La table materiel pourrait nécessiter une migration.
              <br />
              Vérifiez la console du serveur pour plus de détails.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Si la table materiel n'existe pas encore avec la nouvelle structure,
              <br />
              exécutez: <code className="bg-gray-100 px-1 rounded">node backend/migrations/restructure-materiel-table.js</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setNewItem({
      categorie: selectedCategory,
      nom: '',
      service_values: [],
      type_produit: 'materiel',
      prix_ht: 0
    });
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewItem({
      categorie: selectedCategory,
      nom: '',
      service_values: [],
      type_produit: 'materiel',
      prix_ht: 0
    });
  };

  const handleNewItemChange = (field, value) => {
    setNewItem(prev => ({
      ...prev,
      [field]: field === 'prix_ht' ? parseFloat(value) || 0 : value
    }));
  };

  const handleServiceValueToggle = (serviceValue, isEdit = false) => {
    if (isEdit) {
      setEditingItem(prev => {
        const currentValues = prev.service_values || [];
        const newValues = currentValues.includes(serviceValue)
          ? currentValues.filter(v => v !== serviceValue)
          : [...currentValues, serviceValue];
        return { ...prev, service_values: newValues };
      });
    } else {
      setNewItem(prev => {
        const currentValues = prev.service_values || [];
        const newValues = currentValues.includes(serviceValue)
          ? currentValues.filter(v => v !== serviceValue)
          : [...currentValues, serviceValue];
        return { ...prev, service_values: newValues };
      });
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      if (!newItem.nom || !newItem.service_values || newItem.service_values.length === 0) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }
      const dataToSend = {
        ...newItem,
        service_value: newItem.service_values.join(',')
      };
      await ApiService.createMateriel(dataToSend);
      const materiel = await ApiService.getMaterielByCategorie(selectedCategory);
      setMaterielList(materiel || []);
      handleCloseAddModal();
    } catch (err) {
      alert(`Erreur lors de l'ajout : ${err.message}`);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      if (!editingItem.nom || !editingItem.service_values || editingItem.service_values.length === 0) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }
      const dataToSend = {
        ...editingItem,
        service_value: editingItem.service_values.join(',')
      };
      await ApiService.updateMateriel(editingItem.id, dataToSend);
      const materiel = await ApiService.getMaterielByCategorie(selectedCategory);
      setMaterielList(materiel || []);
      handleCloseEditModal();
    } catch (err) {
      alert(`Erreur lors de la mise à jour : ${err.message}`);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Gestion du Matériel</h2>
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom matériel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service value (prestation)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type produit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix HT (€)</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {materielList.map((item) => {
              // Afficher les service_values (peut être string ou array)
              const serviceValues = Array.isArray(item.service_values) 
                ? item.service_values 
                : (item.service_value ? (typeof item.service_value === 'string' ? item.service_value.split(',').map(s => s.trim()) : [item.service_value]) : []);
              
              const serviceValuesDisplay = serviceValues.map(sv => {
                const presta = availablePrestations.find(p => p.service_value === sv);
                return presta ? `${sv} (${presta.service_label})` : sv;
              }).join(', ');
              
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.nom}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {serviceValuesDisplay || 'Aucun'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.type_produit === 'materiel' ? 'Matériel' : 'Fourniture'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.prix_ht ? item.prix_ht.toFixed(2) : '0.00'} €</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Modifier"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {materielList.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  Aucun matériel trouvé pour cette catégorie
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Modal d'ajout */}
    {showAddModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un matériel</h3>
          <form onSubmit={handleSubmitAdd}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom matériel *</label>
                <input
                  type="text"
                  value={newItem.nom}
                  onChange={(e) => handleNewItemChange('nom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom du matériel"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service value (prestation) *</label>
                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-2">
                  {availablePrestations.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-2">Aucune prestation disponible pour cette catégorie</p>
                  ) : (
                    availablePrestations.map(presta => (
                      <label key={presta.service_value} className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={newItem.service_values.includes(presta.service_value)}
                          onChange={() => handleServiceValueToggle(presta.service_value, false)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">
                          <span className="font-medium">{presta.service_value}</span> - {presta.service_label}
                        </span>
                      </label>
                    ))
                  )}
                </div>
                {newItem.service_values.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {newItem.service_values.length} prestation(s) sélectionnée(s)
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type produit *</label>
                <select
                  value={newItem.type_produit}
                  onChange={(e) => handleNewItemChange('type_produit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="fourniture">Fourniture</option>
                  <option value="materiel">Matériel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix HT (€) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newItem.prix_ht}
                  onChange={(e) => handleNewItemChange('prix_ht', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleCloseAddModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Valider
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Modal d'édition */}
    {showEditModal && editingItem && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifier un matériel</h3>
          <form onSubmit={handleSubmitEdit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom matériel *</label>
                <input
                  type="text"
                  value={editingItem.nom}
                  onChange={(e) => setEditingItem({...editingItem, nom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom du matériel"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service value (prestation) *</label>
                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-2">
                  {availablePrestations.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-2">Aucune prestation disponible pour cette catégorie</p>
                  ) : (
                    availablePrestations.map(presta => (
                      <label key={presta.service_value} className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={editingItem.service_values.includes(presta.service_value)}
                          onChange={() => handleServiceValueToggle(presta.service_value, true)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">
                          <span className="font-medium">{presta.service_value}</span> - {presta.service_label}
                        </span>
                      </label>
                    ))
                  )}
                </div>
                {editingItem.service_values.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {editingItem.service_values.length} prestation(s) sélectionnée(s)
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type produit *</label>
                <select
                  value={editingItem.type_produit}
                  onChange={(e) => setEditingItem({...editingItem, type_produit: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="fourniture">Fourniture</option>
                  <option value="materiel">Matériel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix HT (€) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editingItem.prix_ht}
                  onChange={(e) => setEditingItem({...editingItem, prix_ht: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Modifier
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

// Composant de gestion des prestations
const PrestationManager = () => {
  const prestationApi = useMemo(() => ({
    getAll: ApiService.getAllPrestations,
    getByCategory: ApiService.getPrestationsByCategorie,
    update: ApiService.updatePrestation,
    delete: ApiService.deletePrestation,
    create: ApiService.createPrestation
  }), []);

  const {
    selectedCategory,
    setSelectedCategory,
    dataList: prestationsList,
    categories,
    loading,
    error,
    handleInputChange,
    handleUpdate: baseHandleUpdate,
    handleDelete,
    getFieldValue,
    loadData: loadPrestations
  } = useDataManagement(prestationApi, 'domotique');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    categorie: '',
    type_prestation: 'piece_unique', // Nouveau: type de prestation
    piece_unique: '', // Pour pièce unique
    pieces: [], // Pour sélection multiple
    service_value: '',
    service_label: '',
    prix_ht: 0
  });

  const handleUpdate = (id, field, value) => {
    baseHandleUpdate(id, field, value, ['prix_ht']);
  };

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Erreur : {error}</div>;

  const handleOpenAddModal = () => {
    setNewItem({
      categorie: selectedCategory,
      type_prestation: 'piece_unique',
      piece_unique: '',
      pieces: [],
      service_value: '',
      service_label: '',
      prix_ht: 0
    });
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewItem({
      categorie: '',
      type_prestation: 'piece_unique',
      piece_unique: '',
      pieces: [],
      service_value: '',
      service_label: '',
      prix_ht: 0
    });
  };

  const handleNewItemChange = (field, value) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePieceToggle = (piece) => {
    setNewItem(prev => ({
      ...prev,
      pieces: prev.pieces.includes(piece)
        ? prev.pieces.filter(p => p !== piece)
        : [...prev.pieces, piece]
    }));
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      if (!newItem.service_value || !newItem.service_label) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }

      let prestationData = { ...newItem };

      // Gérer les 3 types de prestations
      if (newItem.type_prestation === 'piece_unique') {
        if (!newItem.piece_unique) {
          alert('Veuillez sélectionner une pièce');
          return;
        }
        prestationData.piece = newItem.piece_unique;
        prestationData.pieces_applicables = null;
      } else if (newItem.type_prestation === 'commun') {
        prestationData.piece = 'commun';
        prestationData.pieces_applicables = null;
      } else if (newItem.type_prestation === 'selection') {
        if (newItem.pieces.length === 0) {
          alert('Veuillez sélectionner au moins une pièce');
          return;
        }
        prestationData.piece = 'selection';
        prestationData.pieces_applicables = newItem.pieces.join(',');
      }
      
      await ApiService.createPrestation(prestationData);
      await loadPrestations();
      handleCloseAddModal();
    } catch (err) {
      alert(`Erreur lors de l'ajout : ${err.message}`);
    }
  };

  return (
    <>
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Gestion des Prestations</h2>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pièce</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service (value)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Libellé</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix HT (€)</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prestationsList.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={getFieldValue(item, 'piece') || ''}
                        onChange={(e) => handleInputChange(item.id, 'piece', e.target.value)}
                        onBlur={(e) => handleUpdate(item.id, 'piece', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="commun"
                      />
                      {item.piece === 'commun' && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Commun</span>
                      )}
                      {item.piece === 'selection' && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Sélection</span>
                      )}
                      {item.piece && item.piece !== 'commun' && item.piece !== 'selection' && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Unique</span>
                      )}
                    </div>
                    {item.pieces_applicables && (
                      <span className="text-xs text-gray-500 mt-1">
                        Pièces: {item.pieces_applicables}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={getFieldValue(item, 'service_value')}
                    onChange={(e) => handleInputChange(item.id, 'service_value', e.target.value)}
                    onBlur={(e) => handleUpdate(item.id, 'service_value', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={getFieldValue(item, 'service_label')}
                    onChange={(e) => handleInputChange(item.id, 'service_label', e.target.value)}
                    onBlur={(e) => handleUpdate(item.id, 'service_label', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    step="0.01"
                    value={getFieldValue(item, 'prix_ht') || 0}
                    onChange={(e) => handleInputChange(item.id, 'prix_ht', e.target.value)}
                    onBlur={(e) => handleUpdate(item.id, 'prix_ht', e.target.value)}
                    className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Supprimer"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {prestationsList.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  Aucune prestation trouvée pour cette catégorie
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Modal d'ajout */}
    {showAddModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une prestation</h3>
          <form onSubmit={handleSubmitAdd}>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={newItem.categorie}
                  onChange={(e) => handleNewItemChange('categorie', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de prestation *</label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="type_prestation"
                      value="piece_unique"
                      checked={newItem.type_prestation === 'piece_unique'}
                      onChange={(e) => handleNewItemChange('type_prestation', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Pièce unique</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="type_prestation"
                      value="commun"
                      checked={newItem.type_prestation === 'commun'}
                      onChange={(e) => handleNewItemChange('type_prestation', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Commun (toutes les pièces)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="type_prestation"
                      value="selection"
                      checked={newItem.type_prestation === 'selection'}
                      onChange={(e) => handleNewItemChange('type_prestation', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Sélection (plusieurs pièces)</span>
                  </label>
                </div>
              </div>

              {/* Pièce unique */}
              {newItem.type_prestation === 'piece_unique' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pièce *</label>
                  <select
                    value={newItem.piece_unique}
                    onChange={(e) => handleNewItemChange('piece_unique', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionnez une pièce</option>
                    {[
                      { value: 'chambre', label: 'Chambre' },
                      { value: 'salon', label: 'Salon' },
                      { value: 'cuisine', label: 'Cuisine' },
                      { value: 'salle_de_bain', label: 'Salle de bain' },
                      { value: 'toilette', label: 'Toilette' },
                      { value: 'couloir', label: 'Couloir' },
                      { value: 'escalier', label: 'Escalier' },
                      { value: 'cellier', label: 'Cellier' },
                      { value: 'cave', label: 'Cave' },
                      { value: 'garage', label: 'Garage' },
                      { value: 'grenier', label: 'Grenier' },
                      { value: 'exterieur', label: 'Extérieur' }
                    ].map(piece => (
                      <option key={piece.value} value={piece.value}>{piece.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sélection multiple */}
              {newItem.type_prestation === 'selection' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pièces sélectionnées *</label>
                  <div className="grid grid-cols-3 gap-1 max-h-24 overflow-y-auto border border-gray-300 rounded-lg p-2">
                    {[
                      { value: 'chambre', label: 'Chambre' },
                      { value: 'salon', label: 'Salon' },
                      { value: 'cuisine', label: 'Cuisine' },
                      { value: 'salle_de_bain', label: 'Salle de bain' },
                      { value: 'toilette', label: 'Toilette' },
                      { value: 'couloir', label: 'Couloir' },
                      { value: 'escalier', label: 'Escalier' },
                      { value: 'cellier', label: 'Cellier' },
                      { value: 'cave', label: 'Cave' },
                      { value: 'garage', label: 'Garage' },
                      { value: 'grenier', label: 'Grenier' },
                      { value: 'exterieur', label: 'Extérieur' }
                    ].map(piece => (
                      <label key={piece.value} className="flex items-center space-x-1 text-xs">
                        <input
                          type="checkbox"
                          checked={newItem.pieces.includes(piece.value)}
                          onChange={() => handlePieceToggle(piece.value)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{piece.label}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Sélectionnez les pièces où cette prestation s'applique.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Libellé *</label>
                  <input
                    type="text"
                    value={newItem.service_label}
                    onChange={(e) => handleNewItemChange('service_label', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom affiché du service"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service (value) *</label>
                    <input
                      type="text"
                      value={newItem.service_value}
                      onChange={(e) => handleNewItemChange('service_value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="eclairage"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix HT (€) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newItem.prix_ht}
                      onChange={(e) => handleNewItemChange('prix_ht', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="50.00"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleCloseAddModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Valider
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

// Composant de gestion des devis
const DevisManager = ({ quotes, setQuotes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuotes, setSelectedQuotes] = useState([]);

  // Fonction pour ouvrir le PDF dans une nouvelle fenêtre
  const openPDF = (pdfUrl) => {
    if (!pdfUrl) {
      alert('Aucun PDF disponible pour ce devis');
      return;
    }

    try {
      // Si c'est déjà une data URL base64
      if (pdfUrl.startsWith('data:application/pdf;base64,')) {
        // Convertir base64 en blob
        const base64Data = pdfUrl.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        
        // Ouvrir dans un nouvel onglet
        const newWindow = window.open(blobUrl, '_blank');
        if (!newWindow) {
          alert('Veuillez autoriser les pop-ups pour afficher le PDF');
          URL.revokeObjectURL(blobUrl);
          return;
        }
        
        // Nettoyer le blob URL après ouverture (avec un délai pour laisser le navigateur charger)
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 1000);
      } else {
        // Si c'est déjà une URL normale, l'ouvrir directement
        window.open(pdfUrl, '_blank');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du PDF:', error);
      alert('Erreur lors de l\'ouverture du PDF. Veuillez réessayer.');
    }
  };

  const deleteQuote = (indexOrId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      // Si c'est un index numérique, utiliser l'ancienne méthode
      if (typeof indexOrId === 'number') {
        const newQuotes = quotes.filter((_, i) => i !== indexOrId);
        setQuotes(newQuotes);
        localStorage.setItem('savedQuotes', JSON.stringify(newQuotes));
        setSelectedQuotes(prev => prev.filter(i => i !== indexOrId));
      } else {
        // Sinon, supprimer par ID ou date
        const newQuotes = quotes.filter(q => q.id !== indexOrId && q.date !== indexOrId);
        setQuotes(newQuotes);
        localStorage.setItem('savedQuotes', JSON.stringify(newQuotes));
      }
    }
  };

  const handleSelectQuote = (index) => {
    setSelectedQuotes(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSelectAll = () => {
    if (selectedQuotes.length === filteredQuotes.length) {
      setSelectedQuotes([]);
    } else {
      setSelectedQuotes(filteredQuotes.map((_, index) => index));
    }
  };

  const deleteSelectedQuotes = () => {
    if (selectedQuotes.length === 0) return;
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedQuotes.length} devis sélectionné(s) ?`)) {
      const newQuotes = quotes.filter((_, i) => !selectedQuotes.includes(i));
      setQuotes(newQuotes);
      localStorage.setItem('savedQuotes', JSON.stringify(newQuotes));
      setSelectedQuotes([]);
    }
  };

  const exportQuotes = () => {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `devis_export_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const filteredQuotes = quotes.filter(quote => 
    quote.formData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.formData?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.formData?.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Devis Générés</h2>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {quotes.length > 0 && (
            <button
              onClick={exportQuotes}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exporter
            </button>
          )}
        </div>
      </div>

      {/* Actions en lot */}
      {filteredQuotes.length > 0 && (
        <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedQuotes.length === filteredQuotes.length && filteredQuotes.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {selectedQuotes.length === filteredQuotes.length ? 'Tout désélectionner' : 'Tout sélectionner'}
              </span>
            </label>
            {selectedQuotes.length > 0 && (
              <span className="text-sm text-gray-600">
                {selectedQuotes.length} devis sélectionné(s)
              </span>
            )}
          </div>
          {selectedQuotes.length > 0 && (
            <button
              onClick={deleteSelectedQuotes}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer sélectionnés
            </button>
          )}
        </div>
      )}

      {filteredQuotes.length === 0 ? (
        <div className="text-center py-12">
          <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">Aucun devis {searchTerm ? 'trouvé' : 'sauvegardé'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <input
                    type="checkbox"
                    checked={selectedQuotes.length === filteredQuotes.length && filteredQuotes.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total TTC</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotes.map((quote, filteredIndex) => {
                // Trouver l'index réel dans la liste originale quotes
                const originalIndex = quotes.findIndex(q => q.id === quote.id || q.date === quote.date);
                return (
                  <tr key={quote.id || filteredIndex} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <input
                        type="checkbox"
                        checked={selectedQuotes.includes(filteredIndex)}
                        onChange={() => handleSelectQuote(filteredIndex)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(quote.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {quote.formData?.name || 'N/A'}
                      {quote.formData?.company && (
                        <span className="block text-xs text-gray-500">{quote.formData.company}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {quote.formData?.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {quote.formData?.serviceType || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {quote.totalTTC ? `${quote.totalTTC.toFixed(2)} €` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {quote.pdfUrl && (
                          <button 
                            onClick={() => openPDF(quote.pdfUrl)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Voir le PDF"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        )}
                        <button 
                          onClick={() => deleteQuote(quote.id || quote.date || originalIndex)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
