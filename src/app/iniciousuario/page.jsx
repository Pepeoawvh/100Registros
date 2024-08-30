'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/config.js';
import EntregaForm from '../components/EntregaForm';
import TablaResumen from '../components/TablaResumen';
import { LibreBarcode } from "../ui/fonts";

const InicioUsuario = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    console.log("useEffect: Se está verificando el estado de autenticación del usuario.");
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Usuario autenticado:", user.email);
        setUser(user);
      } else {
        console.log("No hay usuario autenticado, redirigiendo a /login.");
        router.push('/login'); // Redirige a la página de login si no hay usuario autenticado
      }
    });

    return () => {
      console.log("Limpiando el listener de autenticación.");
      unsubscribe();
    };
  }, [router]);

  const handleLogout = () => {
    console.log("Cerrando sesión del usuario.");
    auth.signOut().then(() => {
      console.log("Sesión cerrada, redirigiendo a Inicio.");
      router.push('/');
    }).catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
  };

  if (!user) {
    return <p>Cargando...</p>;
  }

  return (
    <div className=' text-yellow-500 grid md:grid-cols-3 auto-rows-min justify-center md:m-8 bg-[#111917] m-2 rounded-xl'>
      <div className="grid auto-rows-min gap-2 border-4 border-[#49655d] rounded-xl col-span-1 flex-col items-center justify-center p-12 mx-12 my-12 justify-items-center">
        <h1 className={` ${LibreBarcode.className} text-6xl font-bold text-center`}>100 Registros</h1>
        <h3 className="text-center font-bold mb-8">Bienvenido, {user.email}</h3>
        <EntregaForm />
      </div>
      <div className="grid md:col-span-2 text-center md:mt-12 mt-16">
        <TablaResumen />
      </div>
      <button onClick={handleLogout} className="mt-4 p-2 bg-red-500 text-white rounded">Cerrar sesión</button>
    </div>
  );
};

export default InicioUsuario;