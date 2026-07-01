import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listarJogos, excluirJogo, buscarPorCategoria as apiBuscarPorCategoria, listarCategorias, atualizarStatusTenho, atualizarStatusQuero } from '../services/api'
import ModalConfirmacao from '../components/ModalConfirmacao'

/**
 * PaginaLista — exibe todos os jogos cadastrados em cards.
 *
 * Conceitos React usados aqui:
 *   useState  → guarda dados que mudam (lista de jogos, loading, erros...)
 *   useEffect → executa código quando o componente é montado (busca os jogos)
 */
function PaginaListaDesejos() {

  // --------------------------------------------------------
  // Estados do componente
  // --------------------------------------------------------
  const [jogos, setJogos] = useState([])       // lista de jogos
  const [carregando, setCarregando] = useState(true)     // exibe o spinner inicial
  const [erro, setErro] = useState(null)     // mensagem de erro da API
  const [sucesso, setSucesso] = useState(null)     // mensagem de sucesso
  const [excluindo, setExcluindo] = useState(false)    // spinner do botão excluir
  const [modal, setModal] = useState({         // estado do modal de confirmação
    visivel: false,
    jogoId: null,
    jogoNome: '',
  })
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroNome, setFiltroNome] = useState('')
  const [estaBuscando, setEstaBuscando] = useState(false)
  const [categorias, setCategorias] = useState([])
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(15)
  const [ordenacao, setOrdenacao] = useState('')

  // --------------------------------------------------------
  // Busca os jogos quando a página carrega
  // O array [] no segundo argumento significa: execute só uma vez
  // --------------------------------------------------------
  useEffect(() => {
    carregarJogos()
    carregarCategorias()
  }, [])

  async function carregarCategorias() {
    try {
      const dados = await listarCategorias()
      setCategorias(dados || [])
    } catch (e) {
      console.error('Erro ao carregar categorias', e)
    }
  }

  async function carregarJogos() {
    try {
      setCarregando(true)
      setErro(null)
      const dados = await listarJogos()

      let jogosFiltrados = dados || []
      jogosFiltrados = jogosFiltrados.filter(jogo => jogo.quero === true)
      setJogos(jogosFiltrados)
      setPaginaAtual(1)
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

  async function realizarBusca() {
    try {
      setEstaBuscando(true)
      setErro(null)

      let dados = []
      if (filtroCategoria) {
        dados = await apiBuscarPorCategoria(filtroCategoria)
      } else {
        dados = await listarJogos()
      }

      dados = dados || []
      dados = dados.filter(jogo => jogo.quero === true)

      if (filtroNome) {
        const termo = filtroNome.toLowerCase()
        dados = dados.filter(jogo => jogo.nome.toLowerCase().includes(termo))
      }


      setJogos(dados)
      setPaginaAtual(1)
    } catch (e) {
      setErro(e.message)
    } finally {
      setEstaBuscando(false)
    }
  }

  function redefinirFiltros() {
    setFiltroNome('')
    setFiltroCategoria('')
  }

  async function handleCheckbox(jogoId, tipo, checked) {
    const statusNumber = checked ? 1 : 0

    // Atualiza o estado local imediatamente
    setJogos(prev => prev.map(j => {
      if (j.id === jogoId) {
        return { ...j, [tipo]: checked }
      }
      return j
    }))

    try {
      if (tipo === 'tenho') {
        await atualizarStatusTenho(jogoId, statusNumber)
      } else {
        await atualizarStatusQuero(jogoId, statusNumber)
      }
    } catch (e) {
      console.error('Erro ao atualizar status', e)
    }
  }

  // --------------------------------------------------------
  // Paginação
  // --------------------------------------------------------
  const totalPaginas = Math.ceil(jogos.length / itensPorPagina)
  const startIndex = (paginaAtual - 1) * itensPorPagina

  const jogosOrdenados = [...jogos].sort((a, b) => {
    if (ordenacao === 'anoAsc') {
      return (a.anoLancamento || 0) - (b.anoLancamento || 0)
    }
    if (ordenacao === 'anoDesc') {
      return (b.anoLancamento || 0) - (a.anoLancamento || 0)
    }
    if (ordenacao === 'categoria') {
      return (a.categoria?.nome || '').localeCompare(b.categoria?.nome || '')
    }
    if (ordenacao === 'nome') {
      return (a.nome || '').localeCompare(b.nome || '')
    }
    return 0
  })

  const jogosExibidos = jogosOrdenados.slice(startIndex, startIndex + itensPorPagina)

  function irParaPagina(novaPagina) {
    setPaginaAtual(novaPagina)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderControlesPaginacao = (semMargem = false) => {
    if (totalPaginas <= 1) return null

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: semMargem ? 0 : '2rem', marginBottom: semMargem ? 0 : '2rem' }}>
        <button
          className="btn btn-secondary"
          disabled={paginaAtual === 1}
          onClick={() => irParaPagina(paginaAtual - 1)}
        >
          Anterior
        </button>
        <span style={{ fontWeight: 'bold' }}>Página {paginaAtual} de {totalPaginas}</span>
        <button
          className="btn btn-secondary"
          disabled={paginaAtual === totalPaginas}
          onClick={() => irParaPagina(paginaAtual + 1)}
        >
          Próxima
        </button>
      </div>
    )
  }

  const categoriaSelecionadaObj = categorias.find(c => c.nome === filtroCategoria)
  const descricaoCategoria = categoriaSelecionadaObj?.descricao

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
      {/* Título e links de navegação */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 className="page-title" style={{ margin: 0, color: '#888' }}>Catálogo de Jogos</h1>
        </Link>
        <Link to="/minhacolecao" style={{ textDecoration: 'none' }}>
          <h1 className="page-title" style={{ margin: 0, color: '#888' }}>
            Minha Coleção
          </h1>
        </Link>
        <Link to="/listadesejos" style={{ textDecoration: 'none' }}>
          <h1 className="page-title" style={{ margin: 0 }}>Lista de Desejos</h1>
        </Link>
      </div>

      {/* Mensagem de sucesso (aparece após excluir) */}
      {sucesso && <div className="alerta alerta-sucesso">{sucesso}</div>}

      {/* Mensagem de erro */}
      {
        erro && (
          <div className="alerta alerta-erro">
            {erro}{' '}
            <button
              onClick={carregarJogos}
              style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: 'inherit' }}
            >
              Tentar novamente
            </button>
          </div>
        )
      }

      <div className="filtro-container">
        <button onClick={() => { redefinirFiltros(); carregarJogos(); }} className="btn btn-primary" style={{ marginBottom: '1rem' }}>
          Listar Todos os Jogos
        </button>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Nome do Jogo"
            value={filtroNome}
            onChange={e => setFiltroNome(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && realizarBusca()}
            style={{ flex: 1, margin: 0 }}
          />
          <select
            className="form-input"
            value={filtroCategoria}
            onChange={e => setFiltroCategoria(e.target.value)}
            style={{ flex: 0.3, margin: 0 }}
          >
            <option value="">Todas as Categorias</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.nome}>
                {cat.nome}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={realizarBusca} style={{ margin: 0 }}>
            Buscar
          </button>
          <button className="btn btn-primary" onClick={redefinirFiltros} style={{ margin: 0 }}>
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Descrição da Categoria Selecionada */}
      {descricaoCategoria && (
        <div style={{ marginBottom: '1.5rem', marginTop: '1rem', padding: '0.8rem', backgroundColor: '#e9ecef', borderRadius: '8px', borderLeft: '4px solid #007bff' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#0056b3' }}>Sobre a categoria "{filtroCategoria}"</h4>
          <p style={{ margin: 0, color: '#333', fontSize: '0.9rem', lineHeight: '1.5' }}>{descricaoCategoria}</p>
        </div>
      )}

      {/* Lista vazia */}
      {
        jogos.length === 0 && !erro && (
          <div className="estado-vazio">
            <p>Nenhum jogo cadastrado ainda.</p>
            <Link to="/novojogo" className="btn btn-primary">
              Cadastrar o primeiro jogo
            </Link>
          </div>
        )
      }

      {/* Grid de cards */}
      {
        jogos.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
              <span style={{ color: '#666', fontWeight: '500' }}>
                {jogos.length} {jogos.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {renderControlesPaginacao(true)}
                <select
                  value={itensPorPagina}
                  onChange={e => {
                    setItensPorPagina(Number(e.target.value))
                    setPaginaAtual(1)
                  }}
                  className="form-input"
                  style={{ width: 'auto', margin: 0 }}
                >
                  <option value={15}>15 por página</option>
                  <option value={30}>30 por página</option>
                  <option value={45}>45 por página</option>
                </select>
                <select
                  value={ordenacao}
                  onChange={e => {
                    setOrdenacao(e.target.value)
                    setPaginaAtual(1)
                  }}
                  className="form-input"
                  style={{ width: 'auto', margin: 0 }}
                >
                  <option value="">Ordenar por...</option>
                  <option value="anoAsc">Ano (Crescente)</option>
                  <option value="anoDesc">Ano (Decrescente)</option>
                  <option value="categoria">Categoria</option>
                  <option value="nome">Nome</option>
                </select>
              </div>
            </div>
            <div className="jogos-grid">
              {jogosExibidos.map(jogo => (
                <div key={jogo.id} className="jogo-card">

                  {/* Categoria e Checkboxes */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span className="jogo-card-categoria" style={{ marginBottom: 0 }}>{jogo.categoria?.nome}</span>
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.8rem', color: '#555', fontWeight: '500' }}>
                        <input
                          type="checkbox"
                          checked={jogo.tenho || false}
                          onChange={(e) => handleCheckbox(jogo.id, 'tenho', e.target.checked)}
                        />
                        Tenho
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.8rem', color: '#555', fontWeight: '500' }}>
                        <input
                          type="checkbox"
                          checked={jogo.quero || false}
                          onChange={(e) => handleCheckbox(jogo.id, 'quero', e.target.checked)}
                        />
                        Quero
                      </label>
                    </div>
                  </div>

                  {/* Nome */}
                  <h2 className="jogo-card-nome" style={{ marginBottom: '1rem' }}>{jogo.nome}</h2>
                </div>
              ))}
            </div>

            {/* Controles de Paginação */}
            {renderControlesPaginacao()}
          </>
        )
      }

      {/* Modal de confirmação de exclusão */}
      <ModalConfirmacao
        visivel={modal.visivel}
        titulo="Excluir jogo"
        mensagem={`Tem certeza que deseja excluir "${modal.jogoNome}"? Esta ação não pode ser desfeita.`}
        onConfirmar={confirmarExclusao}
        onCancelar={fecharModal}
        carregando={excluindo}
      />
    </div >
  )
}

export default PaginaListaDesejos
