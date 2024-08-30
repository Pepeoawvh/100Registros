'use client';
import React, { useState } from 'react';
import { firestoreDB } from '../firebase/config.js';
import { useAuth } from './context/authProvider.js';
import { useEntregas } from './context/entregasProvider.js'; // Asegúrate de que la ruta sea correcta

const EntregaForm = () => {
  const [formData, setFormData] = useState({
    Fecha: '',
    Proveedor: '',
    Cantidad: '',
    Valor: '',
  });
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const { setData, fetchUserData } = useEntregas();

  const valoresProveedores = {
    Cainiao: 800,
    Nacional: 900,
    Pyme: 1500,
    Retiro: 800,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      if (name === 'Proveedor') {
        newData.Valor = valoresProveedores[value] || '';
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Fecha || !formData.Proveedor || !formData.Cantidad) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const formattedData = {
      ...formData,
      Cantidad: parseInt(formData.Cantidad, 10),
      Valor: parseInt(formData.Valor, 10),
      Fecha: new Date(formData.Fecha).toISOString(),
      userId: currentUser.uid,
    };

    console.log("Datos del formulario antes de enviar:", formattedData);

    try {
      await firestoreDB.collection('entregas').add(formattedData);
      console.log("Datos enviados exitosamente:", formattedData);
      alert("Datos enviados exitosamente");

      // Fetch updated data using the context method
      fetchUserData(currentUser.uid);

      setFormData({
        Fecha: '',
        Proveedor: '',
        Cantidad: '',
        Valor: '',
      });
      setError(null);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setError('Error al guardar la entrega: ' + error.message);
    }
  };

  const total = formData.Cantidad * formData.Valor;

  return (
    <form onSubmit={handleSubmit} className="grid text-center h-full gap-4 ">
      <label htmlFor="fecha" className="grid gap-3 justify-items-center">Fecha:</label>
      <input
        type="date"
        id="fecha"
        name="Fecha"
        value={formData.Fecha}
        onChange={handleChange}
        className="bg-[#25312e] text-center rounded-xl focus:ring-1 focus:ring-[#4b655d] focus:outline-none"
      />

      <label htmlFor="proveedor">Proveedor:</label>
      <select
        id="proveedor"
        name="Proveedor"
        value={formData.Proveedor}
        onChange={handleChange}
        className="bg-[#25312e] text-center rounded-xl focus:ring-2 focus:ring-[#4b655d] focus:outline-none"
        required
      >
        <option value="">Seleccione un proveedor</option>
        <option value="Cainiao">Cainiao</option>
        <option value="Nacional">Nacional</option>
        <option value="Pyme">Pyme</option>
        <option value="Retiro">Retiro</option>
      </select>

      <label htmlFor="cantidad">Cantidad:</label>
      <input
        type="number"
        id="cantidad"
        name="Cantidad"
        value={formData.Cantidad}
        onChange={handleChange}
        className="bg-[#25312e] text-center rounded-xl focus:ring-2 focus:ring-[#4b655d] focus:outline-none"
      />

      <label>Total:</label>
      <span>{total}</span>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button type="submit" className="w-full border-2 border-[#3c4f4a] py-2 px-4 rounded-md transition duration-300 hover:bg-[#3c4f4a]">Registrar</button>
    </form>
  );
};

export default EntregaForm;