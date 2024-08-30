'use client'
import React, { useState, useEffect } from "react";
import { firestoreDB } from "../firebase/config.js";

const TablaResumen = () => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [sortConfig, setSortConfig] = useState({ key: 'Proveedor', direction: 'ascending' });
  const [expandedRows, setExpandedRows] = useState({});

  const valoresFijos = {
    cainiao: 800,
    nacional: 900,
    PYME: 1500,
    retiro: 800
  };

  const coloresProveedores = {
    cainiao: 'red',
    nacional: 'blue',
    PYME: 'green',
    retiro: 'orange'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await firestoreDB.collection("entregas")
          .where("Fecha", ">=", `${selectedMonth}-01`)
          .where("Fecha", "<", `${selectedMonth}-31`)
          .get();
        const fetchedData = snapshot.docs.map(doc => doc.data());
        console.log("Datos obtenidos del servidor:", fetchedData);
        setData(fetchedData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, [selectedMonth]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleRowClick = (date) => {
    setExpandedRows(prevState => ({
      ...prevState,
      [date]: !prevState[date]
    }));
  };

  const handleDelete = (date) => {
    setData(prevData => prevData.filter(item => item.Fecha.split("T")[0] !== date));
  };

  const sortedData = Object.entries(data.reduce((acc, curr) => {
    if (!acc[curr.Proveedor]) {
      acc[curr.Proveedor] = { Cantidad: 0, Valor: valoresFijos[curr.Proveedor.toLowerCase()] || 0 };
    }
    acc[curr.Proveedor].Cantidad += curr.Cantidad;
    return acc;
  }, {})).sort((a, b) => {
    if (a[1][sortConfig.key] < b[1][sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[1][sortConfig.key] > b[1][sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const totalMensual = sortedData.reduce((total, [proveedor, resumen]) => {
    return total + (resumen.Cantidad * (valoresFijos[proveedor.toLowerCase()] || 0));
  }, 0);

  const resumenDiario = Object.entries(data.reduce((acc, curr) => {
    const date = new Date(curr.Fecha).toLocaleDateString(); // Formatear la fecha
    const totalDiarioProveedor = curr.Cantidad * (valoresFijos[curr.Proveedor.toLowerCase()] || 0);
    if (!acc[date]) {
      acc[date] = { Cantidad: 0, TotalDiario: 0, Proveedores: {} };
    }
    acc[date].Cantidad += curr.Cantidad;
    acc[date].TotalDiario += totalDiarioProveedor;
    if (!acc[date].Proveedores[curr.Proveedor]) {
      acc[date].Proveedores[curr.Proveedor] = { Cantidad: 0, TotalDiario: 0 };
    }
    acc[date].Proveedores[curr.Proveedor].Cantidad += curr.Cantidad;
    acc[date].Proveedores[curr.Proveedor].TotalDiario += totalDiarioProveedor;
    return acc;
  }, {}));

  console.log("Resumen Diario:", resumenDiario);

  return (
    <div className="md:p-4 mx-12 md:mx-2">
      <label className="block mb-4">
        Seleccionar mes:
        <input 
          type="month" 
          value={selectedMonth} 
          onChange={handleMonthChange} 
          className="ml-2 bg-[#111917] p-2 border rounded" 
        />
      </label>
      <h2 className="text-xl font-bold mb-4">Resumen Diario</h2>
      <table className="min-w-full bg-lime-950 rounded-xl">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Fecha</th>
            <th className="py-2 px-4 border-b">Cantidad</th>
            <th className="py-2 px-4 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(resumenDiario).map(([date, resumen]) => (
            <React.Fragment key={date}>
              <tr className="text-center cursor-pointer" onClick={() => handleRowClick(date)}>
                <td className="py-2 px-4 border-b">{date}</td>
                <td className="py-2 px-4 border-b">{resumen.Cantidad}</td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => handleDelete(date)} className="">❌</button>
                </td>
              </tr>
              {expandedRows[date] && (
                <tr>
                  <td colSpan="3">
                    <table className="min-w-full bg-lime-900 mt-2">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b">Proveedor</th>
                          <th className="py-2 px-4 border-b">Cantidad</th>
                          <th className="py-2 px-4 border-b">Total Diario</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resumen.Proveedores && Object.entries(resumen.Proveedores).map(([proveedor, detalle]) => (
                          <tr className="text-center" key={proveedor}>
                            <td className="py-2 px-4 border-b">{proveedor}</td>
                            <td className="py-2 px-4 border-b">{detalle.Cantidad}</td>
                            <td className="py-2 px-4 border-b">{detalle.Cantidad * (valoresFijos[proveedor.toLowerCase()] || 0)}</td>
                          </tr>
                        ))}
                        <tr className="text-center font-bold">
                          <td className="py-2 px-4 border-b">Total Diario</td>
                          <td className="py-2 px-4 border-b">{resumen.Cantidad}</td>
                          <td className="py-2 px-4 border-b">{resumen.TotalDiario}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <h2 className="text-xl font-bold mt-8 mb-4">Resumen Mensual</h2>
      <table className="min-w-full bg-lime-950 rounded-xl">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('Proveedor')}>Proveedor</th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('Cantidad')}>Cantidad Total</th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('Valor')}>Valor Total Tipo</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map(([proveedor, resumen]) => {
            const valorTotal = resumen.Cantidad * (valoresFijos[proveedor.toLowerCase()] || 0);
            console.log(`Proveedor: ${proveedor}, Cantidad: ${resumen.Cantidad}, Valor: ${valoresFijos[proveedor.toLowerCase()]}, Valor Total: ${valorTotal}`);
            return (
              <tr className="text-center" key={proveedor}>
                <td className="py-2 px-4 border-b">
                  <span style={{ backgroundColor: coloresProveedores[proveedor.toLowerCase()], borderRadius: '50%', display: 'inline-block', width: '10px', height: '10px', marginRight: '8px' }}></span>
                  {proveedor}
                </td>
                <td className="py-2 px-4 border-b">{resumen.Cantidad}</td>
                <td className="py-2 px-4 border-b">{valorTotal}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4 text-right">
        <h3 className="text-lg font-bold text-center mb-4">TOTAL MENSUAL: {totalMensual}</h3>
      </div>
    </div>
  );
};

export default TablaResumen;