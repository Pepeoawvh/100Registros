'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { firestoreDB } from '../../firebase/config'; // Asegúrate de que la ruta sea correcta
import { useAuth } from './authProvider'; // Asegúrate de que la ruta sea correcta

const EntregaContext = createContext();

export const useEntregas = () => {
  return useContext(EntregaContext);
};

export const EntregaProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const { currentUser } = useAuth();
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchUserData = async (userId) => {
    try {
      console.log("Fetching data for user:", userId);
      const snapshot = await firestoreDB.collection('entregas')
        .where('userId', '==', userId)
        .get();
      const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched data:", fetchedData);
      setData(fetchedData);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (currentUser && !dataLoaded) {
      fetchUserData(currentUser.uid);
    }
  }, [currentUser, dataLoaded]);

  return (
    <EntregaContext.Provider value={{ data, setData, selectedMonth, setSelectedMonth, fetchUserData }}>
      {children}
    </EntregaContext.Provider>
  );
};