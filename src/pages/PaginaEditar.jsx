import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { buscarJogo, atualizarJogo } from '../services/api'
import { listarCategorias } from '../services/api'
import FormJogo from '../components/FormJogo'

/**
 * PaginaEditar — carrega um jogo pelo id e exibe o formulário preenchido.
 *
 * useParams  → hook que lê os parâmetros da URL
 *              Ex: na rota /editar/5, useParams retorna { id: "5" }
 * useNavigate → navega para outra página por código
 */
function PaginaEditar() {
  const { id }      = useParams()    // pega o id da URL
  const navigate    = useNavigate()

  const [jogo, setJogo]             = useState(null)  // dados do jogo a editar
  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(false) // spinner do botão salvar
  const [buscando, setBuscando]     = useState(true)  // spinner da carga inicial
  const [erro, setErro]             = useState(null)  // erro da API

  // --------------------------------------------------------
  // Ao montar o componente, busca os dados do jogo pelo id
  // --------------------------------------------------------
  useEffect(() => {
    async function carregarJogo() {
      try {
        setBuscando(true)
        const dados = await buscarJogo(id)
        setJogo(dados)
      } catch (e) {
        setErro('Não foi possível carregar os dados do jogo.')
      } finally {
        setBuscando(false)
      }
    }

    carregarJogo()
    listarCategorias().then(setCategorias)

  }, [id]) // executa novamente se o id mudar

  // --------------------------------------------------------
  // Chamada quando o FormJogo envia os dados atualizados
  // --------------------------------------------------------
  async function handleSubmit(dados) {
    try {
      setCarregando(true)
      setErro(null)

      await atualizarJogo(id, dados)

      navigate('/', { state: { sucesso: `"${dados.nome}" foi atualizado com sucesso!` } })

    } catch (e) {
      setErro(e.message)
      setCarregando(false)
    }
  }

  function handleCancelar() {
    navigate('/')
  }

  // --------------------------------------------------------
  // Renderização
  // --------------------------------------------------------

  // Enquanto busca os dados do jogo
  if (buscando) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Carregando dados do jogo...</p>
      </div>
    )
  }

  // Se o jogo não foi encontrado
  if (!jogo && !buscando) {
    return (
      <div>
        <div className="alerta alerta-erro">
          Jogo não encontrado.{' '}
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: 'inherit' }}
          >
            Voltar para a lista
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">Editar jogo</h1>

      {/* Passa os dados do jogo como valor inicial para o formulário */}
      <FormJogo
        jogoInicial={jogo}
        categorias={categorias}
        onSubmit={handleSubmit}
        onCancelar={handleCancelar}
        carregando={carregando}
        erro={erro}
      />
    </div>
  )
}

export default PaginaEditar
