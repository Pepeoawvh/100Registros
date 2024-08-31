import React from 'react';
import { firestoreDB } from "../firebase/config.js";

const DeleteButton = ({ id, setLocalData, fetchUserData, currentUser }) => {
  const handleDelete = async (e) => {
    e.stopPropagation();
    console.log("Delete button clicked for id:", id); // Log para verificar el clic del botón
    try {
      const docRef = firestoreDB.collection('entregas').doc(id);
      const doc = await docRef.get();
      if (doc.exists) {
        console.log("Document exists:", doc.data()); // Log para verificar que el documento existe
        await docRef.delete();
        console.log("Document deleted:", id); // Log para verificar que el documento se eliminó
        setLocalData(prevData => prevData.filter(item => item.id !== id));
        fetchUserData(currentUser.uid); // Refresca los datos después de eliminar
      } else {
        console.log("No such document!"); // Log para verificar que el documento no existe
      }
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
    }
  };

  return (
    <button onClick={handleDelete} className="">❌</button>
  );
};

export default DeleteButton;