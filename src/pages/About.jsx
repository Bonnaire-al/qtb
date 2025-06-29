import React from 'react'

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">À propos</h1>
        <p className="text-lg text-gray-600 mb-6">
          Cette application a été créée avec React, Vite, Tailwind CSS et React Router.
          Elle démontre l'utilisation de ces technologies modernes pour créer des applications web performantes et élégantes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">React</h3>
            <p className="text-gray-600">Bibliothèque JavaScript pour créer des interfaces utilisateur</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Tailwind CSS</h3>
            <p className="text-gray-600">Framework CSS utilitaire pour un développement rapide</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">React Router</h3>
            <p className="text-gray-600">Routage côté client pour les applications React</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About 