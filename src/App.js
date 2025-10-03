import React from 'react'
import RegistorPage from "./pages/RegistorPage"
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'



function App() {
  return (
    <div>
      <BrowserRouter>

      <Routes>
        
        <Route path="/register" element={ <RegistorPage /> } />
        <Route path="/login" element={ <Login/> } />
         <Route path="/dashboard" element={<Dashboard />} />
        
         
        

        

      </Routes>

      </ BrowserRouter>


      
        
    </div>
  )
}

export default App
