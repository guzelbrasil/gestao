// Referência ao banco de dados
const db = firebase.database();
const lista = document.getElementById('lista-solicitacoes');
const form = document.getElementById('form-solicitacao');

function mostrarFormulario() {
  form.classList.toggle('hidden');
}

// Função para formatar data dd-mm-aaaa
function formatarData(dataISO) {
  const partes = dataISO.split("-");
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
}

// Enviar dados ao Firebase
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const item = document.getElementById('item').value;
  const descricao = document.getElementById('descricao').value;
  const quantidade = document.getElementById('quantidade').value;
  const data = document.getElementById('data').value;
  const previsao = document.getElementById('previsao').value;
  const status = document.getElementById('status').value;

  const novaSolicitacao = {
    item,
    descricao,
    quantidade,
    data,
    previsao,
    status
  };

  // Push no Realtime Database
  db.ref('solicitacoes').push(novaSolicitacao);

  form.reset();
  form.classList.add('hidden');
});

// Monitorar em tempo real
db.ref('solicitacoes').on('value', snapshot => {
  lista.innerHTML = ''; // Limpa antes de re-renderizar
  const solicitacoes = snapshot.val();

  if (solicitacoes) {
    Object.entries(solicitacoes).forEach(([id, dados]) => {
      const div = document.createElement('div');
      div.className = 'solicitacao';
      div.innerHTML = `
        <p><strong>Item:</strong> ${dados.item}</p>
        <p><strong>Descrição:</strong> ${dados.descricao}</p>
        <p><strong>Quantidade:</strong> ${dados.quantidade}</p>
        <p><strong>Data da Solicitação:</strong> ${formatarData(dados.data)}</p>
        <p><strong>Previsão de Entrega:</strong> ${formatarData(dados.previsao)}</p>
        <p><strong>Status:</strong> ${dados.status}</p>
      `;
      lista.appendChild(div);
    });
  }
});
