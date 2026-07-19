import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";



// Pages
import Dashboard from "./pages/Dashboard/dashboard.jsx";


function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: "#363636", color: "#fff" },
          success: {
            duration: 3000,
            iconTheme: { primary: "#4ade80", secondary: "#fff" },
          },
          error: {
            duration: 4000,
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />

      
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard/>}/>
            
            

          
           
          </Routes>
        </BrowserRouter>
     
    </>
  );
}

export default App;
