// src/App.jsx — Application Router configuration
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LookupPage from './pages/LookupPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LookupPage />} />
      <Route path="/profile/:licenseNumber" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
