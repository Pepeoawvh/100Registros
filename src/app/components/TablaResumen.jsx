import React, { useState, useEffect, useRef } from "react";
import { useEntregas } from '../context/entregasProvider.js';
import { useAuth } from '../context/authProvider.js';
import DeleteButton from './DeleteButton.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TablaResumen = () => {
  const { data, selectedMonth, setSelectedMonth } = useEntregas();
  const { currentUser } = useAuth();
  const [sortConfig, setSortConfig] = useState({ key: 'Proveedor', direction: 'ascending' });
  const [expandedRows, setExpandedRows] = useState({});
  const [localData, setLocalData] = useState([]);
  const [dailySortConfig, setDailySortConfig] = useState({ key: 'Fecha', direction: 'ascending' });
  const tableRef = useRef();

  const coloresProveedores = {
    'cainiao 99': 'red',
    'nac.99': 'blue',
    'reco99': 'green',
    'tg': 'orange'
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
    if (curr.Proveedor) {
      const proveedorKey = curr.Proveedor.toLowerCase();
      if (!acc[proveedorKey]) {
        acc[proveedorKey] = { Cantidad: 0, Valor: 0 };
      }
      acc[proveedorKey].Cantidad += curr.Cantidad;
      acc[proveedorKey].Valor += curr.Cantidad * curr.Valor;
    }
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
    return total + resumen.Valor;
  }, 0);

  const resumenDiario = Object.entries(localData.reduce((acc, curr) => {
    const date = curr.Fecha.split("T")[0];
    if (curr.Proveedor) {
      const proveedorKey = curr.Proveedor.toLowerCase();
      const totalDiarioProveedor = curr.Cantidad * curr.Valor;
      if (!acc[date]) {
        acc[date] = { Cantidad: 0, TotalDiario: 0, Proveedores: {} };
      }
      acc[date].Cantidad += curr.Cantidad;
      acc[date].TotalDiario += totalDiarioProveedor;
      if (!acc[date].Proveedores[proveedorKey]) {
        acc[date].Proveedores[proveedorKey] = { Cantidad: 0, TotalDiario: 0 };
      }
      acc[date].Proveedores[proveedorKey].Cantidad += curr.Cantidad;
      acc[date].Proveedores[proveedorKey].TotalDiario += totalDiarioProveedor;
      acc[date].Proveedores[proveedorKey].id = curr.id;
    }
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

  const downloadPDF = () => {
    const input = tableRef.current;
    html2canvas(input, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("tabla_resumen.pdf");
    });
  };

  return (
    <div ref={tableRef} className="md:p-4 mx-8 md:mx-2">
      <h1 className="text-xl font-bold mb-4">Resumen</h1>
      <label className="block mb-4">
        Mes:
        <input 
          type="month" 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)} 
          className="ml-2  p-2 border rounded w-auto border-[#3d4f4a]" 
        />
      </label>
      <h2 className="text-xl font-bold mb-4">Resumen Diario</h2>
      <div ref={tableRef}>
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
              return (
                <tr className="text-center" key={proveedor}>
                  <td className="py-2 px-4 border-b">
                    <span style={{ backgroundColor: coloresProveedores[proveedor.toLowerCase()], borderRadius: '50%', display: 'inline-block', width: '10px', height: '10px', marginRight: '8px' }}></span>
                    {proveedor}
                  </td>
                  <td className="py-2 px-4 border-b">{resumen.Cantidad}</td>
                  <td className="py-2 px-4 border-b">{resumen.Valor}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="grid justify-items-start mt-4 pl-4 ">
          <h3 className="text-lg font-bold text-center mb-4  justify-self-center border-2 px-4 pb-2 pt-2  border-yellow-400 rounded-xl">TOTAL: {totalMensual}</h3>
          <h3 className="text-lg font-bold text-center mb-4">IVA: {totalMensual * 0.19}</h3>
          <h3 className="text-lg font-bold text-center">TOTAL CON IVA: {totalMensual * 1.19}</h3>
        </div>
      </div>
      <button 
        onClick={downloadPDF} 
        className="mt-4 border-2 border-[#3d4f4a] mb-12 text-white py-2 px-4 rounded"
      >
        Descargar PDF de estado actual
      </button>
    </div>
  );
};

export default TablaResumen;