document.addEventListener('DOMContentLoaded', () => {
    const listaProdutos = document.getElementById('lista-produtos');
    const btnAddProduto = document.getElementById('btn-add-produto');
    const formFrete = document.getElementById('form-frete');
    const tabelaBody = document.querySelector('#tabela-fretes tbody');

    // Carrega fretes salvos ou inicia array vazio
    let fretes = JSON.parse(localStorage.getItem('fretes_db')) || [];

    // Função para criar dinamicamente uma linha de produto
    function adicionarCampoProduto() {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('produto-item');

        itemDiv.innerHTML = `
            <div class="input-group">
                <label>Descrição do Produto</label>
                <input type="text" name="produto_nome[]" placeholder="Ex: Caixas de Eletrônicos" required>
            </div>
            <div class="input-group">
                <label>Quantidade</label>
                <input type="number" name="produto_qtd[]" min="1" value="1" required>
            </div>
            <div class="input-group">
                <label>Peso Unit. (kg)</label>
                <input type="number" name="produto_peso[]" step="0.1" min="0.1" placeholder="0.0" required>
            </div>
            <button type="button" class="btn-danger btn-remover" title="Remover item">✕</button>
        `;

        // Evento para remover o campo dinâmico
        const btnRemover = itemDiv.querySelector('.btn-remover');
        btnRemover.addEventListener('click', () => {
            if (listaProdutos.children.length > 1) {
                itemDiv.remove();
            } else {
                alert('O frete precisa ter pelo menos um produto cadastrado.');
            }
        });

        listaProdutos.appendChild(itemDiv);
    }

    // Renderiza a tabela de fretes na tela
    function renderizarTabela() {
        tabelaBody.innerHTML = '';

        if (fretes.length === 0) {
            tabelaBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748b;">Nenhum frete registrado ainda.</td></tr>`;
            return;
        }

        fretes.forEach((frete, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${frete.origem}</strong><br><small style="color:#64748b">para ${frete.destino}</small></td>
                <td>${frete.transportadora}</td>
                <td>${frete.totalItens} un. (${frete.pesoTotal.toFixed(1)} kg)</td>
                <td><span class="badge">${frete.status}</span></td>
                <td>
                    <button type="button" class="btn-danger" onclick="excluirFrete(${index})">Excluir</button>
                </td>
            `;
            tabelaBody.appendChild(tr);
        });
    }

    // Função global para excluir registro
    window.excluirFrete = (index) => {
        fretes.splice(index, 1);
        localStorage.setItem('fretes_db', JSON.stringify(fretes));
        renderizarTabela();
    };

    // Submissão do formulário
    formFrete.addEventListener('submit', (e) => {
        e.preventDefault();

        const origem = document.getElementById('origem').value;
        const destino = document.getElementById('destino').value;
        const transportadora = document.getElementById('transportadora').value;
        const status = document.getElementById('status').value;

        // Captura todos os campos dinâmicos gerados
        const nomes = document.getElementsByName('produto_nome[]');
        const qtds = document.getElementsByName('produto_qtd[]');
        const pesos = document.getElementsByName('produto_peso[]');

        let produtos = [];
        let totalItens = 0;
        let pesoTotal = 0;

        for (let i = 0; i < nomes.length; i++) {
            const qtd = parseInt(qtds[i].value);
            const peso = parseFloat(pesos[i].value);

            produtos.push({
                nome: nomes[i].value,
                quantidade: qtd,
                pesoUnitario: peso
            });

            totalItens += qtd;
            pesoTotal += (qtd * peso);
        }

        const novoFrete = {
            id: Date.now(),
            origem,
            destino,
            transportadora,
            status,
            produtos,
            totalItens,
            pesoTotal
        };

        fretes.push(novoFrete);
        localStorage.setItem('fretes_db', JSON.stringify(fretes));

        // Reseta formulário e recria 1 linha padrão de produto
        formFrete.reset();
        listaProdutos.innerHTML = '';
        adicionarCampoProduto();
        renderizarTabela();
    });

    // Inicialização
    btnAddProduto.addEventListener('click', adicionarCampoProduto);
    adicionarCampoProduto(); // Inicia com 1 produto na tela
    renderizarTabela();
});