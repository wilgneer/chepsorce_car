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

      const total = data.itens.reduce((soma, item) => soma + (item.qtdproduto * item.valorunitario), 0);

      container.innerHTML = `
        <div style="text-align: left;">
          <table style="width: 100%;">
            <tr>
              <td style="width: 30%;">
                <div style="border: 1px solid #ccc; height: 100px; display: flex; align-items: center; justify-content: center;">LOGO AQUI</div>
              </td>
              <td>
                <h3>EMPRESA:</h3>
                <p><strong>${data.empresa.nmempresa}</strong></p>
                <p>${data.empresa.endereco}</p>
                <p>CNPJ: ${data.empresa.cnpj}</p>
              </td>
            </tr>
          </table>

          <hr>
          <h4>CLIENTE:</h4>
          <p><strong>${data.cliente.nome}</strong></p>
          <p>CPF: ${data.cliente.cpf}</p>
          <p>Email: ${data.cliente.email} | Cel: ${data.cliente.celular}</p>

          <hr>
          <h4>CARRO:</h4>
          <p>${data.carro.marca} ${data.carro.nmmodelo} - ${data.carro.cor} - ${data.carro.ano}</p>
          <p>Placa: ${data.carro.placa}</p>

          <hr>
          <h4>DETALHE DO ORÇAMENTO Nº ${data.orcamento.idorcamento}</h4>
          <p>Data: ${new Date(data.orcamento.datacriacao).toLocaleDateString()}</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr>
                <th style="padding: 8px; border: 1px solid #ccc; background-color: #AACBC4; color: #000;">Produto</th>
                <th style="padding: 8px; border: 1px solid #ccc; background-color: #AACBC4; color: #000;">Unidade</th>
                <th style="padding: 8px; border: 1px solid #ccc; background-color: #AACBC4; color: #000;">Qtd</th>
                <th style="padding: 8px; border: 1px solid #ccc; background-color: #AACBC4; color: #000;">Valor Unitário</th>
              </tr>
            </thead>
            <tbody>
              ${data.itens.map(item => `
                <tr>
                  <td style="border: 1px solid #ccc; padding: 6px;">${item.nmproduto}</td>
                  <td style="border: 1px solid #ccc; padding: 6px;">${item.unidadedemedida}</td>
                  <td style="border: 1px solid #ccc; padding: 6px;">${item.qtdproduto}</td>
                  <td style="border: 1px solid #ccc; padding: 6px;">R$ ${(Number(item.valorunitario) || 0).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <p class="valor-total">
            <strong>Valor Total:</strong> R$ ${total.toFixed(2)}
          </p>

          <p><strong>Observações:<br></strong> ${data.orcamento.observacao || '---'}</p>

          <div style="text-align: right; margin-top: 40px;">
            _____________________ <br>
            Assinatura do Cliente
          </div>
        </div>
      `;

      document.getElementById("modal").classList.remove("hidden");

      // Aplica estilo leve nos textos normais
      container.querySelectorAll("p, td").forEach(el => {
        if (!el.querySelector("strong")) {
          el.style.fontWeight = "300";
          el.style.fontSize = "14px";
        }
      });
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
        <head><title>Impressão de Orçamento</title></head>
        <body style="font-family: Poppins, sans-serif;">
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