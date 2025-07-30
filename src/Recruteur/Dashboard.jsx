import React, { useState } from 'react';
import Template from '../Layouts/Template';
import OffreDetail from './OffreDetail';
import DataJson from '../offre.json'; // Assuming you have some data to work with

const Dashboard = () => {
  const [offre, setOffre] = useState(DataJson);

  const handleStatusChange = (candidatId, newStatus) => {
    setOffre(prevOffre => {
      const updatedCandidats = prevOffre.candidats.map(candidat => {
        if (candidat.id === candidatId) {
          return { ...candidat, status: newStatus };
        }
        return candidat;
      });
      return { ...prevOffre, candidats: updatedCandidats };
    });
  };


  return (
    <Template>
      <div className="container mx-auto py-6">
        <OffreDetail 
          offre={offre} 
          onStatusChange={handleStatusChange} 
        />
      </div>
    </Template>
  );
};

export default Dashboard;