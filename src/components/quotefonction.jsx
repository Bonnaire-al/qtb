import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ModalQuote({ formData, onBackToStep1, devisItems = [] }) {
  const printRef = useRef();

  // Fonction pour générer le PDF
  const handleGeneratePDF = async () => {
    const printContent = printRef.current;
    if (printContent) {
      try {
        const canvas = await html2canvas(printContent, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 794,
          height: 1123
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        const clientName = formData?.name || 'client';
        const fileName = `devis_qtbe_${clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        
        // Télécharger le PDF
        pdf.save(fileName);
        
        // Afficher un message de succès
        alert('PDF généré avec succès !');
        
      } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
      }
    }
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

        {/* Aperçu du devis au format A4 */}
        <div className="flex justify-center">
          <div 
            ref={printRef}
            className="devis-print-container bg-white border border-gray-300 shadow-lg"
            style={{
              width: '210mm',
              minHeight: '297mm',
              padding: '20mm',
              boxSizing: 'border-box'
            }}
          >
            {/* En-tête du devis */}
            <div className="devis-header">
              <h1 className="text-2xl font-bold text-gray-800 mb-3">DEVIS PROFORMA</h1>
            </div>

            {/* Logo et nom de l'entreprise */}
            <div className="company-info mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="logo w-16 h-4 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold print-colors">
                  QT
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
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><strong>Nom :</strong> {formData?.name || 'Non renseigné'}</div>
                <div><strong>Email :</strong> {formData?.email || 'Non renseigné'}</div>
                <div><strong>Tél :</strong> {formData?.phone || 'Non renseigné'}</div>
                <div className="col-span-3"><strong>Adresse :</strong> {formData?.address || 'Non renseigné'}</div>
                {formData?.company && <div className="col-span-3"><strong>Entreprise :</strong> {formData.company}</div>}
              </div>
            </div>

            {/* Tableau Matériel */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">
                Matériel et Prestations
              </h3>
              <table className="table w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-blue-600 text-white print-colors">
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
                      {devisItems.map((item, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 p-2 text-xs">
                            {item.room} - {item.services.join(', ')}
                          </td>
                          <td className="border border-gray-300 p-2 text-center text-xs">1</td>
                          <td className="border border-gray-300 p-2 text-center text-xs">À définir</td>
                          <td className="border border-gray-300 p-2 text-center text-xs">20%</td>
                          <td className="border border-gray-300 p-2 text-center text-xs">À définir</td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td className="border border-gray-300 p-2 text-xs">Prestations sélectionnées</td>
                      <td className="border border-gray-300 p-2 text-center text-xs">1</td>
                      <td className="border border-gray-300 p-2 text-center text-xs">À définir</td>
                      <td className="border border-gray-300 p-2 text-center text-xs">20%</td>
                      <td className="border border-gray-300 p-2 text-center text-xs">À définir</td>
                    </tr>
                  )}
                  <tr className="total-row print-colors">
                    <td colSpan="4" className="border border-gray-300 p-2 text-center font-bold text-xs">Total Matériel HT :</td>
                    <td className="border border-gray-300 p-2 text-center font-bold text-xs">À définir</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tableau Main d'œuvre */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">
                Main d'œuvre
              </h3>
              <table className="table w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-blue-600 text-white print-colors">
                    <th className="border border-gray-300 p-2 text-left text-xs">Désignation</th>
                    <th className="border border-gray-300 p-2 text-center text-xs">Nombre</th>
                    <th className="border border-gray-300 p-2 text-center text-xs">Prix HT</th>
                    <th className="border border-gray-300 p-2 text-center text-xs">TVA</th>
                    <th className="border border-gray-300 p-2 text-center text-xs">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2 text-xs">Installation et configuration</td>
                    <td className="border border-gray-300 p-2 text-center text-xs">1</td>
                    <td className="border border-gray-300 p-2 text-center text-xs">À définir</td>
                    <td className="border border-gray-300 p-2 text-center text-xs">20%</td>
                    <td className="border border-gray-300 p-2 text-center text-xs">À définir</td>
                  </tr>
                  <tr className="total-row print-colors">
                    <td colSpan="4" className="border border-gray-300 p-2 text-center text-xs">Total Main d'œuvre HT :</td>
                    <td className="border border-gray-300 p-2 text-center font-bold text-xs">À définir</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total général */}
            <div className="mb-6 flex justify-end">
              <table className="table border-collapse border border-gray-300 text-sm" style={{ width: '33.33%' }}>
                <tbody>
                  <tr className="bg-gray-100 font-bold print-colors">
                    <td className="border border-gray-300 p-2 text-right text-xs">Total HT :</td>
                    <td className="border border-gray-300 p-2 text-center text-xs">À définir</td>
                  </tr>
                  <tr className="bg-gray-100 font-bold print-colors">
                    <td className="border border-gray-300 p-2 text-right text-xs">TVA (20%) :</td>
                    <td className="border border-gray-300 p-2 text-center text-xs">À définir</td>
                  </tr>
                  <tr className="bg-blue-100 font-bold text-sm print-colors">
                    <td className="border border-gray-300 p-2 text-right text-xs">Total TTC :</td>
                    <td className="border border-gray-300 p-2 text-center text-xs">À définir</td>
                  </tr>
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
                <p>Adresse: [Votre adresse]</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
