import React, { useState } from 'react';
import Link from 'next/link';
import { LibreBarcode } from "../ui/fonts";
import dynamic from 'next/dynamic';

// Cargar el componente Login dinámicamente
const Login = dynamic(() => import('./Login'), { ssr: false });

const Inicio = () => {
  return (
    <InicioContent />
  );
}

const InicioContent = () => {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  return (
    <div className='animate-fade animate-once animate-duration-3000 grid justify-items-center text-yellow-600'>
      <h1 className={` ${LibreBarcode.className} md:text-9xl text-6xl font-bold text-center`}>100 Registros</h1>

      {!showLogin ? (
        <button
          onClick={handleLoginClick}
          className="mt-56 md:mt-44 md:mb-44 mb-56 p-20 w-24 h-24 rounded-full shadow-md bg-[#25312e] flex items-center justify-center hover:bg-[#3c4f4a]"
        >
          LogIn
        </button>
      ) : (
        <Login/>
      )}
    </div>
  );
}

export default Inicio;