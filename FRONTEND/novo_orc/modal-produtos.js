
// Abrir e fechar modal
console.log('modal carregado')

function abrirModalProdutos() {
  document.getElementById('modal-produtos').style.display = 'flex';
  document.getElementById('busca-produto').value = '';
  document.getElementById('lista-produtos-encontrados').innerHTML = '';
}

function fecharModalProdutos() {
  document.getElementById('modal-produtos').style.display = 'none';
}

// Buscar produtos
document.getElementById('busca-produto').addEventListener('input', function () {
  const termo = this.value.trim();
  const lista = document.getElementById('lista-produtos-encontrados');

  if (termo.length >= 2) {
    fetch(`http://localhost:3001/api/produtos?busca=${encodeURIComponent(termo)}`)
      .then(res => res.json())
      .then(produtos => {
        lista.innerHTML = '';
        produtos.forEach(prod => {
          const div = document.createElement('div');
          div.className = 'item-produto';
          div.innerHTML = `
  <div>
    <strong>${prod.nmproduto}</strong> (${prod.unidadedemedida}) - R$ ${Number(prod.valor).toFixed(2)}
  </div>
`;

const botaoAdicionar = document.createElement('button');
      botaoAdicionar.textContent = 'Adicionar';
      botaoAdicionar.onclick = () => {
  adicionarProdutoAoOrcamento({
    idproduto: prod.idproduto,
    nmproduto: prod.nmproduto,
    unidadedemedida: prod.unidadedemedida,
    valor: prod.valor
  });
};

div.appendChild(botaoAdicionar);
lista.appendChild(div);
        });
      })
      .catch(() => {
        lista.innerHTML = '<em>Erro ao buscar produtos</em>';
      });
  } else {
    lista.innerHTML = '';
  }
});
