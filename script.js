const lista = document.getElementById('lista-solicitacoes');
const form = document.getElementById('form-solicitacao');

function mostrarFormulario() {
  form.classList.toggle('hidden');
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const item = document.getElementById('item').value;
  const descricao = document.getElementById('descricao').value;
  const quantidade = document.getElementById('quantidade').value;
  const data = formatarData(document.getElementById('data').value);
  const previsao = formatarData(document.getElementById('previsao').value);
  const status = document.getElementById('status').value;

  const div = document.createElement('div');
  div.className = 'solicitacao';
  div.innerHTML = `
    <p><strong>Item:</strong> ${item}</p>
    <p><strong>Descrição:</strong> ${descricao}</p>
    <p><strong>Quantidade:</strong> ${quantidade}</p>
    <p><strong>Data da Solicitação:</strong> ${data}</p>
    <p><strong>Previsão de Entrega:</strong> ${previsao}</p>
    <p><strong>Status:</strong> ${status}</p>
  `;

  lista.appendChild(div);
  form.reset();
  form.classList.add('hidden');
});

function formatarData(dataStr) {
  const [ano, mes, dia] = dataStr.split("-");
  return `${dia}-${mes}-${ano}`;
}
