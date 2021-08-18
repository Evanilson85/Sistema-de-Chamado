import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './contexts/auth'
import Routes from './routers'
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer autoClose={3000}/>
        <Routes/>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
