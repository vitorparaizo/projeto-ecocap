document.addEventListener('DOMContentLoaded', () => {
  // Inicializa materiais selecionados
  const materiaisSelecionados = new Set();
  const materiaisInput = document.getElementById('materiais-selecionados');
  const form = document.getElementById('agendamentoForm');
  const loadingIndicator = document.getElementById('loading-indicator');
  const agendarBtn = document.getElementById('agendar-btn');

  // Função para obter usuário logado
  function getUsuarioLogado() {
    // Implementação de exemplo - substitua pela sua lógica de autenticação
    const usuario = {
      email: localStorage.getItem('userEmail') || 'usuario@exemplo.com',
      id: localStorage.getItem('userId') || '1'
    };
    return usuario;
  }

  // Atualiza a exibição dos materiais selecionados
  function atualizarMateriaisSelecionados() {
    const container = document.getElementById('materiais-selecionados-container');
    const lista = document.getElementById('materiais-selecionados-lista');
    
    if (materiaisSelecionados.size > 0) {
      lista.innerHTML = Array.from(materiaisSelecionados).map(m => 
        `<span class="material-tag">${formatarNomeMaterial(m)}</span>`
      ).join('');
      container.classList.add('visible');
      materiaisInput.value = Array.from(materiaisSelecionados).join(',');
    } else {
      container.classList.remove('visible');
      materiaisInput.value = '';
    }
  }

  // Formata o nome do material para exibição
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

  // Formata a data para o padrão do backend (YYYY-MM-DD)
  function formatarDataParaBackend(dataString) {
    if (!dataString) return '';
    // Converte de YYYY-MM-DD (formato do input date) para o formato do backend
    return dataString; // Já está no formato correto
  }

  // Adiciona evento de clique nos materiais
  document.querySelectorAll('.material-item').forEach(item => {
    item.addEventListener('click', () => {
      const material = item.getAttribute('data-material');
      
      if (materiaisSelecionados.has(material)) {
        materiaisSelecionados.delete(material);
        item.classList.remove('selected');
      } else {
        materiaisSelecionados.add(material);
        item.classList.add('selected');
      }
      
      atualizarMateriaisSelecionados();
    });
  });

  // Carrega endereço salvo (se existir)
  function carregarEnderecoSalvo() {
    const enderecoSalvo = localStorage.getItem('enderecoSelecionado');
    if (enderecoSalvo) {
      document.getElementById('selected-address').textContent = enderecoSalvo;
      document.getElementById('endereco').value = enderecoSalvo;
    }
  }

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const usuario = getUsuarioLogado();
    if (!usuario || !usuario.email) {
      alert('Por favor, faça login antes de agendar uma coleta.');
      window.location.href = 'login.html';
      return;
    }

    // Valida se pelo menos um material foi selecionado
    if (materiaisSelecionados.size === 0) {
      alert('Por favor, selecione pelo menos um material para descarte.');
      return;
    }

    // Mostra loading
    loadingIndicator.style.display = 'block';
    agendarBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const payload = {
        email: usuario.email,
        endereco: formData.get('endereco'),
        data_coleta: formatarDataParaBackend(formData.get('data_coleta')),
        hora_coleta: formData.get('hora_coleta'),
        materiais: formData.get('materiais')
      };

      const response = await fetch('/api/agendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Coleta agendada com sucesso!');
        // Limpa seleção
        document.querySelectorAll('.material-item').forEach(item => {
          item.classList.remove('selected');
        });
        materiaisSelecionados.clear();
        atualizarMateriaisSelecionados();
        form.reset();
      } else {
        console.error('Erro no agendamento:', result);
        alert(`Erro: ${result.error || 'Falha ao agendar coleta'}`);
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      alert('Erro ao conectar com o servidor. Por favor, tente novamente.');
    } finally {
      loadingIndicator.style.display = 'none';
      agendarBtn.disabled = false;
    }
  });

  // Inicializa a página
  carregarEnderecoSalvo();
});