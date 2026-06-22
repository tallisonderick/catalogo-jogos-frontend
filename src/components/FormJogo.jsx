import { useState, useEffect } from 'react'

/**
 * FormJogo — formulário reutilizado para criar e editar jogos.
 *
 * Props:
 *   jogoInicial  → objeto com os dados do jogo (para edição) ou undefined (para criação)
 *   onSubmit     → função chamada com os dados quando o formulário é enviado
 *   onCancelar   → função chamada quando o usuário clica "Cancelar"
 *   carregando   → boolean: desabilita o botão enquanto salva
 *   erro         → string com mensagem de erro vinda do componente pai
 */
function FormJogo({ jogoInicial, onSubmit, onCancelar, carregando, erro }) {

  // --------------------------------------------------------
  // Estado do formulário
  // Cada campo tem seu próprio valor no estado.
  // Se jogoInicial existir (modo edição), pré-preenche os campos.
  // --------------------------------------------------------
  const [form, setForm] = useState({
    nome:          jogoInicial?.nome          ?? '',
    categoria:     jogoInicial?.categoria     ?? '',
    minJogadores:  jogoInicial?.minJogadores  ?? '',
    maxJogadores:  jogoInicial?.maxJogadores  ?? '',
    anoLancamento: jogoInicial?.anoLancamento ?? '',
    descricao:     jogoInicial?.descricao     ?? '',
  })

  // Erros de validação campo a campo
  const [erros, setErros] = useState({})

  // Quando jogoInicial muda (ex: dados carregados da API), atualiza o form
  useEffect(() => {
    if (jogoInicial) {
      setForm({
        nome:          jogoInicial.nome          ?? '',
        categoria:     jogoInicial.categoria     ?? '',
        minJogadores:  jogoInicial.minJogadores  ?? '',
        maxJogadores:  jogoInicial.maxJogadores  ?? '',
        anoLancamento: jogoInicial.anoLancamento ?? '',
        descricao:     jogoInicial.descricao     ?? '',
      })
    }
  }, [jogoInicial])

  // --------------------------------------------------------
  // Atualiza o campo correspondente quando o usuário digita
  // --------------------------------------------------------
  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Remove o erro do campo quando o usuário começa a digitar
    if (erros[name]) {
      setErros(prev => ({ ...prev, [name]: '' }))
    }
  }

  // --------------------------------------------------------
  // Validação local (antes de enviar para a API)
  // --------------------------------------------------------
  function validar() {
    const novosErros = {}

    if (!form.nome.trim())
      novosErros.nome = 'Nome é obrigatório'

    if (!form.categoria.trim())
      novosErros.categoria = 'Categoria é obrigatória'

    if (!form.minJogadores)
      novosErros.minJogadores = 'Número mínimo de jogadores é obrigatório'
    else if (Number(form.minJogadores) < 1)
      novosErros.minJogadores = 'Deve ser pelo menos 1'

    if (!form.maxJogadores)
      novosErros.maxJogadores = 'Número máximo de jogadores é obrigatório'
    else if (Number(form.maxJogadores) < Number(form.minJogadores))
      novosErros.maxJogadores = 'Deve ser maior ou igual ao mínimo'

    if (form.anoLancamento && Number(form.anoLancamento) < 1900)
      novosErros.anoLancamento = 'Ano inválido'

    return novosErros
  }

  // --------------------------------------------------------
  // Envio do formulário
  // --------------------------------------------------------
  function handleSubmit(e) {
    // Evita o comportamento padrão do browser (recarregar a página)
    e.preventDefault()

    const novosErros = validar()
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }

    // Monta o objeto a ser enviado para a API
    // Converte campos numéricos de string para número
    const dados = {
      nome:          form.nome.trim(),
      categoria:     form.categoria.trim(),
      minJogadores:  Number(form.minJogadores),
      maxJogadores:  Number(form.maxJogadores),
      anoLancamento: form.anoLancamento ? Number(form.anoLancamento) : null,
      descricao:     form.descricao.trim() || null,
    }

    onSubmit(dados)
  }

  // --------------------------------------------------------
  // Renderização do formulário
  // --------------------------------------------------------
  return (
    <div className="form-card">

      {/* Exibe erro vindo da API (ex: "Servidor fora do ar") */}
      {erro && <div className="alerta alerta-erro">{erro}</div>}

      <form onSubmit={handleSubmit} noValidate>

        {/* Campo: Nome */}
        <div className="form-group">
          <label className="form-label">
            Nome do jogo <span>*</span>
          </label>
          <input
            type="text"
            name="nome"
            className={`form-input ${erros.nome ? 'erro' : ''}`}
            value={form.nome}
            onChange={handleChange}
            placeholder="Ex: Catan, Ticket to Ride..."
            maxLength={200}
          />
          {erros.nome && <p className="form-erro">{erros.nome}</p>}
        </div>

        {/* Campo: Categoria */}
        <div className="form-group">
          <label className="form-label">
            Categoria <span>*</span>
          </label>
          <input
            type="text"
            name="categoria"
            className={`form-input ${erros.categoria ? 'erro' : ''}`}
            value={form.categoria}
            onChange={handleChange}
            placeholder="Ex: Estratégia, Cooperativo, Família..."
            maxLength={100}
          />
          {erros.categoria && <p className="form-erro">{erros.categoria}</p>}
        </div>

        {/* Campos lado a lado: Min e Max jogadores */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Mín. jogadores <span>*</span>
            </label>
            <input
              type="number"
              name="minJogadores"
              className={`form-input ${erros.minJogadores ? 'erro' : ''}`}
              value={form.minJogadores}
              onChange={handleChange}
              min={1}
              max={99}
              placeholder="Ex: 2"
            />
            {erros.minJogadores && <p className="form-erro">{erros.minJogadores}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Máx. jogadores <span>*</span>
            </label>
            <input
              type="number"
              name="maxJogadores"
              className={`form-input ${erros.maxJogadores ? 'erro' : ''}`}
              value={form.maxJogadores}
              onChange={handleChange}
              min={1}
              max={99}
              placeholder="Ex: 4"
            />
            {erros.maxJogadores && <p className="form-erro">{erros.maxJogadores}</p>}
          </div>
        </div>

        {/* Campo: Ano de lançamento (opcional) */}
        <div className="form-group">
          <label className="form-label">Ano de lançamento</label>
          <input
            type="number"
            name="anoLancamento"
            className={`form-input ${erros.anoLancamento ? 'erro' : ''}`}
            value={form.anoLancamento}
            onChange={handleChange}
            min={1900}
            max={new Date().getFullYear()}
            placeholder="Ex: 1995 (opcional)"
          />
          {erros.anoLancamento && <p className="form-erro">{erros.anoLancamento}</p>}
        </div>

        {/* Campo: Descrição (opcional) */}
        <div className="form-group">
          <label className="form-label">Descrição</label>
          <textarea
            name="descricao"
            className="form-textarea"
            value={form.descricao}
            onChange={handleChange}
            placeholder="Conte um pouco sobre o jogo... (opcional)"
            maxLength={1000}
            rows={4}
          />
        </div>

        {/* Botões de ação */}
        <div className="form-acoes">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={carregando}
          >
            {carregando ? 'Salvando...' : 'Salvar jogo'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancelar}
            disabled={carregando}
          >
            Cancelar
          </button>
        </div>

      </form>
    </div>
  )
}

export default FormJogo
