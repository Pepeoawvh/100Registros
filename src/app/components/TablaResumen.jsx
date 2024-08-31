import React, { useState, useEffect } from "react";
import { useEntregas } from '../context/entregasProvider.js';
import { useAuth } from '../context/authProvider.js';
import DeleteButton from './DeleteButton.js';

const TablaResumen = () => {
  const { data, selectedMonth, setSelectedMonth } = useEntregas();
  const { currentUser } = useAuth();
  const [sortConfig, setSortConfig] = useState({ key: 'Proveedor', direction: 'ascending' });
  const [expandedRows, setExpandedRows] = useState({});
  const [localData, setLocalData] = useState([]);
  const [dailySortConfig, setDailySortConfig] = useState({ key: 'Fecha', direction: 'ascending' });

  const valoresFijos = {
    cainiao: 800,
    nacional: 900,
    pyme: 1500,
    retiro: 800
  };

  const coloresProveedores = {
    cainiao: 'red',
    nacional: 'blue',
    pyme: 'green',
    retiro: 'orange'
  };

  useEffect(() => {
    if (selectedMonth) {
      const filteredData = data.filter(item => {
        const itemMonth = new Date(item.Fecha).toISOString().slice(0, 7);
        return itemMonth === selectedMonth;
      });
      setLocalData(filteredData);
    } else {
      setLocalData(data);
    }
  }, [data, selectedMonth]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleDailySort = (key) => {
    let direction = 'ascending';
    if (dailySortConfig.key === key && dailySortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setDailySortConfig({ key, direction });
  };

  const sortedData = Object.entries(localData.reduce((acc, curr) => {
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

  const resumenDiario = Object.entries(localData.reduce((acc, curr) => {
    const date = curr.Fecha.split("T")[0];
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
    acc[date].Proveedores[curr.Proveedor].id = curr.id;
    return acc;
  }, {})).sort((a, b) => {
    if (a[1][dailySortConfig.key] < b[1][dailySortConfig.key]) {
      return dailySortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[1][dailySortConfig.key] > b[1][dailySortConfig.key]) {
      return dailySortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const toggleRow = (id) => {
    setExpandedRows(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const formatDate = (dateString) => {
    return dateString.split("T")[0];
  };

  return (
    <div className="md:p-4 mx-8 md:mx-2">
      <h1 className="text-xl font-bold mb-4">Resumen del Mes</h1>
      <label className="block mb-4">
        Mes:
        <input 
          type="month" 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)} 
          className="ml-2 bg-[#111917] p-2 border rounded w-auto" 
        />
      </label>
      <h2 className="text-xl font-bold mb-4">Resumen Diario</h2>
      <table className="min-w-full bg-lime-950 rounded-xl">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleDailySort('Fecha')}>Fecha</th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleDailySort('Cantidad')}>Cantidad</th>
            <th className="py-2 px-4 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {resumenDiario.map(([date, resumen]) => (
            <React.Fragment key={date}>
              <tr className="text-center cursor-pointer" onClick={() => toggleRow(date)}>
                <td className="py-2 px-4 border-b">{formatDate(date)}</td>
                <td className="py-2 px-4 border-b">{resumen.Cantidad}</td>
                <td className="py-2 px-4 border-b"></td>
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
                          <th className="py-2 px-4 border-b"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {resumen.Proveedores && Object.entries(resumen.Proveedores).map(([proveedor, detalle]) => (
                          <tr className="text-center" key={detalle.id}>
                            <td className="py-2 px-4 border-b">{proveedor}</td>
                            <td className="py-2 px-4 border-b">{detalle.Cantidad}</td>
                            <td className="py-2 px-4 border-b">{detalle.TotalDiario}</td>
                            <td className="py-2 px-4 border-b">
                              <DeleteButton 
                                id={detalle.id} 
                                setLocalData={setLocalData} 
                                currentUser={currentUser} 
                              />
                            </td>
                          </tr>
                        ))}
                        <tr className="text-center font-bold">
                          <td className="py-2 px-4 border-b">Total Diario</td>
                          <td className="py-2 px-4 border-b">{resumen.Cantidad}</td>
                          <td className="py-2 px-4 border-b">{resumen.TotalDiario}</td>
                          <td className="py-2 px-4 border-b"></td>
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