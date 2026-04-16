import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'
// Change 'SupportContextProvider' to 'SupportProvider'
import { SupportProvider } from './context/SupportContext.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <SupportProvider> {/* <--- Wrap App in SupportContext */}
        <App />
      </SupportProvider>
    </AppContextProvider>
  </BrowserRouter>,
)