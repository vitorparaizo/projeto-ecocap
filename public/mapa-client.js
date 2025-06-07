
document.addEventListener('DOMContentLoaded', () => {
    const recifeCenter = [-8.0522, -34.9286];
    const map = L.map('map').setView(recifeCenter, 13);
    const locationList = document.getElementById('location-list');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    async function fetchPontosDeColeta() {
        try {
            console.log('Iniciando busca por pontos de coleta...');
            const response = await fetch('/api/pontos-coleta');
            console.log('Resposta da API recebida:', response);

            if (!response.ok) {
                throw new Error(`Falha na rede: Status ${response.status} - ${response.statusText}`);
            }
            
            const pontos = await response.json();
            

            console.log('Dados recebidos e processados como JSON:', pontos);
            
            renderizarPontos(pontos);
        } catch (error) {
            console.error('Erro detalhado ao buscar pontos de coleta:', error);
            locationList.innerHTML = '<p style="color: red; text-align: center;">Não foi possível carregar os pontos. Verifique o console (F12) para mais detalhes.</p>';
        }
    }

    function renderizarPontos(pontos) {
        locationList.innerHTML = ''; 

        if (!pontos || pontos.length === 0) {
            console.warn('Nenhum ponto de coleta encontrado para renderizar.');
            locationList.innerHTML = '<p style="text-align: center;">Nenhum ponto de coleta encontrado.</p>';
            return;
        }

        pontos.forEach(ponto => {

            if (ponto.latitude == null || ponto.longitude == null) {
                console.warn('Ponto de coleta descartado por não ter coordenadas válidas:', ponto);
                return;
            }

            const marker = L.marker([ponto.latitude, ponto.longitude])
                .addTo(map)
                .bindPopup(`<b>${ponto.nome}</b><br>${ponto.endereco}<br><br><b>Horário:</b> ${ponto.horario_funcionamento || 'Não informado'}<br><b>Telefone:</b> ${ponto.telefone || 'Não informado'}`);

            const itemDiv = document.createElement('div');
            itemDiv.className = 'location-item-dynamic';
            itemDiv.innerHTML = `
                <div class="location-details">
                    <strong>${ponto.nome}</strong>
                    <p>${ponto.descricao || ''}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${ponto.endereco}</p>
                    <p><i class="fas fa-clock"></i> ${ponto.horario_funcionamento || 'Não informado'}</p>
                    <p><i class="fas fa-phone"></i> ${ponto.telefone || 'Não informado'}</p>
                </div>
                <button class="select-btn">Agendar Coleta Neste Endereço</button>
            `;
            
            locationList.appendChild(itemDiv);
            
            const selectButton = itemDiv.querySelector('.select-btn');
            selectButton.addEventListener('click', () => {
                localStorage.setItem('enderecoSelecionado', ponto.endereco);
                alert(`Endereço selecionado com sucesso!\n\n${ponto.endereco}\n\nVocê será redirecionado para a página de agendamento.`);
                window.location.href = 'coleta.html';
            });

            const detailsDiv = itemDiv.querySelector('.location-details');
            detailsDiv.addEventListener('click', () => {
                map.flyTo([ponto.latitude, ponto.longitude], 16);
                marker.openPopup();
            });
        });
    }

    fetchPontosDeColeta();
});