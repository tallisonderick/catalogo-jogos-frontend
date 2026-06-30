import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listarJogos, excluirJogo } from '../services/api'
import ModalConfirmacao from '../components/ModalConfirmacao'

/**
 * PaginaLista — exibe todos os jogos cadastrados em cards.
 *
 * Conceitos React usados aqui:
 *   useState  → guarda dados que mudam (lista de jogos, loading, erros...)
 *   useEffect → executa código quando o componente é montado (busca os jogos)
 */
function PaginaLista() {

  // --------------------------------------------------------
  // Estados do componente
  // --------------------------------------------------------
  const [jogos, setJogos]               = useState([])       // lista de jogos
  const [carregando, setCarregando]     = useState(true)     // exibe o spinner inicial
  const [erro, setErro]                 = useState(null)     // mensagem de erro da API
  const [sucesso, setSucesso]           = useState(null)     // mensagem de sucesso
  const [excluindo, setExcluindo]       = useState(false)    // spinner do botão excluir
  const [modal, setModal]               = useState({         // estado do modal de confirmação
    visivel: false,
    jogoId: null,
    jogoNome: '',
  })

  // --------------------------------------------------------
  // Busca os jogos quando a página carrega
  // O array [] no segundo argumento significa: execute só uma vez
  // --------------------------------------------------------
  useEffect(() => {
    carregarJogos()
  }, [])

  async function carregarJogos() {
    try {
      setCarregando(true)
      setErro(null)
      const dados = await listarJogos()
      setJogos(dados)
    } catch (e) {
      setErro('Não foi possível carregar os jogos. Verifique se o backend está rodando.')
    } finally {
      // finally sempre executa, mesmo se der erro
      setCarregando(false)
    }
  }

  // --------------------------------------------------------
  // Abre o modal pedindo confirmação antes de excluir
  // --------------------------------------------------------
  function abrirModalExclusao(jogo) {
    setModal({ visivel: true, jogoId: jogo.id, jogoNome: jogo.nome })
  }

  function fecharModal() {
    setModal({ visivel: false, jogoId: null, jogoNome: '' })
  }

  // --------------------------------------------------------
  // Confirma e executa a exclusão
  // --------------------------------------------------------
  async function confirmarExclusao() {
    try {
      setExcluindo(true)
      await excluirJogo(modal.jogoId)

      // Remove o jogo da lista local sem precisar buscar da API de novo
      setJogos(prev => prev.filter(j => j.id !== modal.jogoId))

      setSucesso(`"${modal.jogoNome}" foi excluído com sucesso.`)
      setTimeout(() => setSucesso(null), 4000) // some depois de 4 segundos
      fecharModal()
    } catch (e) {
      setErro(e.message)
      fecharModal()
    } finally {
      setExcluindo(false)
    }
  }

  // --------------------------------------------------------
  // Renderização
  // --------------------------------------------------------

  // Enquanto carrega, exibe o spinner
  if (carregando) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Carregando jogos...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Título e botão de novo jogo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>
          Catálogo de Jogos
        </h1>
        <Link to="/novo" className="btn btn-primary">
          + Novo jogo
        </Link>
      </div>

      {/* Mensagem de sucesso (aparece após excluir) */}
      {sucesso && <div className="alerta alerta-sucesso">{sucesso}</div>}

      {/* Mensagem de erro */}
      {erro && (
        <div className="alerta alerta-erro">
          {erro}{' '}
          <button
            onClick={carregarJogos}
            style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: 'inherit' }}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Lista vazia */}
      {jogos.length === 0 && !erro && (
        <div className="estado-vazio">
          <p>Nenhum jogo cadastrado ainda.</p>
          <Link to="/novo" className="btn btn-primary">
            Cadastrar o primeiro jogo
          </Link>
        </div>
      )}

      {/* Grid de cards */}
      {jogos.length > 0 && (
        <div className="jogos-grid">
          {jogos.map(jogo => (
            <div key={jogo.id} className="jogo-card">

              {/* Categoria */}
              <span className="jogo-card-categoria">{jogo.categoria?.nome}</span>

              {/* Nome */}
              <h2 className="jogo-card-nome">{jogo.nome}</h2>

              {/* Número de jogadores e ano */}
              <p className="jogo-card-info">
                👥 {jogo.minJogadores === jogo.maxJogadores
                  ? `${jogo.minJogadores} jogadores`
                  : `${jogo.minJogadores}–${jogo.maxJogadores} jogadores`
                }
                {jogo.anoLancamento && ` · 📅 ${jogo.anoLancamento}`}
              </p>

              {/* Descrição (se houver) */}
              {jogo.descricao && (
                <p className="jogo-card-descricao">{jogo.descricao}</p>
              )}

              {/* Botões de editar e excluir */}
              <div className="jogo-card-acoes">
                <Link to={`/editar/${jogo.id}`} className="btn btn-secondary btn-sm">
                  ✏️ Editar
                </Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => abrirModalExclusao(jogo)}
                >
                  🗑️ Excluir
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      <ModalConfirmacao
        visivel={modal.visivel}
        titulo="Excluir jogo"
        mensagem={`Tem certeza que deseja excluir "${modal.jogoNome}"? Esta ação não pode ser desfeita.`}
        onConfirmar={confirmarExclusao}
        onCancelar={fecharModal}
        carregando={excluindo}
      />
    </div>
  )
}

export default PaginaLista
