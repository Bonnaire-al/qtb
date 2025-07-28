import React from 'react';

export default function About() {
  return (
    <section className="py-16 bg-cyan-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-cyan-800 mb-4">Qui sommes-nous ?</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez notre entreprise, notre passion et nos valeurs au service de vos projets électriques.
            </p>
          </div>

          {/* Présentation */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-cyan-800 mb-2">Présentation de l'entreprise</h2>
            <p className="text-gray-700 text-lg">
              <strong>QTB</strong> est une entreprise d’électricité basée à Nevers (58000), avec plus de 10 ans d’expérience. Nous intervenons dans tous types de chantiers : installation, rénovation, mise aux normes, et dépannage. Formés et certifiés, nous travaillons selon les normes en vigueur pour garantir des résultats durables et sécurisés.
            </p>
          </div>

          {/* Passion */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-cyan-800 mb-2">Notre passion pour l’électricité</h2>
            <p className="text-gray-700 text-lg">
              Passionnés par les technologies et le travail bien fait, nous avons choisi ce métier pour son utilité, sa précision et sa dimension humaine. Nous aimons apporter des solutions sur mesure, à la fois modernes et fiables, pour améliorer le confort et la sécurité de nos clients.
            </p>
          </div>

          {/* Équipe */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-cyan-800 mb-2">Une équipe à votre service</h2>
            <p className="text-gray-700 text-lg">
              L’équipe QTB est composée d’électriciens diplômés, ponctuels, soigneux et à l’écoute. Chaque intervention est effectuée avec sérieux, que ce soit un dépannage rapide ou un projet de grande envergure.
            </p>
          </div>

          {/* Valeurs */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-cyan-800 mb-2">Nos valeurs</h2>
            <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
              <li>✔️ Transparence et honnêteté dans les devis et les conseils</li>
              <li>✔️ Sécurité et respect des normes</li>
              <li>✔️ Fiabilité et réactivité</li>
              <li>✔️ Travail propre, soigné et durable</li>
            </ul>
          </div>

          {/* Ce qui nous distingue */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-cyan-800 mb-2">Ce qui nous distingue</h2>
            <p className="text-gray-700 text-lg">
              Ce qui fait notre différence, c’est notre capacité à combiner savoir-faire traditionnel et innovation. Nous maîtrisons aussi bien l’électricité classique que les technologies modernes (domotique, IRVE, etc.). Nous nous engageons à intervenir rapidement, à conseiller avec clarté et à garantir un excellent rapport qualité/prix.
            </p>
          </div>

          {/* Zone d’intervention */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-cyan-800 mb-2">Zone d’intervention</h2>
            <p className="text-gray-700 text-lg mb-4">
              Basés à Nevers (58000), nous intervenons dans toute la ville et ses environs : Fourchambault, Varennes-Vauzelles, Coulanges-lès-Nevers, Marzy, Challuy, Sermoise-sur-Loire, Garchizy, Pougues-les-Eaux, etc.<br />
              Pour les dépannages urgents, nous faisons le maximum pour intervenir sous 24h.
            </p>
            <div className="w-full h-72 rounded-lg overflow-hidden shadow-md">
              <iframe
                title="Zone d'intervention"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.9649649649647!2d3.153793315627964!3d46.98955397914645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f0f0e2e2e2e2e3%3A0x123456789abcdef!2sNevers!5e0!3m2!1sfr!2sfr!4v1717177171717"
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="border-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
