import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import PaginaLista from './pages/PaginaLista'
import PaginaNovo from './pages/PaginaNovo'
import PaginaEditar from './pages/PaginaEditar'

/**
 * App — componente raiz da aplicação.
 *
 * Define o layout global (Navbar + conteúdo) e as rotas:
 *   /           → PaginaLista  (catálogo de jogos)
 *   /novo       → PaginaNovo   (formulário de criação)
 *   /editar/:id → PaginaEditar (formulário de edição)
 */
function App() {
  const location = useLocation()

  // Pega a mensagem de sucesso passada por navigate(..., { state: { sucesso: '...' } })
  const [mensagemSucesso, setMensagemSucesso] = useState(
    location.state?.sucesso || null
  )

  // Limpa a mensagem após 4 segundos
  useEffect(() => {
    if (mensagemSucesso) {
      const timer = setTimeout(() => setMensagemSucesso(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [mensagemSucesso])

  return (
    <>
      {/* Barra de navegação — aparece em todas as páginas */}
      <Navbar />

      {/* Conteúdo principal */}
      <main className="main-content">
        <div className="container">

          {/* Mensagem de sucesso global (ex: após criar ou editar) */}
          {mensagemSucesso && (
            <div className="alerta alerta-sucesso">{mensagemSucesso}</div>
          )}

          {/* Definição das rotas
              Route path="/"          → rota exata da lista
              Route path="/novo"      → formulário de criação
              Route path="/editar/:id"→ :id é um parâmetro dinâmico (ex: /editar/3)
          */}
          <Routes>
            <Route path="/"            element={<PaginaLista />} />
            <Route path="/novo"        element={<PaginaNovo />} />
            <Route path="/editar/:id"  element={<PaginaEditar />} />
          </Routes>

        </div>
      </main>
    </>
  )
}

export default App
