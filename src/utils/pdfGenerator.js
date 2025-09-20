import { 
  calculateTotals, 
  collectAllMaterials, 
  createMainOeuvreRows, 
  createMaterielRows 
} from './pdfCalculs';

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

// Fonction pour configurer les polices pdfmake
export const configurePdfMakeFonts = async (pdfMake, pdfFonts) => {
  try {
    if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
    } else if (pdfFonts && pdfFonts.vfs) {
      pdfMake.vfs = pdfFonts.vfs;
    } else if (pdfFonts && pdfFonts.default && pdfFonts.default.vfs) {
      pdfMake.vfs = pdfFonts.default.vfs;
    }
  } catch (error) {
    console.warn('Utilisation des polices par défaut:', error);
  }
};

// Fonction pour créer la définition du document PDF
export const createPdfDocument = (formData, devisItems) => {
  const serviceType = formData?.service || 'domotique';
  const isCompany = formData?.company && formData.company.trim() !== ''; // Vérifier si le champ entreprise est rempli
  const totals = calculateTotals(devisItems, serviceType, isCompany);
  const allMaterials = collectAllMaterials(devisItems, serviceType);
  const mainOeuvreRows = createMainOeuvreRows(devisItems, isCompany);
  const materielRows = createMaterielRows(allMaterials);

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
        text: `Vous bénéficiez d'une remise de ${totals.discountPercentage}% sur la main d'œuvre grâce à votre commande de plus de ${Math.floor(totals.totalMainOeuvreHT / 1000) * 1000}€.`,
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

// Fonction principale pour générer le PDF
export const generatePDF = async (formData, devisItems) => {
  try {
    // Import dynamique de pdfmake
    const pdfMake = (await import('pdfmake/build/pdfmake')).default;
    const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default;
    
    // Configuration des polices
    await configurePdfMakeFonts(pdfMake, pdfFonts);

    // Créer la définition du document
    const docDefinition = createPdfDocument(formData, devisItems);

    // Générer le PDF
    const pdfDoc = pdfMake.createPdf(docDefinition);
    
    // Retourner une promesse qui résout avec les données PDF
    return new Promise((resolve) => {
      pdfDoc.getBase64((data) => {
        const pdfBase64 = `data:application/pdf;base64,${data}`;
        resolve(pdfBase64);
      });
    });
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw new Error(`Erreur lors de la génération du PDF: ${error.message}`);
  }
};
