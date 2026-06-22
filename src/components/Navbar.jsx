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

        {/* Link para cadastrar novo jogo */}
        <Link to="/novo" className="navbar-link">
          + Novo Jogo
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
