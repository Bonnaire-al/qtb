import React from 'react';
import { Link } from 'react-router-dom';

const HIGHLIGHTS = [
  {
    title: 'Plus de 10 ans d\'expérience',
    text: 'Installation, rénovation, mise aux normes et dépannage à Nevers et alentours.',
    icon: '⚡',
  },
  {
    title: 'Équipe certifiée',
    text: 'Électriciens diplômés, ponctuels et à l\'écoute pour chaque intervention.',
    icon: '🛠️',
  },
  {
    title: 'Innovation & tradition',
    text: 'Électricité classique, domotique, IRVE — des solutions modernes et fiables.',
    icon: '🏠',
  },
  {
    title: 'Intervention rapide',
    text: 'Dépannages urgents traités sous 24 h dans notre zone d\'intervention.',
    icon: '📍',
  },
];

const VALUES = [
  'Transparence et honnêteté dans les devis',
  'Sécurité et respect des normes',
  'Fiabilité et réactivité',
  'Travail propre, soigné et durable',
];

export default function About() {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero visuel avec l'image */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-cyan-50 to-white">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="order-2 lg:order-1">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-600">
                QTB — Nevers (58000)
              </p>
              <h1 className="mb-5 text-3xl font-extrabold leading-tight text-cyan-900 sm:text-4xl lg:text-5xl">
                Electricien Nevers La Charité
              </h1>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                <strong>QTB</strong> est une entreprise d&apos;électricité avec plus de 10 ans d&apos;expérience.
                Nous intervenons sur tous types de chantiers pour garantir des installations durables,
                sécurisées et conformes aux normes en vigueur.
              </p>
              <p className="mb-8 text-lg leading-relaxed text-gray-600">
                Passionnés par les technologies et le travail bien fait, nous combinons savoir-faire
                traditionnel et solutions modernes pour améliorer le confort et la sécurité de nos clients.
              </p>
              <Link
                to="/quote"
                className="inline-flex items-center rounded-lg bg-cyan-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-cyan-700"
              >
                Demander un devis
              </Link>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-cyan-300/40 to-sky-200/60 blur-sm" aria-hidden />
                <div className="relative overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
                  <img
                    src="/image/back-hp.png"
                    alt="QTB — Électricien à Nevers La Charité"
                    className="h-auto w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 rounded-xl bg-white px-5 py-3 shadow-lg sm:-bottom-6 sm:-left-6">
                  <p className="text-2xl font-bold text-cyan-800">10+</p>
                  <p className="text-sm font-medium text-gray-600">ans d&apos;expérience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Points forts en grille */}
      <section className="py-14 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-cyan-800 sm:text-3xl">Ce qui nous définit</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Une équipe engagée, des interventions soignées et un accompagnement clair à chaque étape.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map(({ title, text, icon }) => (
              <article
                key={title}
                className="rounded-xl border border-cyan-100 bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
              >
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-2xl" aria-hidden>
                  {icon}
                </span>
                <h3 className="mb-2 text-lg font-bold text-cyan-800">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs + distinction */}
      <section className="bg-cyan-900 py-14 text-white md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Nos valeurs</h2>
              <ul className="space-y-4">
                {VALUES.map((value) => (
                  <li key={value} className="flex items-start gap-3 text-lg">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-sm font-bold">
                      ✓
                    </span>
                    {value}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
              <h2 className="mb-4 text-2xl font-bold">Ce qui nous distingue</h2>
              <p className="text-lg leading-relaxed text-cyan-50">
                Notre force réside dans la combinaison du métier traditionnel et des technologies
                actuelles : domotique, bornes IRVE, diagnostic de sécurité. Nous intervenons
                rapidement, conseillons avec clarté et visons un excellent rapport qualité/prix.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Zone d'intervention */}
      <section className="py-14 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-4 text-center text-2xl font-bold text-cyan-800 sm:text-3xl">
              Zone d&apos;intervention
            </h2>
            <p className="mb-8 text-center text-lg text-gray-600">
              Basés à Nevers, nous couvrons la ville et ses environs : Fourchambault,
              Varennes-Vauzelles, Coulanges-lès-Nevers, Marzy, Challuy, Sermoise-sur-Loire,
              Garchizy, Pougues-les-Eaux, etc.
            </p>
            <div className="h-72 overflow-hidden rounded-2xl shadow-lg sm:h-96">
              <iframe
                title="Zone d'intervention QTB à Nevers"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.9649649649647!2d3.153793315627964!3d46.98955397914645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f0f0e2e2e2e2e3%3A0x123456789abcdef!2sNevers!5e0!3m2!1sfr!2sfr!4v1717177171717"
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
