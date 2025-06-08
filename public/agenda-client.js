document.addEventListener('DOMContentLoaded', () => {

    const agendaListElement = document.getElementById('agenda-list');
    const authToken = localStorage.getItem('auth_token');

    // Se não houver token, o usuário não está logado. Redireciona.
    if (!authToken) {
        alert('Você precisa estar logado para ver seus agendamentos.');
        window.location.href = '/'; // Volta para a tela de login
        return;
    }

    /**
     * Busca os agendamentos do usuário logado na API.
     */
    async function fetchAgendamentos() {
        try {
            const response = await fetch('/api/agenda', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response.ok) {
                // Se o token for inválido, o servidor retornará 401
                if (response.status === 401) {
                    throw new Error('Sua sessão expirou. Por favor, faça login novamente.');
                }
                throw new Error(`Erro na rede: ${response.status}`);
            }
            const agendamentos = await response.json();
            renderAgendamentos(agendamentos);
        } catch (error) {
            console.error('Falha ao buscar agendamentos:', error);
            agendaListElement.innerHTML = `<p style="color: red; text-align: center;">${error.message}</p>`;
        }
    }

    /**
     * Formata a data para um formato mais legível (DD/MM/AAAA).
     * @param {string} dataString - A data no formato AAAA-MM-DD.
     * @returns {string} - A data formatada.
     */
    function formatarData(dataString) {
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    /**
     * Renderiza a lista de agendamentos na página.
     * @param {Array} agendamentos - Um array de objetos de agendamento.
     */
    function renderAgendamentos(agendamentos) {
        agendaListElement.innerHTML = '';

        if (!agendamentos || agendamentos.length === 0) {
            agendaListElement.innerHTML = '<p style="text-align: center;">Você ainda não tem coletas agendadas.</p>';
            return;
        }

        agendamentos.forEach(agendamento => {
            const card = document.createElement('div');
            // Adiciona a classe de status para a cor da borda
            card.className = `agenda-card status-${agendamento.status}`;

            const materiaisList = agendamento.materiais.join(', ');

            card.innerHTML = `
                <div class="agenda-header">
                    <span class="data-hora">${formatarData(agendamento.data_coleta)} às ${agendamento.hora_coleta.substring(0, 5)}</span>
                    <span class="status-tag">${agendamento.status}</span>
                </div>
                <div class="agenda-body">
                    <p class="endereco">
                        <i class="fas fa-map-marker-alt"></i>
                        <span><strong>Local:</strong> ${agendamento.endereco}</span>
                    </p>
                    <p class="materiais">
                         <i class="fas fa-recycle"></i>
                        <span><strong>Materiais:</strong> ${materiaisList}</span>
                    </p>
                </div>
            `;
            agendaListElement.appendChild(card);
        });
    }

    fetchAgendamentos();
});
