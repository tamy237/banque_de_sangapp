import React from 'react'

export default function Home() {
  return (
     <div className="bg-gray-50 text-gray-800">
      {/* NAVBAR */}
      <header className="bg-red-600 text-white">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="text-2xl font-bold">🩸 Banque de Sang</div>
          <nav className="space-x-6 hidden md:block">
            <a href="#" className="hover:underline">Accueil</a>
            <a href="#" className="hover:underline">Collectes</a>
            <a href="#" className="hover:underline">Donateurs</a>
            <a href="#" className="hover:underline">Contact</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="container mx-auto flex flex-col-reverse md:flex-row items-center py-16 px-6">
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold">Don de Sang</h1>
          <p className="text-lg text-gray-700">
            Offrez une seconde chance, sauvez des vies avec un simple geste.
          </p>
          <div className="space-x-4">
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg">Trouver une collecte</button>
            <button className="bg-gray-200 hover:bg-gray-300 text-red-700 px-6 py-3 rounded-lg">En savoir plus</button>
          </div>
        </div>
        <div className="md:w-1/2 mb-8 md:mb-0">
          <img src="https://img.freepik.com/free-photo/nurse-doctor-taking-care-patient-blood-donation-clinic_23-2149215865.jpg" alt="Don de sang" className="rounded-2xl shadow-lg"/>
        </div>
      </section>

      {/* INFOS RAPIDES */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <img src="https://cdn-icons-png.flaticon.com/512/619/619034.png" className="w-20 mx-auto mb-4" alt=""/>
            <h3 className="text-xl font-semibold mb-2">Pourquoi Donner ?</h3>
            <p>Chaque don peut sauver jusqu’à 3 vies. Soyez un héros.</p>
          </div>
          <div>
            <img src="https://cdn-icons-png.flaticon.com/512/1645/1645689.png" className="w-20 mx-auto mb-4" alt=""/>
            <h3 className="text-xl font-semibold mb-2">Où Donner ?</h3>
            <p>Trouvez les centres et collectes proches de chez vous.</p>
          </div>
          <div>
            <img src="https://cdn-icons-png.flaticon.com/512/2642/2642555.png" className="w-20 mx-auto mb-4" alt=""/>
            <h3 className="text-xl font-semibold mb-2">Qui Peut Donner ?</h3>
            <p>Vous avez entre 18 et 65 ans et êtes en bonne santé ? Venez !</p>
          </div>
        </div>
      </section>

      {/* APPEL À L’ACTION */}
      <section className="bg-red-600 text-white py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à sauver des vies ?</h2>
        <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">Inscrivez-vous maintenant</button>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        © 2025 Banque de Sang. Tous droits réservés.
      </footer>
    </div>
  )
};
