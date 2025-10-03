import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import RegistorPage from "./pages/RegistorPage"
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/register" element={<RegistorPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
