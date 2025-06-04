<!-- Firebase Modular SDK -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAr8neQIrg-jfF9rxWdyqCkhsHMlMQA7jM",
    authDomain: "gestao-d2d90.firebaseapp.com",
    projectId: "gestao-d2d90",
    storageBucket: "gestao-d2d90.appspot.com",
    messagingSenderId: "658884471287",
    appId: "1:658884471287:web:0e391bc3cf740f4fcce6f2",
    measurementId: "G-CLW51ED6H6",
    databaseURL: "https://gestao-d2d90-default-rtdb.firebaseio.com"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const lista = document.getElementById('lista-solicitacoes');
  const form = document.getElementById('form-solicitacao');

  function mostrarFormulario() {
    form.classList.toggle('hidden');
  }

  window.mostrarFormulario = mostrarFormulario; // Permite usar no botão HTML

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

    push(ref(db, 'solicitacoes'), novaSolicitacao);

    form.reset();
    form.classList.add('hidden');
  });

  // Monitorar em tempo real
  const solicitacoesRef = ref(db, 'solicitacoes');
  onValue(solicitacoesRef, snapshot => {
    lista.innerHTML = '';
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
</script>
