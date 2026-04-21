import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import VerifyNews from './pages/VerifyNews';
import LiveAlerts from './pages/LiveAlerts';
import Emergency from './pages/Emergency';
import './i18n';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="verify" element={<VerifyNews />} />
        <Route path="alerts" element={<LiveAlerts />} />
        <Route path="emergency" element={<Emergency />} />
      </Route>
    </Routes>
  );
}

export default App;
