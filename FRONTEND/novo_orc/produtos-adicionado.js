function adicionarProdutoAoOrcamento(produto) {
  const container = document.getElementById('produtos-adicionados');
  const div = document.createElement('div');
  div.className = 'produto-item';

  const preco = parseFloat(produto.valor);

  const qtdInput = document.createElement('input');
  qtdInput.type = 'number';
  qtdInput.min = 1;
  qtdInput.value = 1;
  qtdInput.className = 'input-qtd';
  qtdInput.onchange = () => atualizarTotal();

  div.innerHTML = `
    <div class="col descricao"><strong>${produto.nmproduto}</strong></div>
    <div class="col unidade">${produto.unidadedemedida}</div>
    <div class="col valor">R$ ${preco.toFixed(2)}</div>
  `;

  const qtdDiv = document.createElement('div');
  qtdDiv.className = 'col qtd';
  qtdDiv.appendChild(qtdInput);

  const acaoDiv = document.createElement('div');
  acaoDiv.className = 'col remover';
  const btn = document.createElement('button');
  btn.textContent = 'X';
  btn.className = 'btn-remover';
  btn.onclick = () => {
    div.remove();
    atualizarTotal();
  };
  acaoDiv.appendChild(btn);

  div.appendChild(qtdDiv);
  div.appendChild(acaoDiv);
  container.appendChild(div);
  atualizarTotal();
  fecharModalProdutos();
}