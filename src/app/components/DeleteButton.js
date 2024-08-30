import React from 'react';
import { firestoreDB } from "../firebase/config.js";

const DeleteButton = ({ id, setLocalData, fetchUserData, currentUser }) => {
  const handleDelete = async (e) => {
    e.stopPropagation();
    console.log("Delete button clicked for id:", id); // Log para verificar el clic del botón
    try {
      await firestoreDB.collection('entregas').doc(id).delete();
      console.log("Document deleted:", id); // Log para verificar que el documento se eliminó
      setLocalData(prevData => prevData.filter(item => item.id !== id));
      fetchUserData(currentUser.uid); // Refresca los datos después de eliminar
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
    }
  };

  return (
    <button onClick={handleDelete} className="">❌</button>
  );
};

export default DeleteButton;