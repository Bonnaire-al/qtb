import React, { useState, useCallback } from 'react';
import { materielPrestations } from '../data/materiel';

export default function ModalQuote({ formData, onBackToStep1, devisItems = [] }) {
  const [pdfData, setPdfData] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  // Fonction pour générer le PDF avec pdfmake
  const handleGeneratePDF = useCallback(async () => {
    try {
      // Import dynamique de pdfmake
      const pdfMake = (await import('pdfmake/build/pdfmake')).default;
      const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default;
      
      // Configuration des polices
      try {
        if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
          pdfMake.vfs = pdfFonts.pdfMake.vfs;
        } else if (pdfFonts && pdfFonts.vfs) {
          pdfMake.vfs = pdfFonts.vfs;
        } else if (pdfFonts && pdfFonts.default && pdfFonts.default.vfs) {
          pdfMake.vfs = pdfFonts.default.vfs;
        }
      } catch {
        // Utilisation des polices par défaut
      }

      // Calculer les totaux
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

      // Collecter tous les matériaux nécessaires
      const allMaterials = [];
      if (devisItems && devisItems.length > 0) {
        devisItems.forEach((item) => {
          item.services.forEach((service) => {
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

      // Créer les lignes du tableau main d'œuvre
      const mainOeuvreRows = [];
      if (devisItems && devisItems.length > 0) {
        devisItems.forEach((item) => 
          item.services.forEach((service, serviceIndex) => {
            const totalHT = service.quantity * service.priceHT;
            const tva = totalHT * 0.20;
            const totalTTC = totalHT + tva;
            const isFirstService = serviceIndex === 0;
            
            mainOeuvreRows.push([
              isFirstService ? item.room : '',
              service.label,
              service.quantity.toString(),
              service.priceHT > 0 ? `${service.priceHT.toFixed(2)} €` : 'À définir',
              '20%',
              service.priceHT > 0 ? `${totalTTC.toFixed(2)} €` : 'À définir'
            ]);
          })
        );
      } else {
        mainOeuvreRows.push(['-', 'Services sélectionnés', '1', 'À définir', '20%', 'À définir']);
      }

      // Créer les lignes du tableau matériel
      const materielRows = [];
      if (allMaterials.length > 0) {
        allMaterials.forEach((material) => {
          const totalHT = material.quantite * material.prixHT;
          const tva = totalHT * 0.20;
          const totalTTC = totalHT + tva;
          
          materielRows.push([
            material.nom,
            material.quantite.toString(),
            `${material.prixHT.toFixed(2)} €`,
            '20%',
            `${totalTTC.toFixed(2)} €`
          ]);
        });
      } else {
        materielRows.push(['Matériel nécessaire', '-', 'À définir', '20%', 'À définir']);
      }

      // Définition du document PDF
      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        content: [
          // En-tête avec logo
          {
            columns: [
              {
                width: 'auto',
                stack: [
                  {
                    text: 'QTBE',
                    style: 'companyName'
                  },
                  {
                    text: 'Services Électriques',
                    style: 'companySubtitle'
                  }
                ]
              },
              {
                width: '*',
                text: ''
              },
              {
                width: 'auto',
                stack: [
                  {
                    text: `Date: ${new Date().toLocaleDateString('fr-FR')}`,
                    style: 'date'
                  }
                ]
              }
            ],
            margin: [0, 0, 0, 20]
          },
          
          // Titre principal
          {
            text: 'DEVIS PROFORMA',
            style: 'header',
            alignment: 'center',
            margin: [0, 0, 0, 20]
          },

          // Informations client et projet
          {
            columns: [
              {
                width: '50%',
                stack: [
                  {
                    text: 'Informations Client :',
                    style: 'sectionTitle'
                  },
                  {
                    text: `Nom : ${formData?.name || 'Non renseigné'}`,
                    style: 'infoText'
                  },
                  {
                    text: `Email : ${formData?.email || 'Non renseigné'}`,
                    style: 'infoText'
                  },
                  {
                    text: `Tél : ${formData?.phone || 'Non renseigné'}`,
                    style: 'infoText'
                  }
                ]
              },
              {
                width: '50%',
                stack: [
                  {
                    text: 'Informations Projet :',
                    style: 'sectionTitle'
                  },
                  {
                    text: `Adresse : ${formData?.address || 'Non renseigné'}`,
                    style: 'infoText'
                  },
                  {
                    text: `Type : ${formData?.serviceType || 'Non renseigné'}`,
                    style: 'infoText'
                  },
                  ...(formData?.company ? [{
                    text: `Entreprise : ${formData.company}`,
                    style: 'infoText'
                  }] : [])
                ]
              }
            ],
            margin: [0, 0, 0, 20]
          },

          // Tableau Main d'œuvre
          {
            text: 'Main d\'œuvre',
            style: 'tableTitle',
            margin: [0, 0, 0, 10]
          },
          {
            table: {
              headerRows: 1,
              widths: ['20%', '35%', '10%', '15%', '10%', '10%'],
              body: [
                [
                  { text: 'Pièce', style: 'tableHeader' },
                  { text: 'Désignation', style: 'tableHeader' },
                  { text: 'Nombre', style: 'tableHeader' },
                  { text: 'Prix HT', style: 'tableHeader' },
                  { text: 'TVA', style: 'tableHeader' },
                  { text: 'Total', style: 'tableHeader' }
                ],
                ...mainOeuvreRows,
                [
                  { text: 'Total Main d\'œuvre HT :', colSpan: 5, style: 'totalCell' },
                  '',
                  '',
                  '',
                  '',
                  { text: totalMainOeuvreHT > 0 ? `${totalMainOeuvreHT.toFixed(2)} €` : 'À définir', style: 'totalCell' }
                ]
              ]
            },
            layout: 'lightHorizontalLines',
            margin: [0, 0, 0, 20]
          },

          // Tableau Matériel
          {
            text: 'Matériel',
            style: 'tableTitle',
            margin: [0, 0, 0, 10]
          },
          {
            table: {
              headerRows: 1,
              widths: ['50%', '15%', '15%', '10%', '10%'],
              body: [
                [
                  { text: 'Désignation', style: 'tableHeader' },
                  { text: 'Quantité', style: 'tableHeader' },
                  { text: 'Prix HT', style: 'tableHeader' },
                  { text: 'TVA', style: 'tableHeader' },
                  { text: 'Total', style: 'tableHeader' }
                ],
                ...materielRows,
                [
                  { text: 'Total Matériel HT :', colSpan: 4, style: 'totalCell' },
                  '',
                  '',
                  '',
                  { text: totalMaterielHT > 0 ? `${totalMaterielHT.toFixed(2)} €` : 'À définir', style: 'totalCell' }
                ]
              ]
            },
            layout: 'lightHorizontalLines',
            margin: [0, 0, 0, 20]
          },

          // Total général
          {
            columns: [
              {
                width: '*',
                text: ''
              },
              {
                width: 'auto',
                table: {
                  widths: ['auto', 'auto'],
                  body: [
                    [
                      { text: 'Total HT :', style: 'totalRow' },
                      { text: totalHT > 0 ? `${totalHT.toFixed(2)} €` : 'À définir', style: 'totalRow' }
                    ],
                    [
                      { text: 'TVA (20%) :', style: 'totalRow' },
                      { text: totalTVA > 0 ? `${totalTVA.toFixed(2)} €` : 'À définir', style: 'totalRow' }
                    ],
                    [
                      { text: 'Total TTC :', style: 'totalTTC' },
                      { text: totalTTC > 0 ? `${totalTTC.toFixed(2)} €` : 'À définir', style: 'totalTTC' }
                    ]
                  ]
                },
                layout: 'lightHorizontalLines'
              }
            ],
            margin: [0, 0, 0, 20]
          },

          // Conditions
          {
            text: 'Conditions',
            style: 'sectionTitle',
            margin: [0, 20, 0, 10]
          },
          {
            columns: [
              {
                width: '50%',
                stack: [
                  { text: '• Valable 30 jours', style: 'conditionText' },
                  { text: '• Prix HT + TVA applicable', style: 'conditionText' },
                  { text: '• Délai selon complexité', style: 'conditionText' }
                ]
              },
              {
                width: '50%',
                stack: [
                  { text: '• Garantie conforme normes', style: 'conditionText' },
                  { text: '• 30% commande, 70% livraison', style: 'conditionText' },
                  { text: '• Engagement ferme', style: 'conditionText' }
                ]
              }
            ]
          }
        ],
        styles: {
          header: {
            fontSize: 20,
            color: '#1e3a8a',
            margin: [0, 0, 0, 10]
          },
          companyName: {
            fontSize: 16,
            color: '#1e3a8a',
            margin: [0, 0, 0, 2]
          },
          companySubtitle: {
            fontSize: 12,
            color: '#6b7280',
            margin: [0, 0, 0, 2]
          },
          date: {
            fontSize: 10,
            color: '#9ca3af'
          },
          sectionTitle: {
            fontSize: 12,
            color: '#374151',
            margin: [0, 0, 0, 8]
          },
          infoText: {
            fontSize: 10,
            color: '#374151',
            margin: [0, 0, 0, 3]
          },
          tableTitle: {
            fontSize: 12,
            color: '#1e40af',
            background: '#dbeafe',
            margin: [0, 0, 0, 8]
          },
          tableHeader: {
            fontSize: 9,
            color: '#1e40af',
            background: '#dbeafe',
            alignment: 'center'
          },
          totalCell: {
            fontSize: 9,
            alignment: 'center'
          },
          totalRow: {
            fontSize: 9,
            alignment: 'right'
          },
          totalTTC: {
            fontSize: 10,
            color: '#1e40af',
            background: '#dbeafe',
            alignment: 'right'
          },
          conditionText: {
            fontSize: 9,
            color: '#6b7280',
            margin: [0, 0, 0, 3]
          }
        },
        defaultStyle: {
          fontSize: 9
        }
      };

      // Générer le PDF
      const pdfDoc = pdfMake.createPdf(docDefinition);
      
      // Obtenir le PDF en base64 pour le viewer
      pdfDoc.getBase64((data) => {
        const pdfBase64 = `data:application/pdf;base64,${data}`;
        setPdfData(pdfBase64);
        setShowViewer(true);
        setPdfError(null);
      });
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      setPdfError(`Erreur lors de la génération du PDF: ${error.message}`);
    }
  }, [formData, devisItems]);

  // Fonction pour télécharger le PDF
  const handleDownloadPDF = () => {
    if (pdfData) {
      const clientName = formData?.name || 'client';
      const fileName = `devis_${clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      const link = document.createElement('a');
      link.href = pdfData;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Fonction pour fermer le viewer
  const handleCloseViewer = () => {
    setShowViewer(false);
    setPdfData(null);
    setPdfError(null);
  };

  // Générer automatiquement le PDF au chargement du composant
  React.useEffect(() => {
    handleGeneratePDF();
  }, [handleGeneratePDF]);
                    
                    return (
                      <>
      {/* Interface simple avec bouton retour */}
      <div className="bg-white rounded-xl shadow-lg p-8 animate-slide-in-right">
        <h2 className="text-2xl font-bold text-cyan-800 mb-6 text-center">Génération du devis</h2>
        
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800 mr-2"></div>
              Génération du PDF en cours...
                </div>
          </div>
          
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors transform hover:scale-105"
            onClick={onBackToStep1}
          >
            ← Retour
          </button>
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
            <div className="flex-1 overflow-hidden">
              {pdfData ? (
                <iframe
                  src={pdfData}
                  className="w-full h-full border-0"
                  title="Aperçu du devis"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement du PDF...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Affichage des erreurs */}
      {pdfError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Erreur de génération</h3>
              <p className="text-gray-600 mb-4">{pdfError}</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleGeneratePDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Réessayer
                </button>
                <button
                  onClick={onBackToStep1}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}