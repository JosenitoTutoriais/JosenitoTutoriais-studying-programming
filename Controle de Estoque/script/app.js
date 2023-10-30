/*bom o código JavaScript define um evento de clique no elemento
navbarToggle adiciona ou remove a classe active onde faz a consulta*/

const navbarMenu = document.querySelector('.navbar-menu');
const navbarToggle = document.querySelector('.navbar-toggle');

navbarToggle.addEventListener('click', () => {
    navbarToggle.classList.toggle('ativo');
    navbarMenu.classList.toggle('ativo');
});


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
}
let produtos = [];

// Array para armazenar os produtos

// Recuperar os produtos salvos no localStorage, se existirem
const produtosSalvos = localStorage.getItem('produtos');
if (produtosSalvos) {
    produtos = JSON.parse(produtosSalvos);
}

function salvarProdutosNoLocalStorage() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

function pesquisarProduto() {
    const expressao = document.getElementById('input-busca').value.toLowerCase();

    produtos.forEach((produto, index) => {
        const { nome, detalhes } = produto;
        const textoDoProduto = `${nome.toLowerCase()} ${detalhes.toLowerCase()}`;
        const linha = document.getElementById('tabela-produtos').getElementsByTagName('tr')[index + 1]; 
        // Começa em 1 para evitar o cabeçalho

        if (textoDoProduto.includes(expressao)) {
            linha.style.display = '';
        } else {
            linha.style.display = 'none';
        }
    });
}

function atualizarTabela() {
    const tabela = document.getElementById('tabela-produtos');
    tabela.innerHTML = `
                <thead class="table-dark">
                    <tr>
                        <th>#ID</th>
                        <th>Nome</th>
                        <th>Detalhes</th>
                        <th>Quantidade</th>
                        <th>Ações</th>
                    </tr>
                </thead>
            `;

    produtos.forEach((produto, index) => {
        const row = tabela.insertRow();
        row.innerHTML = `
                    <td>${index}</td>
                    <td>${produto.nome}</td>
                    <td>${produto.detalhes}</td>
                    <td>${produto.quantidade}</td>
                    <td>
                        <button onclick="excluirProduto(${index})" class="btn btn-danger btn-sm">Excluir</button>
                        <button onclick="editarProduto(${index})" class="btn btn-secondary btn-sm">Editar</button>
                    </td>
                `;
    });
}

function cadastrarProduto() {
    const nome = document.getElementById('input-nome').value;
    const detalhes = document.getElementById('input-detalhes').value;
    const quantidade = document.getElementById('input-quantidade').value;

    if (nome && detalhes && quantidade) {
        const novoProduto = {
            nome: nome,
            detalhes: detalhes,
            quantidade: quantidade
        };
        produtos.push(novoProduto);
        atualizarTabela();
        salvarProdutosNoLocalStorage();
        limparInputs();
    }
}

function excluirProduto(index) {
    produtos.splice(index, 1);
    atualizarTabela();
    salvarProdutosNoLocalStorage();
}

let produtoEmEdicao = null;

function editarProduto(index) {
    produtoEmEdicao = index;
    const produto = produtos[index];
    document.getElementById('input-nome').value = produto.nome;
    document.getElementById('input-detalhes').value = produto.detalhes;
    document.getElementById('input-quantidade').value = produto.quantidade;
}

function salvarEdicaoProduto() {
    const nome = document.getElementById('input-nome').value;
    const detalhes = document.getElementById('input-detalhes').value;
    const quantidade = document.getElementById('input-quantidade').value;

    if (nome && detalhes && quantidade && produtoEmEdicao !== null) {
        produtos[produtoEmEdicao] = {
            nome: nome,
            detalhes: detalhes,
            quantidade: quantidade
        };
        produtoEmEdicao = null;
        atualizarTabela();
        salvarProdutosNoLocalStorage();
        limparInputs();
    }
}

function limparInputs() {
    document.getElementById('input-nome').value = '';
    document.getElementById('input-detalhes').value = '';
    document.getElementById('input-quantidade').value = '';
}

// Chamar a função para exibir a tabela de produtos
salvarProdutosNoLocalStorage();
atualizarTabela();


function exportarDados() {
    let textoExportacao = '';

    produtos.forEach(produto => {
        textoExportacao += `Nome: ${produto.nome}\nDetalhes: ${produto.detalhes}\nQuantidade: ${produto.quantidade}\n\n`;
    });

    const element = document.createElement('a');
    const file = new Blob([textoExportacao], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'lista_de_produtos.txt';
    document.body.appendChild(element); 
    // Para permitir o download do arquivo
    element.click();
    document.body.removeChild(element);
}
