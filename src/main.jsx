import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

/**
 * Este é o ponto de entrada da aplicação React.
 *
 * ReactDOM.createRoot → monta o React dentro da <div id="root"> do index.html
 * BrowserRouter       → habilita a navegação por rotas (URLs) sem recarregar a página
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
