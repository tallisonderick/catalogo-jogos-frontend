import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { criarCategoria } from '../services/api'
import FormCategoria from '../components/FormCategoria'

function PaginaNovaCategoria() {
  const navigate = useNavigate()
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  async function handleSubmit(dados) {
    try {
      setCarregando(true)
      setErro(null)

      await criarCategoria(dados)

      navigate('/', { state: { sucesso: `Categoria "${dados.nome}" cadastrada com sucesso!` } })
    } catch (e) {
      setErro(e.message)
      setCarregando(false)
    }
  }

  function handleCancelar() {
    navigate('/')
  }

  return (
    <div>
      <h1 className="page-title">Nova categoria</h1>
      <FormCategoria
        onSubmit={handleSubmit}
        onCancelar={handleCancelar}
        carregando={carregando}
        erro={erro}
      />
    </div>
  )
}

export default PaginaNovaCategoria
