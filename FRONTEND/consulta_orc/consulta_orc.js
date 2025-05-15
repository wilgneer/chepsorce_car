function verDetalhes(id) {
  fetch(`/orcamentos/${id}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("detalhes-container");

      const total = data.itens.reduce((soma, item) => soma + (item.qtdproduto * item.valorunitario), 0);

      const itensHTML = data.itens.map(item => {
        const subtotal = item.qtdproduto * item.valorunitario;
        return `
          <tr>
            <td>${item.nmproduto}</td>
            <td>${item.unidadedemedida}</td>
            <td>${item.qtdproduto}</td>
            <td>R$ ${item.valorunitario.toFixed(2)}</td>
            <td>R$ ${subtotal.toFixed(2)}</td>
          </tr>
        `;
      }).join('');

      container.innerHTML = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; font-size: 14px; margin: 40px;">
          <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ccc; padding-bottom: 20px; margin-bottom: 20px;">
            <div><img src="logo.png" alt="Logo" style="height: 80px;" /></div>
            <div style="text-align: right;">
              <h1 style="font-size: 22px; margin: 0;">${data.empresa.nmempresa}</h1>
              <p>CNPJ: ${data.empresa.cnpj}</p>
              <p>${data.empresa.endereco}</p>
            </div>
          </header>

          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 16px; color: #2b7a78; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Cliente</h2>
            <p><strong>Nome:</strong> ${data.cliente.nome}</p>
            <p><strong>CPF:</strong> ${data.cliente.cpf}</p>
            <p><strong>Email:</strong> ${data.cliente.email} | <strong>Cel:</strong> ${data.cliente.celular}</p>
          </div>

          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 16px; color: #2b7a78; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Carro</h2>
            <p><strong>Modelo:</strong> ${data.carro.nmmodelo}</p>
            <p><strong>Cor:</strong> ${data.carro.cor}</p>
            <p><strong>Ano:</strong> ${data.carro.ano}</p>
            <p><strong>Placa:</strong> ${data.carro.placa}</p>
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

            <div style="text-align: right; font-size: 24px; font-weight: bold; color: #00df82; margin-top: 20px;">
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