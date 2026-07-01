import { Link, useNavigate } from 'react-router-dom'

/**
 * Navbar — barra de navegação que aparece em todas as páginas.
 *
 * Link        → navega para outra rota sem recarregar a página
 * useNavigate → permite navegar por código (ex: após um form submit)
 */
function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        {/* Logo / nome do site — clicando vai para a lista */}
        <Link to="/" className="navbar-brand">
          🎲 Catálogo de <span>Jogos</span>
        </Link>

        {/* Links do menu */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/novojogo" className="navbar-link">
            + Novo Jogo
          </Link>
          <Link to="/novacategoria" className="navbar-link">
            + Nova Categoria
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
