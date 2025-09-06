import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { materielPrestations } from '../data/materiel';

export default function ModalQuote({ formData, onBackToStep1, devisItems = [] }) {
  const printRef = useRef();
  const [pdfData, setPdfData] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  // Fonction pour générer le PDF et l'afficher dans le viewer
  const handleGeneratePDF = async () => {
    const printContent = printRef.current;
    if (printContent) {
      try {
        // Détection de la taille d'écran pour ajuster les paramètres
        const isMobile = window.innerWidth < 768;
        
        const canvas = await html2canvas(printContent, {
          scale: isMobile ? 1.5 : 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: isMobile ? 794 : undefined,
          height: isMobile ? 1123 : undefined,
          scrollX: 0,
          scrollY: 0,
          windowWidth: isMobile ? 794 : window.innerWidth,
          windowHeight: isMobile ? 1123 : window.innerHeight
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Dimensions A4 en mm
        const pageWidth = 210;
        const pageHeight = 297;
        
        // Calculer les dimensions de l'image pour remplir toute la largeur
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 0;
        
        // Ajouter l'image en utilisant toute la largeur de la page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Gérer les pages multiples si nécessaire
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        // Convertir le PDF en base64 pour le viewer
        const pdfBase64 = pdf.output('datauristring');
        
        // Afficher le viewer avec le PDF généré
        setPdfData(pdfBase64);
        setShowViewer(true);
        setPdfError(null);
        
      } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
      }
    }
  };

  // Fonction pour télécharger le PDF
  const handleDownloadPDF = () => {
    if (pdfData) {
      const clientName = formData?.name || 'client';
      const fileName = `devis_qtbe_${clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      const link = document.createElement('a');
      link.href = pdfData;
      link.download = fileName;
      link.click();
    }
  };

  // Fonction pour fermer le viewer
  const handleCloseViewer = () => {
    setShowViewer(false);
    setPdfData(null);
    setPdfError(null);
  };


  return (
    <>
      {/* Interface principale */}
      <div className="bg-white rounded-xl shadow-lg p-8 animate-slide-in-right">
        <h2 className="text-2xl font-bold text-cyan-800 mb-6 text-center">Génération du devis</h2>
        
        {/* Boutons d'action */}
        <div className="text-center mb-6 space-x-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors transform hover:scale-105"
            onClick={handleGeneratePDF}
          >
            📄 Générer le PDF
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors transform hover:scale-105"
            onClick={onBackToStep1}
          >
            ← Retour
          </button>
        </div>


        {/* Aperçu du devis */}
        <div className="flex justify-center">
          <div 
            ref={printRef}
            className="devis-print-container bg-white border border-gray-300 shadow-lg p-8"
            style={{
              width: '210mm',
              minHeight: '297mm',
              maxWidth: '100%',
              margin: '0 auto'
            }}
          >
                {/* En-tête du devis */}
                <div className="devis-header mb-4">
                  <h1 className="text-2xl font-bold text-gray-800 mb-3 mt-0">DEVIS PROFORMA</h1>
                </div>

                {/* Logo et nom de l'entreprise */}
                <div className="company-info mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="logo w-32 h-20 flex items-center justify-center">
                      <img 
                        src="/image/logo.png" 
                        alt="Logo QTBE" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">QTBE</h2>
                      <p className="text-sm text-gray-600">Services Électriques</p>
                      <p className="text-xs text-gray-500">Date: {new Date().toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>

                {/* Informations client */}
                <div className="client-info mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Informations Client :</h3>
                      <p><strong>Nom :</strong> {formData?.name || 'Non renseigné'}</p>
                      <p><strong>Email :</strong> {formData?.email || 'Non renseigné'}</p>
                      <p><strong>Tél :</strong> {formData?.phone || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Informations Projet :</h3>
                      <p><strong>Adresse :</strong> {formData?.address || 'Non renseigné'}</p>
                      <p><strong>Type :</strong> {formData?.serviceType || 'Non renseigné'}</p>
                      {formData?.company && <p><strong>Entreprise :</strong> {formData.company}</p>}
                    </div>
                  </div>
                </div>

                {/* Tableau Main d'œuvre */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-blue-900 mb-2 border-b-2 border-blue-700 pb-1 bg-blue-200 px-2 py-1 rounded">
                    Main d'œuvre
                  </h3>
              <table className="table w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-blue-50 text-blue-900 print-colors">
                    <th className="border border-gray-300 p-2 text-left text-xs">Pièce</th>
                    <th className="border border-gray-300 p-2 text-left text-xs">Désignation</th>
                    <th className="border border-gray-300 p-2 text-center text-xs">Nombre</th>
                    <th className="border border-gray-300 p-2 text-center text-xs">Prix HT</th>
                    <th className="border border-gray-300 p-2 text-center text-xs">TVA</th>
                    <th className="border border-gray-300 p-2 text-center text-xs">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {devisItems && devisItems.length > 0 ? (
                    <>
                      {devisItems.map((item, itemIndex) => 
                        item.services.map((service, serviceIndex) => {
                          const totalHT = service.quantity * service.priceHT;
                          const tva = totalHT * 0.20;
                          const totalTTC = totalHT + tva;
                          const isFirstService = serviceIndex === 0;
                          
                          return (
                            <tr key={`${itemIndex}-${serviceIndex}`}>
                              <td className="border border-gray-300 p-2 text-xs font-medium">
                                {isFirstService ? item.room : ''}
                              </td>
                              <td className="border border-gray-300 p-2 text-xs">
                                {service.label}
                              </td>
                              <td className="border border-gray-300 p-2 text-center text-xs">
                                {service.quantity}
                              </td>
                              <td className="border border-gray-300 p-2 text-center text-xs">
                                {service.priceHT > 0 ? `${service.priceHT.toFixed(2)} €` : 'À définir'}
                              </td>
                              <td className="border border-gray-300 p-2 text-center text-xs">20%</td>
                              <td className="border border-gray-300 p-2 text-center text-xs">
                                {service.priceHT > 0 ? `${totalTTC.toFixed(2)} €` : 'À définir'}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </>
                  ) : (
                    <tr>
                      <td className="border border-gray-300 p-2 text-xs">-</td>
                      <td className="border border-gray-300 p-2 text-xs">Services sélectionnés</td>
                      <td className="border border-gray-300 p-2 text-center text-xs">1</td>
                      <td className="border border-gray-300 p-2 text-center text-xs">À définir</td>
                      <td className="border border-gray-300 p-2 text-center text-xs">20%</td>
                      <td className="border border-gray-300 p-2 text-center text-xs">À définir</td>
                    </tr>
                  )}
                  <tr className="total-row print-colors">
                    <td colSpan="5" className="border border-gray-300 p-2 text-center font-bold text-xs">Total Main d'œuvre HT :</td>
                    <td className="border border-gray-300 p-2 text-center font-bold text-xs">
                      {devisItems && devisItems.length > 0 
                        ? `${devisItems.reduce((total, item) => 
                            total + item.services.reduce((itemTotal, service) => 
                              itemTotal + (service.quantity * service.priceHT), 0
                            ), 0
                          ).toFixed(2)} €`
                        : 'À définir'
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tableau Matériel */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-blue-900 mb-2 border-b-2 border-blue-700 pb-1 bg-blue-200 px-2 py-1 rounded">
                Matériel
              </h3>
              <table className="table w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-blue-50 text-blue-900 print-colors">
                    <th className="border border-gray-300 p-2 text-left text-xs">Désignation</th>
                    <th className="border border-gray-300 p-2 text-center text-xs">Quantité</th>
                    <th className="border border-gray-300 p-2 text-center text-xs">Prix HT</th>
                    <th className="border border-gray-300 p-2 text-center text-xs">TVA</th>
                    <th className="border border-gray-300 p-2 text-center text-xs">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    // Collecter tous les matériaux nécessaires
                    const allMaterials = [];
                    
                    if (devisItems && devisItems.length > 0) {
                      devisItems.forEach((item) => {
                        item.services.forEach((service) => {
                          // Trouver les matériaux pour ce service
                          const serviceType = formData?.service || 'domotique';
                          const roomKey = Object.keys(materielPrestations[serviceType] || {}).find(room => 
                            room === item.room.toLowerCase().replace(/\s+/g, '_')
                          );
                          
                          if (roomKey && materielPrestations[serviceType][roomKey]) {
                            const serviceKey = Object.keys(materielPrestations[serviceType][roomKey]).find(key => 
                              materielPrestations[serviceType][roomKey][key].some(mat => 
                                mat.nom.toLowerCase().includes(service.label.toLowerCase().split(' ')[0])
                              )
                            );
                            
                            if (serviceKey && materielPrestations[serviceType][roomKey][serviceKey]) {
                              materielPrestations[serviceType][roomKey][serviceKey].forEach(material => {
                                const existingMaterial = allMaterials.find(mat => mat.nom === material.nom);
                                if (existingMaterial) {
                                  existingMaterial.quantite += material.quantite * service.quantity;
                                } else {
                                  allMaterials.push({
                                    nom: material.nom,
                                    quantite: material.quantite * service.quantity,
                                    prixHT: material.prixHT
                                  });
                                }
                              });
                            }
                          }
                        });
                      });
                    }
                    
                    return allMaterials.length > 0 ? (
                      <>
                        {allMaterials.map((material, index) => {
                          const totalHT = material.quantite * material.prixHT;
                          const tva = totalHT * 0.20;
                          const totalTTC = totalHT + tva;
                          
                          return (
                            <tr key={index}>
                              <td className="border border-gray-300 p-2 text-xs">
                                {material.nom}
                              </td>
                              <td className="border border-gray-300 p-2 text-center text-xs">
                                {material.quantite}
                              </td>
                              <td className="border border-gray-300 p-2 text-center text-xs">
                                {material.prixHT.toFixed(2)} €
                              </td>
                              <td className="border border-gray-300 p-2 text-center text-xs">20%</td>
                              <td className="border border-gray-300 p-2 text-center text-xs">
                                {totalTTC.toFixed(2)} €
                              </td>
                            </tr>
                          );
                        })}
                      </>
                    ) : (
                      <tr>
                        <td className="border border-gray-300 p-2 text-xs">Matériel nécessaire</td>
                        <td className="border border-gray-300 p-2 text-center text-xs">-</td>
                        <td className="border border-gray-300 p-2 text-center text-xs">À définir</td>
                        <td className="border border-gray-300 p-2 text-center text-xs">20%</td>
                        <td className="border border-gray-300 p-2 text-center text-xs">À définir</td>
                      </tr>
                    );
                  })()}
                  <tr className="total-row print-colors">
                    <td colSpan="4" className="border border-gray-300 p-2 text-center font-bold text-xs">Total Matériel HT :</td>
                    <td className="border border-gray-300 p-2 text-center font-bold text-xs">
                      {(() => {
                        const totalMateriel = devisItems && devisItems.length > 0 
                          ? devisItems.reduce((total, item) => {
                              let itemTotal = 0;
                              item.services.forEach(service => {
                                const serviceType = formData?.service || 'domotique';
                                const roomKey = Object.keys(materielPrestations[serviceType] || {}).find(room => 
                                  room === item.room.toLowerCase().replace(/\s+/g, '_')
                                );
                                
                                if (roomKey && materielPrestations[serviceType][roomKey]) {
                                  const serviceKey = Object.keys(materielPrestations[serviceType][roomKey]).find(key => 
                                    materielPrestations[serviceType][roomKey][key].some(mat => 
                                      mat.nom.toLowerCase().includes(service.label.toLowerCase().split(' ')[0])
                                    )
                                  );
                                  
                                  if (serviceKey && materielPrestations[serviceType][roomKey][serviceKey]) {
                                    materielPrestations[serviceType][roomKey][serviceKey].forEach(material => {
                                      itemTotal += material.quantite * material.prixHT * service.quantity;
                                    });
                                  }
                                }
                              });
                              return total + itemTotal;
                            }, 0)
                          : 0;
                        return totalMateriel > 0 ? `${totalMateriel.toFixed(2)} €` : 'À définir';
                      })()}
                    </td>
                  </tr>
                </tbody>
              </table>
                </div>

                {/* Total général */}
            <div className="mb-6 flex justify-end">
              <table className="table border-collapse border border-gray-300 text-sm" style={{ width: '33.33%' }}>
                <tbody>
                  {(() => {
                    const totalMainOeuvreHT = devisItems && devisItems.length > 0 
                      ? devisItems.reduce((total, item) => 
                          total + item.services.reduce((itemTotal, service) => 
                            itemTotal + (service.quantity * service.priceHT), 0
                          ), 0
                        )
                      : 0;
                    
                    const totalMaterielHT = devisItems && devisItems.length > 0 
                      ? devisItems.reduce((total, item) => {
                          let itemTotal = 0;
                          item.services.forEach(service => {
                            const serviceType = formData?.service || 'domotique';
                            const roomKey = Object.keys(materielPrestations[serviceType] || {}).find(room => 
                              room === item.room.toLowerCase().replace(/\s+/g, '_')
                            );
                            
                            if (roomKey && materielPrestations[serviceType][roomKey]) {
                              const serviceKey = Object.keys(materielPrestations[serviceType][roomKey]).find(key => 
                                materielPrestations[serviceType][roomKey][key].some(mat => 
                                  mat.nom.toLowerCase().includes(service.label.toLowerCase().split(' ')[0])
                                )
                              );
                              
                              if (serviceKey && materielPrestations[serviceType][roomKey][serviceKey]) {
                                materielPrestations[serviceType][roomKey][serviceKey].forEach(material => {
                                  itemTotal += material.quantite * material.prixHT * service.quantity;
                                });
                              }
                            }
                          });
                          return total + itemTotal;
                        }, 0)
                      : 0;
                    
                    const totalHT = totalMaterielHT + totalMainOeuvreHT;
                    const totalTVA = totalHT * 0.20;
                    const totalTTC = totalHT + totalTVA;
                    
                    return (
                      <>
                        <tr className="bg-gray-100 font-bold print-colors">
                          <td className="border border-gray-300 p-2 text-right text-xs">Total HT :</td>
                          <td className="border border-gray-300 p-2 text-center text-xs">
                            {totalHT > 0 ? `${totalHT.toFixed(2)} €` : 'À définir'}
                          </td>
                        </tr>
                        <tr className="bg-gray-100 font-bold print-colors">
                          <td className="border border-gray-300 p-2 text-right text-xs">TVA (20%) :</td>
                          <td className="border border-gray-300 p-2 text-center text-xs">
                            {totalTVA > 0 ? `${totalTVA.toFixed(2)} €` : 'À définir'}
                          </td>
                        </tr>
                        <tr className="bg-blue-100 font-bold text-sm print-colors">
                          <td className="border border-gray-300 p-2 text-right text-xs">Total TTC :</td>
                          <td className="border border-gray-300 p-2 text-center text-xs">
                            {totalTTC > 0 ? `${totalTTC.toFixed(2)} €` : 'À définir'}
                          </td>
                        </tr>
                      </>
                    );
                  })()}
                </tbody>
              </table>
            </div>

                {/* Conditions */}
                <div className="conditions">
                  <h3 className="text-base font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">
                    Conditions
                  </h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
                    <div>• Valable 30 jours</div>
                    <div>• Prix HT + TVA applicable</div>
                    <div>• Délai selon complexité</div>
                    <div>• Garantie conforme normes</div>
                    <div>• 30% commande, 70% livraison</div>
                    <div>• Engagement ferme</div>
                  </div>
                </div>

                {/* Pied de page */}
                <div className="footer mt-8 pt-4 border-t border-gray-300">
                  <div className="text-center text-xs text-gray-500 space-y-1">
                    <p>QTBE - Services Électriques</p>
                    <p>Contact: contact@qtbe.com | Tél: +212 XXX XXX XXX</p>
                    <p>• Valable 30 jours • Prix HT + TVA applicable • Délai selon complexité • Garantie conforme normes • 30% commande, 70% livraison • Engagement ferme</p>
                  </div>
                </div>
          </div>
        </div>
      </div>

      {/* Viewer PDF Modal */}
      {showViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* En-tête du viewer */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Aperçu du Devis</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Télécharger
                </button>
                <button
                  onClick={handleCloseViewer}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Fermer
                </button>
              </div>
            </div>

            {/* Contenu du PDF */}
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              {pdfError ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-red-500 text-lg mb-2">❌</div>
                    <p className="text-red-600 font-semibold">{pdfError}</p>
                    <button
                      onClick={() => {
                        setPdfError(null);
                        handleGeneratePDF();
                      }}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Réessayer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center h-full">
                  <iframe
                    src={pdfData}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', minHeight: '600px' }}
                    title="Aperçu du devis PDF"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
