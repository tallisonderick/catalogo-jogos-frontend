import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { criarJogo } from '../services/api'
import { listarCategorias } from '../services/api'
import FormJogo from '../components/FormJogo'

/**
 * PaginaNovo — formulário para cadastrar um novo jogo.
 *
 * useNavigate → hook do React Router para navegar entre páginas por código
 */
function PaginaNovo() {
  const navigate = useNavigate()

  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(false) // true enquanto salva
  const [erro, setErro]             = useState(null)  // mensagem de erro da API

  useEffect(() => { 
    listarCategorias().then(setCategorias)
  }, [])

  // --------------------------------------------------------
  // Chamada quando o FormJogo envia os dados
  // --------------------------------------------------------
  async function handleSubmit(dados) {
    try {
      setCarregando(true)
      setErro(null)

      await criarJogo(dados)

      // Após criar com sucesso, volta para a lista
      // O segundo argumento passa um "estado" para a próxima página
      navigate('/', { state: { sucesso: `"${dados.nome}" foi cadastrado com sucesso!` } })

    } catch (e) {
      setErro(e.message)
      setCarregando(false)
    }
  }

  // --------------------------------------------------------
  // Chamada quando o usuário clica em Cancelar
  // --------------------------------------------------------
  function handleCancelar() {
    navigate('/')
  }

  return (
    <div>
      <h1 className="page-title">Novo jogo</h1>

      <FormJogo
        categorias={categorias}
        onSubmit={handleSubmit}
        onCancelar={handleCancelar}
        carregando={carregando}
        erro={erro}
      />
    </div>
  )
}

export default PaginaNovo
