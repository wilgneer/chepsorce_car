function atualizarTotal() {
  let totalGeral = 0;
  document.querySelectorAll('.produto-item').forEach(item => {
    const valor = item.querySelector('.col.valor')?.textContent.replace('R$', '').replace(',', '.');
    const qtd = parseInt(item.querySelector('.input-qtd')?.value) || 1;
    if (valor) {
      totalGeral += parseFloat(valor) * qtd;
    }
  });

  document.getElementById('valor-total').textContent = 'R$ ' + totalGeral.toFixed(2).replace('.', ',');
}