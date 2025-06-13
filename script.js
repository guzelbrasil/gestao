import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
const btnToggleForm = document.getElementById('btn-toggle-form');
const saveButton = form.querySelector('.save-btn');

const itemInput = document.getElementById('item');
const descricaoInput = document.getElementById('descricao');
const quantidadeInput = document.getElementById('quantidade');
const dataInput = document.getElementById('data');
const previsaoInput = document.getElementById('previsao');
const statusInput = document.getElementById('status');

let currentEditingId = null; // Variável para armazenar o ID da solicitação sendo editada
let allSolicitacoesData = {}; // Objeto para armazenar todos os dados das solicitações para fácil acesso na edição

window.mostrarFormulario = function () {
  form.classList.toggle('hidden');
  const expanded = btnToggleForm.getAttribute('aria-expanded') === 'true';
  btnToggleForm.setAttribute('aria-expanded', String(!expanded));
  if (form.classList.contains('hidden')) {
    form.reset();
    currentEditingId = null;
    saveButton.textContent = 'Salvar Solicitação';
  }
};

function formatarData(dataISO) {
  if (!dataISO) return '';
  const partes = dataISO.split("-");
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const item = itemInput.value.trim();
  const descricao = descricaoInput.value.trim();
  const quantidade = quantidadeInput.value;
  const data = dataInput.value;
  const previsao = previsaoInput.value;
  const status = statusInput.value;

  if (!item || !descricao || !quantidade || !data || !previsao) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const solicitacaoData = { item, descricao, quantidade, data, previsao, status };

  if (currentEditingId) {
    update(ref(db, 'solicitacoes/' + currentEditingId), solicitacaoData);
  } else {
    push(ref(db, 'solicitacoes'), solicitacaoData);
  }

  form.reset();
  form.classList.add('hidden');
  btnToggleForm.setAttribute('aria-expanded', 'false');
  currentEditingId = null;
  saveButton.textContent = 'Salvar Solicitação';
});

function atualizarStatus(id, novoStatus) {
  update(ref(db, 'solicitacoes/' + id), { status: novoStatus });
}

function excluirSolicitacao(id) {
  if (confirm('Tem certeza que deseja excluir esta solicitação?')) {
    remove(ref(db, 'solicitacoes/' + id));
  }
}

function preencherFormularioParaEdicao(id) {
    const dados = allSolicitacoesData[id];

    if (!dados) {
        console.error("Dados da solicitação não encontrados para o ID:", id);
        return;
    }

    if (form.classList.contains('hidden')) {
        mostrarFormulario();
    }

    itemInput.value = dados.item;
    descricaoInput.value = dados.descricao;
    quantidadeInput.value = dados.quantidade;
    dataInput.value = dados.data;
    previsaoInput.value = dados.previsao;
    statusInput.value = dados.status;

    currentEditingId = id;
    saveButton.textContent = 'Atualizar Solicitação';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


onValue(ref(db, 'solicitacoes'), snapshot => {
  listaPendentes.innerHTML = '';
  listaConcluidas.innerHTML = '';
  allSolicitacoesData = {};

  const solicitacoes = snapshot.val();

  if (solicitacoes) {
    Object.entries(solicitacoes).forEach(([id, dados]) => {
      allSolicitacoesData[id] = dados;

      const div = document.createElement('div');
      div.className = 'solicitacao';
      div.tabIndex = 0;
      div.innerHTML = `
        <p><strong class="item-destaque"><span class="ocultar-label-item">Item - </span>${dados.item}</strong></p> <p><strong>Descrição:</strong> ${dados.descricao}</p>
        <p><strong>Quantidade:</strong> ${dados.quantidade}</p>
        <p><strong>Data da Solicitação:</strong> ${formatarData(dados.data)}</p>
        <p><strong>Previsão de Entrega:</strong> ${formatarData(dados.previsao)}</p>
        <div class="status-container">
          <strong>Status:</strong>
          <select data-id="${id}" class="status-select" aria-label="Alterar status da solicitação ${dados.item}">
            <option value="Pendente" ${dados.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
            <option value="Concluído" ${dados.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
          </select>
        </div>
        <div class="botoes-acao">
          <button class="btn-editar" data-id="${id}">Editar</button>
          <button class="btn-excluir" data-id="${id}">Excluir</button>
        </div>
      `;

      div.querySelector('.status-select').addEventListener('change', e => {
        const novoStatus = e.target.value;
        const idSolicitacao = e.target.getAttribute('data-id');
        atualizarStatus(idSolicitacao, novoStatus);
      });

      div.querySelector('.btn-editar').addEventListener('click', e => {
        const idSolicitacao = e.target.getAttribute('data-id');
        preencherFormularioParaEdicao(idSolicitacao);
      });

      div.querySelector('.btn-excluir').addEventListener('click', e => {
        const idSolicitacao = e.target.getAttribute('data-id');
        excluirSolicitacao(idSolicitacao);
      });

      if (dados.status === 'Concluído') {
        listaConcluidas.appendChild(div);
      } else {
        listaPendentes.appendChild(div);
      }
    });
  }
});