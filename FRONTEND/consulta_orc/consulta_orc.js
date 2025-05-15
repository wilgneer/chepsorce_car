let orcamentos = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch('/orcamentos')
    .then(res => res.json())
    .then(dados => {
      orcamentos = dados;
      renderTabela(dados);
    });

  document.getElementById("buscaOrcamento").addEventListener("input", (e) => {
    const termo = e.target.value.trim().toLowerCase();
    const filtrados = orcamentos.filter(o =>
      o.nrorcamento.toString().includes(termo) ||
      o.placa?.toLowerCase().includes(termo) ||
      o.nome?.toLowerCase().includes(termo) ||
      new Date(o.dtorcamento).toLocaleDateString().includes(termo)
    );
    renderTabela(filtrados);
  });
});

function renderTabela(dados) {
  const tbody = document.querySelector("#tabela-orcamentos tbody");
  tbody.innerHTML = '';

  dados.forEach(orc => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${orc.nrorcamento}</td>
      <td>${orc.nome}</td>
      <td>${orc.email}</td>
      <td>${orc.nmmodelo}</td>
      <td>${orc.placa}</td>
      <td>${new Date(orc.dtorcamento).toLocaleDateString()}</td>
      <td><button onclick="verDetalhes(${orc.nrorcamento})">Detalhes</button></td>
      <td><button onclick="imprimirOrcamento(${orc.nrorcamento})">Imprimir</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function verDetalhes(id) {
  fetch(`/orcamentos/${id}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("detalhes-container");

      const total = data.itens.reduce((soma, item) => soma + (Number(item.qtdproduto) * Number(item.valorunitario)), 0);

      const itensHTML = data.itens.map(item => {
        const qtd = Number(item.qtdproduto) || 0;
        const valor = Number(item.valorunitario) || 0;
        const subtotal = qtd * valor;
        return `
          <tr>
            <td>${item.nmproduto}</td>
            <td>${item.unidadedemedida}</td>
            <td>${qtd}</td>
            <td>R$ ${valor.toFixed(2)}</td>
            <td>R$ ${subtotal.toFixed(2)}</td>
          </tr>
        `;
      }).join('');

      container.innerHTML = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; font-size: 14px; margin: 40px;">
          <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ccc; padding-bottom: 20px; margin-bottom: 20px;">
            <!-- Aqui você deve colocar o caminho da sua logo -->
            <div><img src="logo.png" alt="Logo" style="height: 80px;" /></div>
            <div style="text-align: right;">
              <h1 style="font-size: 22px; margin: 0;">${data.empresa.nmempresa}</h1>
              <p>CNPJ: ${data.empresa.cnpj}</p>
              <p>${data.empresa.endereco}</p>
            </div>
          </header>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
            <div style="border: 1px solid #ccc; padding: 15px;">
              <h2 style="font-size: 16px; color: #2b7a78; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Cliente</h2>
              <p><strong>Nome:</strong> ${data.cliente.nome}</p>
              <p><strong>CPF:</strong> ${data.cliente.cpf}</p>
              <p><strong>Email:</strong> ${data.cliente.email}</p>
              <p><strong>Cel:</strong> ${data.cliente.celular}</p>
            </div>

            <div style="border: 1px solid #ccc; padding: 15px;">
              <h2 style="font-size: 16px; color: #2b7a78; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Carro</h2>
              <p><strong>Modelo:</strong> ${data.carro.nmmodelo}</p>
              <p><strong>Cor:</strong> ${data.carro.cor}</p>
              <p><strong>Ano:</strong> ${data.carro.ano}</p>
              <p><strong>Placa:</strong> ${data.carro.placa}</p>
            </div>
          </div>

          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 16px; color: #2b7a78; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Detalhes do Orçamento</h2>
            <p><strong>Nº Orçamento:</strong> ${data.orcamento.idorcamento}</p>
            <p><strong>Data:</strong> ${new Date(data.orcamento.datacriacao).toLocaleDateString()}</p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr>
                  <th style="padding: 10px; border: 1px solid #ccc; background-color: #AACBC4; color: #000;">Produto</th>
                  <th style="padding: 10px; border: 1px solid #ccc; background-color: #AACBC4; color: #000;">Unidade</th>
                  <th style="padding: 10px; border: 1px solid #ccc; background-color: #AACBC4; color: #000;">Qtd</th>
                  <th style="padding: 10px; border: 1px solid #ccc; background-color: #AACBC4; color: #000;">Valor Unitário</th>
                  <th style="padding: 10px; border: 1px solid #ccc; background-color: #AACBC4; color: #000;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itensHTML}
              </tbody>
            </table>

            <div style="text-align: right; font-family: 'Poppins', sans-serif; font-size: 26px; font-weight: bold; color: #0A2342; margin-top: 20px;">
              VALOR TOTAL: R$ ${total.toFixed(2)}
            </div>
          </div>

          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 16px; color: #2b7a78; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Observações</h2>
            <div style="white-space: pre-wrap; border: 1px solid #ccc; padding: 12px; background: #f9f9f9;">
              ${data.orcamento.observacao || '---'}
            </div>
          </div>

          <div style="text-align: right; margin-top: 60px;">
            ___________________________<br>
            Assinatura do Cliente
          </div>
        </div>
      `;

      document.getElementById("modal").classList.remove("hidden");
    });
}

function fecharModal() {
  document.getElementById("modal").classList.add("hidden");
}

function imprimirOrcamento(id) {
  verDetalhes(id);
  setTimeout(() => {
    const printContents = document.getElementById("print-area").innerHTML;
    const win = window.open('', '', 'width=900,height=600');
    win.document.write(`
      <html>
        <head>
          <title>Impressão de Orçamento</title>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap" rel="stylesheet">
          <style>body { font-family: 'Poppins', sans-serif; }</style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  }, 600);
}

function buscarOrcamento() {
  const termo = document.getElementById("buscaOrcamento").value.trim().toLowerCase();
  const filtrados = orcamentos.filter(o =>
    o.nrorcamento.toString().includes(termo) ||
    o.placa?.toLowerCase().includes(termo) ||
    o.nome?.toLowerCase().includes(termo) ||
    new Date(o.dtorcamento).toLocaleDateString().includes(termo)
  );
  renderTabela(filtrados);
}
