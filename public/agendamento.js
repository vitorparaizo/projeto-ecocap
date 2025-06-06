document.addEventListener('DOMContentLoaded', function() {
    // Configura a data mínima como hoje
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('coleta-date').min = today;
    
    // Obtém os parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const address = urlParams.get('address') || 'Selecione um local no mapa';
    const pontoColeta = urlParams.get('ponto') || '';
    
    // Preenche os campos de endereço
    document.getElementById('selected-address').textContent = address;
    document.getElementById('ponto-coleta').value = pontoColeta;
    
    // Adiciona eventos de clique nos materiais
    document.querySelectorAll('.material-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });
    
    // Evento para o botão de agendar
    document.getElementById('agendar-btn').addEventListener('click', agendarColeta);
});

async function agendarColeta() {
    // Obtém os materiais selecionados
    const selectedMaterials = Array.from(document.querySelectorAll('.material-item.selected'))
        .map(item => item.getAttribute('data-material'));
    
    if(selectedMaterials.length === 0) {
        alert('Por favor, selecione pelo menos um tipo de material para descarte.');
        return;
    }
    
    const date = document.getElementById('coleta-date').value;
    const time = document.getElementById('coleta-time').value;
    
    if(!date || !time) {
        alert('Por favor, selecione uma data e horário para a coleta.');
        return;
    }
    
    const address = document.getElementById('selected-address').textContent;
    const pontoColeta = document.getElementById('ponto-coleta').value;
    
    // Obter ID do usuário (simulado - na prática viria da sessão)
    const usuarioId = 1; // Substituir por ID real do usuário logado
    
    // Dados para enviar ao servidor
    const agendamentoData = {
        usuario_id: usuarioId,
        materiais: selectedMaterials,
        data_coleta: date,
        hora_coleta: time,
        endereco: address,
        ponto_coleta: pontoColeta
    };
    
    try {
        // Envia os dados para o servidor
        const response = await fetch('api/agendamentos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(agendamentoData)
        });
        
        const result = await response.json();
        
        if(response.ok) {
            alert('Coleta agendada com sucesso!');
            // Redireciona para a página de confirmação ou histórico
            window.location.href = 'agendamentos.html';
        } else {
            throw new Error(result.message || 'Erro ao agendar coleta');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao agendar a coleta. Por favor, tente novamente.');
    }
}