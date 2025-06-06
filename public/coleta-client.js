document.addEventListener('DOMContentLoaded', () => {
  // Verificação inicial de login
  if (!isUsuarioLogado()) {
    alert('Por favor, faça login para agendar uma coleta.');
    window.location.href = 'login.html';
    return;
  }

  // Elementos da página
  const materiaisSelecionados = new Set();
  const materiaisInput = document.getElementById('materiais-selecionados');
  const form = document.getElementById('agendamentoForm');
  const loadingIndicator = document.getElementById('loading-indicator');
  const agendarBtn = document.getElementById('agendar-btn');

  // Funções de controle de usuário
  function isUsuarioLogado() {
    return localStorage.getItem('auth_token') && 
           localStorage.getItem('user_email') && 
           sessionStorage.getItem('is_logged_in') === 'true';
  }

  function getUsuarioLogado() {
    if (!isUsuarioLogado()) {
      window.location.href = 'login.html';
      return null;
    }
    
    return {
      email: localStorage.getItem('user_email'),
      id: localStorage.getItem('user_id')
    };
  }

  // Controle de materiais selecionados
  function atualizarMateriaisSelecionados() {
    const container = document.getElementById('materiais-selecionados-container');
    const lista = document.getElementById('materiais-selecionados-lista');
    
    if (materiaisSelecionados.size > 0) {
      lista.innerHTML = Array.from(materiaisSelecionados).map(m => 
        `<span class="material-tag">${formatarNomeMaterial(m)}</span>`
      ).join('');
      container.style.display = 'block';
      materiaisInput.value = Array.from(materiaisSelecionados).join(',');
    } else {
      container.style.display = 'none';
      materiaisInput.value = '';
    }
  }

  function formatarNomeMaterial(material) {
    const materiais = {
      'papel': 'Papel',
      'plastico': 'Plástico',
      'vidro': 'Vidro',
      'metal': 'Metal',
      'eletronicos': 'Eletrônicos',
      'organico': 'Orgânico'
    };
    return materiais[material] || material;
  }

  // Eventos de seleção de materiais
  document.querySelectorAll('.material-item').forEach(item => {
    item.addEventListener('click', function() {
      const material = this.getAttribute('data-material');
      
      if (materiaisSelecionados.has(material)) {
        materiaisSelecionados.delete(material);
        this.classList.remove('selected');
      } else {
        materiaisSelecionados.add(material);
        this.classList.add('selected');
      }
      
      atualizarMateriaisSelecionados();
    });
  });

  // Carregar endereço salvo
  function carregarEnderecoSalvo() {
    const enderecoSalvo = localStorage.getItem('enderecoSelecionado');
    if (enderecoSalvo) {
      const enderecoElement = document.getElementById('selected-address');
      const enderecoInput = document.getElementById('endereco');
      
      if (enderecoElement) enderecoElement.textContent = enderecoSalvo;
      if (enderecoInput) enderecoInput.value = enderecoSalvo;
    }
  }

  // Envio do formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const usuario = getUsuarioLogado();
    if (!usuario) return;

    // Validação
    if (materiaisSelecionados.size === 0) {
      alert('Por favor, selecione pelo menos um material para descarte.');
      return;
    }

    const endereco = document.getElementById('endereco').value;
    const dataColeta = document.getElementById('data_coleta').value;
    const horaColeta = document.getElementById('hora_coleta').value;

    if (!endereco || !dataColeta || !horaColeta) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Mostrar loading
    loadingIndicator.style.display = 'block';
    agendarBtn.disabled = true;

    try {
      const payload = {
        email: usuario.email,
        endereco: endereco,
        data_coleta: dataColeta,
        hora_coleta: horaColeta,
        materiais: Array.from(materiaisSelecionados)
      };

      const response = await fetch('/api/agendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Coleta agendada com sucesso!');
        // Resetar formulário
        materiaisSelecionados.clear();
        document.querySelectorAll('.material-item').forEach(item => {
          item.classList.remove('selected');
        });
        atualizarMateriaisSelecionados();
        form.reset();
      } else {
        throw new Error(result.error || 'Falha ao agendar coleta');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert(`Erro: ${err.message}`);
    } finally {
      loadingIndicator.style.display = 'none';
      agendarBtn.disabled = false;
    }
  });

  // Inicialização
  carregarEnderecoSalvo();
  atualizarMateriaisSelecionados();
});