import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import {ToastContainer} from 'react-toastify'
import ErrorBoundary from './components/ErrorBoundary.jsx';
createRoot(document.getElementById('root')).render(
    <React.StrictMode>
    <ErrorBoundary>
    <div className='container'>
        <App />
        <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
      />
    </div>
    </ErrorBoundary>
    </React.StrictMode>
)
