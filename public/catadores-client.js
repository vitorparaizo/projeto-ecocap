document.addEventListener('DOMContentLoaded', () => {

    const catadoresListElement = document.getElementById('catadores-list');

    async function fetchCatadores() {
        try {
            const response = await fetch('/api/catadores');
            if (!response.ok) {
                throw new Error(`Erro na rede: ${response.status}`);
            }
            const catadores = await response.json();
            renderCatadores(catadores);
        } catch (error) {
            console.error('Falha ao buscar catadores:', error);
            catadoresListElement.innerHTML = '<p style="color: red; text-align: center;">Não foi possível carregar os catadores. Tente novamente mais tarde.</p>';
        }
    }

    /**
    
     * @param {Array} catadores 
     */
    function renderCatadores(catadores) {
        catadoresListElement.innerHTML = '';

        if (!catadores || catadores.length === 0) {
            catadoresListElement.innerHTML = '<p style="text-align: center;">Nenhum catador parceiro encontrado no momento.</p>';
            return;
        }


        catadores.forEach(catador => {
            const card = document.createElement('div');
            card.className = 'catador-card';


            card.innerHTML = `
                <div class="catador-header">
                    <h2 class="catador-nome">${catador.nome}</h2>
                    <span class="catador-local">
                        <i class="fas fa-map-marker-alt"></i>
                        ${catador.endereco || 'Endereço não informado'}
                    </span>
                </div>
                
                <!-- A seção de materiais foi removida pois não existe no banco de dados.
                     Para adicioná-la, você precisaria criar uma coluna 'materiais_coletados'
                     na sua tabela 'catadores' e atualizar a API para buscá-la. -->

                <div class="catador-contato">
                    <a href="tel:${catador.telefone}">
                        <i class="fas fa-phone-alt"></i>
                        Entrar em contato
                    </a>
                </div>
            `;

            catadoresListElement.appendChild(card);
        });
    }
    
    fetchCatadores();
});
