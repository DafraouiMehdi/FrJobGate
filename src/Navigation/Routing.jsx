import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';  
import Dashboard from '../Recruteur/Dashboard';
import CandidatDashboard from '../Candidat/CandidatDashboard';
import NotFound from '../Notfound/NotFound';

const Routing = () => {
  return (
    <Routes>
      <Route path="/recruteur/dashboard" element={<Dashboard />} />
      <Route path="/candidat/dashboard" element={<CandidatDashboard/>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}


export default Routing;