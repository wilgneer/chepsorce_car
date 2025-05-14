document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("dtcriacao").textContent = new Date().toLocaleDateString("pt-BR");
  const protocolo = Math.floor(100000 + Math.random() * 900000);
  document.getElementById("nrprotocolo").textContent = protocolo;

  document.querySelector('#btnSalvar').addEventListener('click', salvarOrcamento);
});

function cancelarOrcamento() {
  document.getElementById('cpfcliente').value = '';
  document.getElementById('placacarro').value = '';
  document.getElementById('observacoes').value = '';
  document.getElementById('cliente-info').innerHTML = '';
  document.getElementById('carro-info').innerHTML = '';
  document.getElementById('produtos-adicionados').innerHTML = '';
  document.getElementById('valor-total').textContent = 'R$ 0,00';
}

async function salvarOrcamento() {
  const cpf = document.getElementById('cpfcliente').value.trim();
  const placa = document.getElementById('placacarro').value.trim();
  const observacoes = document.getElementById('observacoes').value.trim();

  const produtos = [];
  document.querySelectorAll('.produto-item').forEach(item => {
    const descricao = item.querySelector('.col.descricao')?.innerText.trim();
    const unidade = item.querySelector('.col.unidade')?.innerText.trim();
    const valorTexto = item.querySelector('.col.valor')?.innerText.replace('R$', '').replace(',', '.').trim();
    const qtd = item.querySelector('.input-qtd')?.value;

    if (descricao && unidade && valorTexto && qtd) {
      produtos.push({
        descricao,
        unidade,
        valor: parseFloat(valorTexto),
        quantidade: parseInt(qtd)
      });
    }
  });

  const dados = { cpfcliente: cpf, placacarro: placa, observacoes, produtos };

  try {
    const resposta = await fetch('http://localhost:3001/api/orcamento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();
    if (resposta.ok) {
      console.log("Orçamento salvo com sucesso!");
      alert("Orçamento salvo com sucesso!");
      window.location.href = "menu.html";
    } else {
      alert('Erro ao salvar: ' + (resultado.message || 'Tente novamente.'));
    }
  } catch (erro) {
    alert('Erro na conexão com o servidor.');
    console.error(erro);
  }
}

// ===== CLIENTE =====
let clienteTimeout = null;
document.getElementById('cpfcliente').addEventListener('input', function () {
  clearTimeout(clienteTimeout);
  const termo = this.value.trim();
  if (termo.length >= 3) {
    clienteTimeout = setTimeout(() => {
      fetch(`http://127.0.0.1:3001/api/clientes?busca=${encodeURIComponent(termo)}`)
        .then(res => res.json())
        .then(clientes => {
          const box = document.getElementById('cliente-info');
          box.innerHTML = '';
          if (clientes.length) {
            clientes.forEach(c => {
              const item = document.createElement('div');
              item.className = 'item-cliente';
              item.textContent = `${c.nome} - CPF: ${c.cpf}`;
              item.onclick = () => {
                document.getElementById('cpfcliente').value = c.cpf;
                box.innerHTML = `<div class="item-cliente"><strong>${c.nome}</strong> (CPF: ${c.cpf})</div>`;
              };
              box.appendChild(item);
            });
          } else box.innerHTML = '<em>Nenhum cliente encontrado</em>';
        })
        .catch(() => document.getElementById('cliente-info').innerHTML = '<em>Erro na busca</em>');
    }, 400);
  } else document.getElementById('cliente-info').innerHTML = '';
});

// ===== CARRO =====
let carroTimeout = null;
document.getElementById('placacarro').addEventListener('input', function () {
  clearTimeout(carroTimeout);
  const termo = this.value.trim();
  if (termo.length >= 3) {
    carroTimeout = setTimeout(() => {
      fetch(`http://localhost:3001/api/carros?busca=${encodeURIComponent(termo)}`)
        .then(res => res.json())
        .then(carros => {
          const box = document.getElementById('carro-info');
          box.innerHTML = '';
          if (carros.length) {
            carros.forEach(carro => {
              const item = document.createElement('div');
              item.className = 'item-carro';
              item.textContent = `${carro.placa} - ${carro.marca} ${carro.nmmodelo} - ${carro.cor} ${carro.ano}`;
              item.onclick = () => {
                document.getElementById('placacarro').value = carro.placa;
                box.innerHTML = `<div class="item-carro"><strong>${carro.marca} ${carro.nmmodelo}</strong> - ${carro.cor} ${carro.ano} (${carro.placa})</div>`;
              };
              box.appendChild(item);
            });
          } else box.innerHTML = '<em>Nenhum carro encontrado</em>';
        })
        .catch(() => document.getElementById('carro-info').innerHTML = '<em>Erro na busca</em>');
    }, 400);
  } else document.getElementById('carro-info').innerHTML = '';
});