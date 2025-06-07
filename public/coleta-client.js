document.addEventListener('DOMContentLoaded', () => {
  const authToken = localStorage.getItem('auth_token');


  if (!authToken) {
    alert('Por favor, faça login para agendar uma coleta.');
    window.location.href = 'telaLogin.html';
    return;
  }

  const form = document.getElementById('agendamentoForm');
  const loadingIndicator = document.getElementById('loading-indicator');
  const agendarBtn = document.getElementById('agendar-btn');
  const materiaisSelecionados = new Set();

  /**
   * Define a data mínima para o input de data como sendo hoje.
   * Impede que o usuário selecione datas passadas.
   */
  function configurarDataMinima() {
    const dataInput = document.getElementById('data_coleta');
    if (dataInput) {
      const hoje = new Date();
      const timezoneOffset = hoje.getTimezoneOffset() * 60000; // Offset em milissegundos
      const dataLocal = new Date(hoje.getTime() - timezoneOffset);
      const dataParaInput = dataLocal.toISOString().split('T')[0];
      dataInput.min = dataParaInput;
    }
  }

  /**
   * Carrega o endereço salvo no localStorage e exibe na página.
   */
  function carregarEnderecoSalvo() {
    const enderecoSalvo = localStorage.getItem('enderecoSelecionado');
    const enderecoElement = document.getElementById('selected-address');
    const enderecoInput = document.getElementById('endereco');

    if (enderecoSalvo && enderecoElement && enderecoInput) {
      enderecoElement.textContent = enderecoSalvo;
      enderecoInput.value = enderecoSalvo;
    } else if (enderecoElement) {
      enderecoElement.innerHTML = 'Nenhum endereço selecionado. <br>Por favor, <a href="mapa.html" style="color: #2e7d32; font-weight: bold;">selecione um local no mapa</a>.';
      if (enderecoInput) enderecoInput.value = '';
    }
  }

  // Adiciona o evento de clique para os itens de material
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
    });
  });

  // Adiciona o evento de submit para o formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (materiaisSelecionados.size === 0) {
      alert('Por favor, selecione pelo menos um material.');
      return;
    }
    
    const endereco = document.getElementById('endereco').value;
    if (!endereco) {
      alert('Por favor, selecione um endereço de coleta no mapa.');
      return;
    }

    const dataColeta = document.getElementById('data_coleta').value;
    const horaColeta = document.getElementById('hora_coleta').value;
    if (!dataColeta || !horaColeta) {
      alert('Por favor, preencha a data e a hora da coleta.');
      return;
    }

    loadingIndicator.style.display = 'block';
    agendarBtn.disabled = true;

    try {
      const payload = {
        endereco: endereco,
        data_coleta: dataColeta,
        hora_coleta: horaColeta,
        materiais: Array.from(materiaisSelecionados)
      };

      const response = await fetch('/api/agendar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Coleta agendada com sucesso!');
        localStorage.removeItem('enderecoSelecionado'); // Limpa o endereço para o próximo agendamento
        form.reset();
        document.querySelectorAll('.material-item').forEach(item => item.classList.remove('selected'));
        materiaisSelecionados.clear();
        carregarEnderecoSalvo(); // Atualiza a exibição do endereço
      } else {
        throw new Error(result.error || result.details || 'Falha ao agendar coleta');
      }
    } catch (err) {
      console.error('Erro ao agendar:', err);
      alert(`Erro: ${err.message}`);
    } finally {
      loadingIndicator.style.display = 'none';
      agendarBtn.disabled = false;
    }
  });

  // Funções que rodam assim que a página carrega
  carregarEnderecoSalvo();
  configurarDataMinima();
});
