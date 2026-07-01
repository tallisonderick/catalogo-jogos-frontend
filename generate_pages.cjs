const fs = require('fs');

let content = fs.readFileSync('src/pages/PaginaLista.jsx', 'utf-8');

// Modificações globais para ambas as páginas

// 1. Remover estados de filtro desnecessários
content = content.replace(/const \[filtroMinJogadores.*?\] = useState\(''\)\r?\n/g, '');
content = content.replace(/const \[filtroMaxJogadores.*?\] = useState\(''\)\r?\n/g, '');
content = content.replace(/const \[filtroAnoInicio.*?\] = useState\(''\)\r?\n/g, '');
content = content.replace(/const \[filtroAnoFim.*?\] = useState\(''\)\r?\n/g, '');

// 2. Remover do redefinirFiltros
content = content.replace(/setFiltroMinJogadores\(''\)\r?\n/g, '');
content = content.replace(/setFiltroMaxJogadores\(''\)\r?\n/g, '');
content = content.replace(/setFiltroAnoInicio\(''\)\r?\n/g, '');
content = content.replace(/setFiltroAnoFim\(''\)\r?\n/g, '');

// 3. Remover inputs de filtro da renderização
const filterToRemoveRegex = /<div style={{ display: 'flex', alignItems: 'center', gap: '0\.5rem', flex: 2 }}>\s*<span style={{ whiteSpace: 'nowrap', fontWeight: '500', color: '#555' }}>Nº de Jogadores:<\/span>[\s\S]*?<div style={{ display: 'flex', alignItems: 'center', gap: '0\.5rem', flex: 2 }}>\s*<span style={{ whiteSpace: 'nowrap', fontWeight: '500', color: '#555' }}>Lançado entre:<\/span>[\s\S]*?<\/div>\s*<\/div>/;
content = content.replace(filterToRemoveRegex, '');

// 4. Remover lógica de filtro no useEffect (a que usa os estados removidos)
const filterLogicRegex = /if \(filtroMinJogadores\).*?if \(filtroAnoFim\) \{[^{}]*\}/s;
content = content.replace(filterLogicRegex, '');

// 5. Limpar cards
const cardInfoRegex = /{([^}]*)}[\s\S]*?<p className="jogo-card-info">[\s\S]*?<\/p>/;
content = content.replace(/<p className="jogo-card-info">[\s\S]*?<\/p>/, ''); // remove from first match? Let's use string replace for exact strings or robust regex.

// Let's manually replace the card contents
const cardContentRegex = /{([^}]*)}\s*{([^}]*)}\s*<p className="jogo-card-info">[\s\S]*?<\/p>\s*{([^}]*)}\s*{jogo\.descricao && \([\s\S]*?<\/p>\s*\)}\s*{([^}]*)}\s*<div className="jogo-card-acoes"[\s\S]*?<\/div>/g;
content = content.replace(cardContentRegex, '');

// Write PaginaMinhaColecao.jsx
let colecao = content.replace(/function PaginaLista\(\)/, 'function PaginaMinhaColecao()');
colecao = colecao.replace(/export default PaginaLista/, 'export default PaginaMinhaColecao');
// Headers
colecao = colecao.replace(/<h1 className="page-title" style={{ margin: 0 }}>\s*Catálogo de Jogos\s*<\/h1>/, '<h1 className="page-title" style={{ margin: 0, color: \'#888\' }}>Catálogo de Jogos</h1>');
colecao = colecao.replace(/<h1 className="page-title" style={{ margin: 0, color: '#888' }}>\s*Minha Coleção\s*<\/h1>/, '<h1 className="page-title" style={{ margin: 0 }}>Minha Coleção</h1>');

// Apply initial filter
colecao = colecao.replace(/let dadosParaFiltrar = dados/, 'let dadosParaFiltrar = dados.filter(j => j.tenho === true)');

// Write PaginaListaDesejos.jsx
let desejos = content.replace(/function PaginaLista\(\)/, 'function PaginaListaDesejos()');
desejos = desejos.replace(/export default PaginaLista/, 'export default PaginaListaDesejos');
desejos = desejos.replace(/<h1 className="page-title" style={{ margin: 0 }}>\s*Catálogo de Jogos\s*<\/h1>/, '<h1 className="page-title" style={{ margin: 0, color: \'#888\' }}>Catálogo de Jogos</h1>');
desejos = desejos.replace(/<h1 className="page-title" style={{ margin: 0, color: '#888' }}>\s*Lista de Desejos\s*<\/h1>/, '<h1 className="page-title" style={{ margin: 0 }}>Lista de Desejos</h1>');

desejos = desejos.replace(/let dadosParaFiltrar = dados/, 'let dadosParaFiltrar = dados.filter(j => j.quero === true)');

fs.writeFileSync('src/pages/PaginaMinhaColecao.jsx', colecao);
fs.writeFileSync('src/pages/PaginaListaDesejos.jsx', desejos);

console.log("Arquivos gerados");
