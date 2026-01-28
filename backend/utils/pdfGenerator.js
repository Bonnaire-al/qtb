const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
const { 
  calculateTotals, 
  collectAllMaterials, 
  createMainOeuvreRows, 
  createMaterielRows 
} = require('./pdfCalculs');

// Configuration des polices
// En Node.js, pdfFonts est directement l'objet vfs
if (pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (pdfFonts.vfs) {
  pdfMake.vfs = pdfFonts.vfs;
} else {
  // Fallback : pdfFonts est directement le vfs
  pdfMake.vfs = pdfFonts;
}

// Configuration des styles PDF
const pdfStyles = {
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
  discountRow: {
    fontSize: 9,
    color: '#059669',
    alignment: 'right',
    background: '#ecfdf5'
  },
  discountMessage: {
    fontSize: 14,
    color: '#059669',
    bold: true,
    background: '#ecfdf5',
    margin: [10, 10, 10, 10]
  },
  discountDescription: {
    fontSize: 10,
    color: '#059669',
    italic: true
  },
  conditionText: {
    fontSize: 9,
    color: '#6b7280',
    margin: [0, 0, 0, 3]
  }
};

// Fonction pour créer la définition du document PDF
const createPdfDocument = (formData, devisItems, materielsData, materielsCalcules = null) => {
  const isCompany = formData?.company && formData.company.trim() !== '';
  
  // NOUVEAU : Utiliser les matériels calculés si fournis, sinon ancienne méthode
  let totals;
  let materielRows;
  
  if (materielsCalcules && materielsCalcules.materiels && materielsCalcules.materiels.length > 0) {
    // Utiliser les matériels calculés via prestation_materiel_config
    
    // Pour compatibilité, créer structure materielsData simplifiée
    const materielsFormates = materielsCalcules.materiels.map(m => ({
      nom: m.designation,
      quantite: m.quantite,
      prixHT: m.prixHT
    }));
    
    materielRows = createMaterielRows(materielsFormates);
    
    // Calculer les totaux avec nouveaux matériels
    const totalMaterielHT = materielsCalcules.totalHT || 0;
    totals = calculateTotals(
      devisItems,
      {}, // materielsData vide (non utilisé pour compatibilité)
      isCompany,
      totalMaterielHT // Passer total matériel HT directement
    );
  } else {
    // Ancienne méthode (fallback)
    totals = calculateTotals(devisItems, materielsData, isCompany);
    const allMaterials = collectAllMaterials(devisItems, materielsData);
    materielRows = createMaterielRows(allMaterials);
  }
  
  const mainOeuvreRows = createMainOeuvreRows(devisItems, isCompany);

  return {
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
              }] : []),
              {
                text: isCompany ? 'TVA 20% (Entreprise)' : 'TVA 10% (Particulier)',
                style: 'infoText'
              }
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
              { text: totals.totalMainOeuvreHT > 0 ? `${totals.totalMainOeuvreHT.toFixed(2)} €` : 'À définir', style: 'totalCell' }
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
              { text: totals.totalMaterielHT > 0 ? `${totals.totalMaterielHT.toFixed(2)} €` : 'À définir', style: 'totalCell' }
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 20]
      },

      // Remise si applicable
      ...(totals.hasDiscount ? [{
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
                  { text: 'Main d\'œuvre HT :', style: 'totalRow' },
                  { text: `${totals.totalMainOeuvreHT.toFixed(2)} €`, style: 'totalRow' }
                ],
                [
                  { text: `Remise (${totals.discountPercentage}%) :`, style: 'discountRow' },
                  { text: `-${totals.discountAmount.toFixed(2)} €`, style: 'discountRow' }
                ],
                [
                  { text: 'Main d\'œuvre après remise :', style: 'totalRow' },
                  { text: `${totals.totalMainOeuvreHTAfterDiscount.toFixed(2)} €`, style: 'totalRow' }
                ]
              ]
            },
            layout: 'lightHorizontalLines'
          }
        ],
        margin: [0, 0, 0, 20]
      }] : []),

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
                  { text: totals.totalHT > 0 ? `${totals.totalHT.toFixed(2)} €` : 'À définir', style: 'totalRow' }
                ],
                [
                  { text: `TVA (${(totals.tvaRate * 100).toFixed(0)}%) :`, style: 'totalRow' },
                  { text: totals.totalTVA > 0 ? `${totals.totalTVA.toFixed(2)} €` : 'À définir', style: 'totalRow' }
                ],
                [
                  { text: 'Total TTC :', style: 'totalTTC' },
                  { text: totals.totalTTC > 0 ? `${totals.totalTTC.toFixed(2)} €` : 'À définir', style: 'totalTTC' }
                ]
              ]
            },
            layout: 'lightHorizontalLines'
          }
        ],
        margin: [0, 0, 0, 20]
      },

      // Message de remise si applicable
      ...(totals.hasDiscount ? [{
        text: `🎉 Remise automatique appliquée !`,
        style: 'discountMessage',
        alignment: 'center',
        margin: [0, 20, 0, 10]
      }, {
        text: `Vous bénéficiez d'une remise de ${totals.discountPercentage}% sur la main d'œuvre grâce à votre commande de plus de 1000€.`,
        style: 'discountDescription',
        alignment: 'center',
        margin: [0, 0, 0, 20]
      }] : []),

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
    styles: pdfStyles,
    defaultStyle: {
      fontSize: 9
    }
  };
};

// Fonction pour générer le PDF et retourner le buffer
const generatePDFBuffer = (formData, devisItems, materielsData, materielsCalcules = null) => {
  return new Promise((resolve, reject) => {
    try {
      const docDefinition = createPdfDocument(formData, devisItems, materielsData, materielsCalcules);
      const pdfDoc = pdfMake.createPdf(docDefinition);
      
      pdfDoc.getBuffer((buffer) => {
        resolve(buffer);
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Fonction pour générer le PDF en base64
const generatePDFBase64 = (formData, devisItems, materielsData, materielsCalcules = null) => {
  return new Promise((resolve, reject) => {
    try {
      const docDefinition = createPdfDocument(formData, devisItems, materielsData, materielsCalcules);
      const pdfDoc = pdfMake.createPdf(docDefinition);
      
      pdfDoc.getBase64((data) => {
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createPdfDocument,
  generatePDFBuffer,
  generatePDFBase64
};

