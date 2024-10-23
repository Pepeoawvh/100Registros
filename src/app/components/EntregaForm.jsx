'use client';
import React, { useState } from 'react';
import { firestoreDB } from '../firebase/config.js';
import { useAuth } from '../context/authProvider.js';
import { useEntregas } from '../context/entregasProvider.js';

const EntregaForm = () => {
  const [fecha, setFecha] = useState('');
  const [proveedores, setProveedores] = useState([]);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const { fetchUserData } = useEntregas();

  const toggleProveedor = (proveedor) => {
    setProveedores((prev) => {
      const index = prev.findIndex((p) => p.proveedor === proveedor);
      if (index !== -1) {
        return prev.filter((p) => p.proveedor !== proveedor);
      } else {
        return [...prev, { proveedor, cantidad: '', valor: '' }];
      }
    });
  };

  const handleProveedorChange = (index, name, value) => {
    const nuevosProveedores = [...proveedores];
    nuevosProveedores[index][name] = value;
    setProveedores(nuevosProveedores);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fecha || proveedores.length === 0) {
      setError('La fecha y al menos un proveedor son obligatorios');
      return;
    }

    try {
      for (const { proveedor, cantidad, valor } of proveedores) {
        const formattedData = {
          Fecha: new Date(fecha).toISOString(),
          Proveedor: proveedor,
          Cantidad: parseInt(cantidad, 10),
          Valor: parseInt(valor, 10),
          userId: currentUser.uid,
        };
        await firestoreDB.collection('entregas').add(formattedData);
      }
      alert("Datos enviados exitosamente");
      fetchUserData(currentUser.uid);
      setFecha('');
      setProveedores([]);
      setError(null);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setError('Error al guardar la entrega: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid">
      <label htmlFor="fecha" className="grid gap-3 justify-items-center">Fecha:</label>
      <input
        type="date"
        id="fecha"
        name="Fecha"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className="bg-[#25312e] w-fit justify-self-center my-2 text-center rounded-xl focus:ring-1 focus:ring-[#4b655d] focus:outline-none"
      />

      <div className="grid gap-3 justify-items-center">
        <label className='grid border-t-2 border-[#4b655d] mt-2 pt-2 '>Entregas de hoy</label>
        <div className="grid grid-cols-4 gap-4 ">
          {['Cainiao 99', 'Nac.99', 'Reco99', 'TG', 'Essika'].map((prov) => {
            const isSelected = proveedores.some((p) => p.proveedor === prov);
            return (
              <button
                type="button"
                key={prov}
                onClick={() => toggleProveedor(prov)}
                className={`bg-[#25312e] text-xs w-14 h-14 text-white text-center rounded-full mb-6 ${isSelected ? 'bg-[#4b655d]' : ''}`}
              >
                {prov}
              </button>
            );
          })}
        </div>
      </div>

      {proveedores.map((prov, index) => (
        <div key={index} className="grid gap-4 justify-items-center border-2 border-[#4b655d] rounded-md p-4">
          <h3>{prov.proveedor}</h3>
          <div className='grid grid-cols-2 items-center gap-4 '>
            <label htmlFor={`cantidad-${index}`}>Cantidad:</label>
            <input
              type="number"
              id={`cantidad-${index}`}
              name="cantidad"
              min= "0"
              value={prov.cantidad}
              onChange={(e) => handleProveedorChange(index, 'cantidad', e.target.value)}
              className="bg-[#25312e] text-center rounded-full h-14 w-14 focus:ring-2 focus:ring-[#4b655d] focus:outline-none"
            />
          </div>
          <div className='grid grid-cols-2 text-center'>
            <label htmlFor={`valor-${index}`}>Valor:</label>
            <input
              type="number"
              id={`valor-${index}`}
              name="valor"
              value={prov.valor}
              onChange={(e) => handleProveedorChange(index, 'valor', e.target.value)}
              className="bg-[#25312e] text-center rounded-xl focus:ring-2 focus:ring-[#4b655d] focus:outline-none"
            />
          </div>
        </div>
      ))}

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {proveedores.length > 0 && (
        <button type="submit" className="w-full border-2 border-[#3c4f4a] py-2 px-4 rounded-md transition duration-300 hover:bg-[#3c4f4a] mt-6">
          Registrar
        </button>
      )}
    </form>
  );
};

export default EntregaForm;