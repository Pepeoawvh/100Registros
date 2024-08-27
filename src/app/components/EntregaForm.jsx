"use client";
import React, { useState } from "react";
import { firestoreDB } from "../firebase/config.js";

const EntregaForm = () => {
  const [formData, setFormData] = useState({
    Fecha: "",
    Proveedor: "",
    Cantidad: "",
    Valor: "",
  });

  const valoresProveedores = {
    Cainiao: 800,
    Nacional: 900,
    Pyme: 1500,
    Retiro: 800,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo cambiado: ${name}, Valor: ${value}`);
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      if (name === "Proveedor") {
        newData.Valor = valoresProveedores[value] || "";
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el reinicio del formulario
    const formattedData = {
      ...formData,
      Cantidad: parseInt(formData.Cantidad, 10),
      Valor: parseInt(formData.Valor, 10),
      Fecha: new Date(formData.Fecha).toISOString(),
    };
    console.log("Datos del formulario antes de enviar:", formattedData);
    try {
      // Lógica para enviar los datos a Firestore
      await firestoreDB.collection("entregas").add(formattedData);
      console.log("Datos enviados exitosamente");
      alert("Datos enviados exitosamente");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      console.error("Detalles del error:", error.response ? error.response.data : error.message);
    }
  };

  const total = formData.Cantidad * formData.Valor;

  return (
    <form className="grid text-center h-full gap-4 text-green-800" onSubmit={handleSubmit}>
      <label className="grid gap-3 justify-items-center">
        <label>Fecha:</label>
        <input
          type="date"
          name="Fecha"
          value={formData.Fecha}
          onChange={handleChange}
          className="text-center rounded-xl w-full"
        />
      </label>
      <label>Proveedor:</label>
      <select
        name="Proveedor"
        value={formData.Proveedor}
        onChange={handleChange}
        className="text-center rounded-xl"
        required
      >
        <option value="">Seleccione un proveedor</option>
        <option value="Cainiao">Cainiao</option>
        <option value="Nacional">Nacional</option>
        <option value="Pyme">Pyme</option>
        <option value="Retiro">Retiro</option>
      </select>
      <label className="grid gap-4">
      <label>Cantidad:</label>
        <input
          type="number"
          name="Cantidad"
          value={formData.Cantidad}
          onChange={handleChange}
          className="text-center rounded-xl"
        />
      </label>
      <label>
        Total:
        <span>{total}</span>
      </label>
      <button className="bg-[#1b2e09] rounded-xl py-1 text-white" type="submit">Enviar</button>
    </form>
  );
};

export default EntregaForm;