/**
 * api.js — Camada de comunicação com o backend
 *
 * Este arquivo centraliza todas as chamadas HTTP para a API.
 * Vantagem: se a URL mudar, você altera só aqui, em um lugar só.
 */

// URL base da API. Se o backend estiver em outra porta ou servidor, altere aqui.
const BASE_URL = 'http://localhost:8080/jogos'
const BASE_URL_CATEGORIAS = 'http://localhost:8080/categorias'

/**
 * Função auxiliar para fazer requisições HTTP.
 *
 * Ela lida com:
 *   - Definir o Content-Type como JSON
 *   - Converter o corpo da requisição para JSON (quando necessário)
 *   - Verificar se houve erro e lançar uma exceção com a mensagem
 */
async function request(url, opcoes = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...opcoes,
  }

  // Se houver um corpo (body), converte o objeto JS para string JSON
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body)
  }

  const response = await fetch(url, config)

  // Se a resposta não for OK (status fora do intervalo 200-299), lança um erro
  if (!response.ok) {
    // Tenta pegar a mensagem de erro que o backend enviou
    let mensagemErro = `Erro ${response.status}: ${response.statusText}`
    try {
      const dados = await response.json()
      if (dados.erro) mensagemErro = dados.erro
    } catch {
      // Se não conseguir ler o JSON do erro, usa a mensagem padrão
    }
    throw new Error(mensagemErro)
  }

  // Se a resposta for 204 (sem conteúdo), retorna null
  if (response.status === 204) {
    return null
  }

  // Converte a resposta JSON para objeto JavaScript
  return response.json()
}

// ============================================================
//  FUNÇÕES DA API
// ============================================================

/**
 * Busca todos os jogos cadastrados.
 * Retorna: array de jogos []
 */
export async function listarJogos() {
  return request(BASE_URL)
}

/**
 * Busca um jogo específico pelo id.
 * @param {number} id - ID do jogo
 * Retorna: objeto do jogo {}
 */
export async function buscarJogo(id) {
  return request(`${BASE_URL}/${id}`)
}

/**
 * Cria um novo jogo.
 * @param {object} jogo - Dados do jogo a criar
 * Retorna: objeto do jogo criado (com o id gerado)
 */
export async function criarJogo(jogo) {
  return request(BASE_URL, {
    method: 'POST',
    body: jogo,
  })
}

/**
 * Atualiza um jogo existente.
 * @param {number} id   - ID do jogo a atualizar
 * @param {object} jogo - Novos dados do jogo
 * Retorna: objeto do jogo atualizado
 */
export async function atualizarJogo(id, jogo) {
  return request(`${BASE_URL}/${id}`, {
    method: 'PUT',
    body: jogo,
  })
}

/**
 * Exclui um jogo pelo id.
 * @param {number} id - ID do jogo a excluir
 * Retorna: null (sem conteúdo)
 */
export async function excluirJogo(id) {
  return request(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
}

/**
 * Busca jogos por categoria.
 * @param {string} categoria - Nome da categoria
 * Retorna: array de jogos da categoria
 */
export async function buscarPorCategoria(categoria) {
  return request(`${BASE_URL}/categoria/${encodeURIComponent(categoria)}`)
}


export async function listarCategorias() {
  return request(BASE_URL_CATEGORIAS)
}

