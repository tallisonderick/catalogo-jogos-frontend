import { useState } from 'react'

function FormCategoria({ onSubmit, onCancelar, carregando, erro }) {
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
  })
  const [erros, setErros] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (erros[name]) {
      setErros(prev => ({ ...prev, [name]: '' }))
    }
  }

  function validar() {
    const novosErros = {}
    if (!form.nome.trim())
      novosErros.nome = 'Nome da categoria é obrigatório'
    return novosErros
  }

  function handleSubmit(e) {
    e.preventDefault()
    const novosErros = validar()
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }
    const dados = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim() || null,
    }
    onSubmit(dados)
  }

  return (
    <div className="form-card">
      {erro && <div className="alerta alerta-erro">{erro}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label">
            Nome da categoria <span>*</span>
          </label>
          <input
            type="text"
            name="nome"
            className={`form-input ${erros.nome ? 'erro' : ''}`}
            value={form.nome}
            onChange={handleChange}
            placeholder="Ex: Eurogame, Party Game..."
            maxLength={100}
          />
          {erros.nome && <p className="form-erro">{erros.nome}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Descrição</label>
          <textarea
            name="descricao"
            className="form-textarea"
            value={form.descricao}
            onChange={handleChange}
            placeholder="Breve descrição da categoria... (opcional)"
            maxLength={1000}
            rows={4}
          />
        </div>

        <div className="form-acoes">
          <button type="submit" className="btn btn-primary" disabled={carregando}>
            {carregando ? 'Salvando...' : 'Salvar categoria'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancelar} disabled={carregando}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormCategoria
