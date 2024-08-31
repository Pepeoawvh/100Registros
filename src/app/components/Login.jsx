'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mounted) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/iniciousuario'); // Redirige a la ruta /iniciousuario después del inicio de sesión exitoso
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid text-center border-yellow-600 text-yellow-600 h-full gap-4 border-2  m-4 p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="email" className="block font-bold mb-2">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-[#2c3a36] rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 "
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className=" block font-bold mb-2">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2  bg-[#2c3a36] rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button type="submit" className="w-full border-2 border-[#3c4f4a] py-2 px-4 rounded-md transition duration-300 hover:bg-[#3c4f4a]">Login</button>
    </form>
  );
};

export default Login;