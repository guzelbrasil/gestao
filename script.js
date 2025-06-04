// Firebase Modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

const listaPendentes = document.getElementById('lista-solicitacoes-pendentes');
const listaConcluidas = document.getElementById('lista-solicitacoes-concluidas');
const form = document.getElementById('form-solicitacao');

window.mostrarFormulario = function () {
  form.classList.toggle('hidden');

  // Ajusta aria-expanded do botão
  const btn = document.getElementById('btn-toggle-form');
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
};

function formatarData(dataISO) {
  if (!dataISO) return '';
  const partes = dataISO.split("-");
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const item = document.getElementById('item').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const quantidade = document.getElementById('quantidade').value;
  const data = document.getElementById('data').value;
  const previsao = document.getElementById('previsao').value;
  const status = document.getElementById('status').value;

  if (!item || !descricao || !quantidade || !data || !previsao) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const novaSolicitacao = { item, descricao, quantidade, data, previsao, status };

  push(ref(db, 'solicitacoes'), novaSolicitacao);

  form.reset();
  form.classList.add('hidden');
  // Atualizar aria-expanded
  const btn = document.getElementById('btn-toggle-form');
  btn.setAttribute('aria-expanded', 'false');
});

function atualizarStatus(id, novoStatus) {
  update(ref(db, 'solicitacoes/' + id), { status: novoStatus });
}

onValue(ref(db, 'solicitacoes'), snapshot => {
  listaPendentes.innerHTML = '';
  listaConcluidas.innerHTML = '';

  const solicitacoes = snapshot.val();

  if (solicitacoes) {
    Object.entries(solicitacoes).forEach(([id, dados]) => {
      const div = document.createElement('div');
      div.className = 'solicitacao';
      div.tabIndex = 0;
      div.innerHTML = `
        <p><strong>Item:</strong> ${dados.item}</p>
        <p><strong>Descrição:</strong> ${dados.descricao}</p>
        <p><strong>Quantidade:</strong> ${dados.quantidade}</p>
        <p><strong>Data da Solicitação:</strong> ${formatarData(dados.data)}</p>
        <p><strong>Previsão de Entrega:</strong> ${formatarData(dados.previsao)}</p>
        <label>
          <strong>Status:</strong>
          <select data-id="${id}" class="status-select" aria-label="Alterar status da solicitação ${dados.item}">
            <option value="Pendente" ${dados.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
            <option value="Concluído" ${dados.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
          </select>
        </label>
      `;

      const select = div.querySelector('.status-select');
      select.addEventListener('change', e => {
        const novoStatus = e.target.value;
        const idSolicitacao = e.target.getAttribute('data-id');
        atualizarStatus(idSolicitacao, novoStatus);
      });

      if (dados.status === 'Concluído') {
        listaConcluidas.appendChild(div);
      } else {
        listaPendentes.appendChild(div);
      }
    });
  }
});