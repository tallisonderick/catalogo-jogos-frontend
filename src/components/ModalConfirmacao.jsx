/**
 * ModalConfirmacao — modal de confirmação antes de excluir um jogo.
 *
 * Props:
 *   visivel       → boolean: se o modal está aberto ou fechado
 *   titulo        → texto do título do modal
 *   mensagem      → texto explicativo
 *   onConfirmar   → função chamada quando o usuário clica "Excluir"
 *   onCancelar    → função chamada quando o usuário clica "Cancelar"
 *   carregando    → boolean: exibe "Excluindo..." durante a requisição
 */
function ModalConfirmacao({ visivel, titulo, mensagem, onConfirmar, onCancelar, carregando }) {
  // Se o modal não estiver visível, não renderiza nada
  if (!visivel) return null

  return (
    // Fundo escurecido por trás do modal
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="modal-titulo">{titulo}</h3>
        <p className="modal-texto">{mensagem}</p>

        <div className="modal-acoes">
          {/* Botão cancelar — fecha o modal sem fazer nada */}
          <button
            className="btn btn-secondary"
            onClick={onCancelar}
            disabled={carregando}
          >
            Cancelar
          </button>

          {/* Botão confirmar — executa a ação de excluir */}
          <button
            className="btn btn-danger"
            onClick={onConfirmar}
            disabled={carregando}
          >
            {carregando ? 'Excluindo...' : 'Sim, excluir'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirmacao
