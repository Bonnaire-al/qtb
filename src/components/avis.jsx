import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import ApiService from '../services/api';

const MAX_STARS = 5;

// Étoile SVG réutilisable (remplie ou vide)
function StarIcon({ filled, className = '' }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function StarRating({ value, max = MAX_STARS, sizeClass = 'text-xl', interactive = false, onChange }) {
  const [hover, setHover] = useState(0);
  const display = interactive ? (hover || value) : value;
  const content = (n) => (
    <span className={n <= display ? 'text-amber-400' : 'text-gray-300'}>
      <StarIcon filled={n <= display} />
    </span>
  );
  return (
    <div className={`flex flex-wrap gap-1 ${sizeClass}`} role={interactive ? 'group' : undefined} aria-label={interactive ? `Note sur ${max}, sélectionnez de 1 à ${max} étoiles` : undefined}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) =>
        interactive ? (
          <button
            key={n}
            type="button"
            onClick={() => onChange?.(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className={`p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 cursor-pointer hover:scale-110 transition-transform ${n <= display ? 'text-amber-400 hover:text-amber-500' : 'text-gray-300 hover:text-gray-400'}`}
            aria-label={`Donner ${n} sur ${max} étoiles`}
            aria-pressed={value === n}
          >
            <StarIcon filled={n <= display} />
          </button>
        ) : (
          <span key={n}>{content(n)}</span>
        )
      )}
    </div>
  );
}

export default function Avis() {
  const [avisList, setAvisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ author_name: '', comment: '', stars: 5, google_account: '' });

  const loadAvis = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAvis();
      setAvisList(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setAvisList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvis();
  }, []);

  const isValidEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((str || '').trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.author_name.trim()) {
      setError('Veuillez indiquer votre nom.');
      return;
    }
    if (!form.comment.trim()) {
      setError('Veuillez écrire un commentaire.');
      return;
    }
    if (!form.google_account.trim()) {
      setError('Veuillez indiquer votre email (compte Google).');
      return;
    }
    if (!isValidEmail(form.google_account)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }
    try {
      setSubmitLoading(true);
      setError(null);
      await ApiService.createAvis({
        author_name: form.author_name.trim(),
        comment: form.comment.trim(),
        stars: form.stars,
        google_account: form.google_account.trim()
      });
      setForm({ author_name: '', comment: '', stars: 5, google_account: '' });
      await loadAvis();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatDate = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return isNaN(d.getTime()) ? str : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <section className="py-16 bg-cyan-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-cyan-800 mb-2 text-center">Ce que disent nos clients</h2>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          La satisfaction de nos clients est notre priorité
        </p>

        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="lg:w-2/3">
            {loading ? (
              <div className="bg-white p-8 rounded-lg shadow-lg text-center text-gray-500">Chargement des avis…</div>
            ) : avisList.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-lg text-center text-gray-500">Aucun avis pour le moment. Soyez le premier à en laisser un !</div>
            ) : (
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 6000 }}
                className="testimonialSwiper"
              >
                {avisList.map((avis) => (
                  <SwiperSlide key={avis.id}>
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                      <div className="flex items-center mb-4">
                        <StarRating value={avis.stars} max={MAX_STARS} />
                        <span className="ml-2 text-gray-500">{avis.stars}/{MAX_STARS}</span>
                      </div>
                      <p className="text-gray-700 text-lg italic mb-6">"{avis.comment}"</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {(avis.author_name || 'A').charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <p className="font-bold text-cyan-800">{avis.author_name || 'Anonyme'}</p>
                            <p className="text-gray-600 text-sm">{formatDate(avis.created_at)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-cyan-800 mb-4">Laisser un avis</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Votre nom *</label>
                  <input
                    type="text"
                    value={form.author_name}
                    onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Ex. Marie Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (compte Google) *</label>
                  <input
                    type="email"
                    value={form.google_account}
                    onChange={(e) => setForm((f) => ({ ...f, google_account: e.target.value }))}
                    required
                    autoComplete="email"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Ex. prenom.nom@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire *</label>
                  <textarea
                    value={form.comment}
                    onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                    required
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Partagez votre expérience..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Note (sur {MAX_STARS} étoiles)</label>
                  <p className="text-xs text-gray-500 mb-2">Cliquez sur les étoiles pour choisir votre note</p>
                  <StarRating
                    value={form.stars}
                    max={MAX_STARS}
                    interactive
                    onChange={(n) => setForm((f) => ({ ...f, stars: n }))}
                  />
                  <p className="mt-1 text-sm text-cyan-700 font-medium">Sélectionné : {form.stars} / {MAX_STARS}</p>
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={submitLoading || !form.author_name.trim() || !form.comment.trim() || !form.google_account.trim() || !isValidEmail(form.google_account)}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  {submitLoading ? 'Envoi…' : 'Publier mon avis'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
