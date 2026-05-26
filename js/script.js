//  Redirecionamento
function irParaEstados() {
    try {
        window.location.href = "index.html";
    } catch (erro) {
        console.error("Erro ao redirecionar:", erro);
    }
}

//  Inicialização
document.addEventListener("DOMContentLoaded", inicializarSistema);

function inicializarSistema() {

    //  Elementos
    const selectUF = document.getElementById("selecaoUF");

    const colunaA = document.getElementById("municipios1");
    const colunaB = document.getElementById("municipios2");
    const colunaC = document.getElementById("municipios3");

    const kpiUF = document.getElementById("ufSelecionada");
    const kpiId = document.getElementById("idUf");
    const kpiTotal = document.getElementById("totalMunicipiosUF");

    const colunas = [colunaA, colunaB, colunaC];

    //  Carregar estados
    async function carregarEstados() {
        try {
            const resp = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
            const estados = await resp.json();

            estados
                .sort((a, b) => a.nome.localeCompare(b.nome)) // ordena bonito
                .forEach(estado => {

                    const option = document.createElement("option");

                    option.value = estado.sigla;
                    option.textContent = estado.sigla;

                    // 🔥 dados extras
                    option.dataset.nome = estado.nome;
                    option.dataset.id = estado.id;

                    selectUF.appendChild(option);
                });

        } catch (erro) {
            console.error("Erro ao carregar estados:", erro);
        }
    }

    // Carregar municípios
    async function carregarMunicipios(siglaUF, nomeUF) {
        try {
            const resp = await fetch(
                `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${siglaUF}/municipios`
            );

            const municipios = await resp.json();

            // 🔥 KPI total
            kpiTotal.textContent = municipios.length;

            // limpar colunas
            colunas.forEach(col => col.innerHTML = "");

            municipios.forEach((municipio, i) => {

                const item = document.createElement("div");

                item.textContent = municipio.nome;
                item.style.cursor = "pointer";

                // 🔥 clique → Google Maps
                item.addEventListener("click", () => {
                    const url = `https://www.google.com/maps/search/?api=1&query=${municipio.nome}+${siglaUF}`;
                    window.open(url, "_blank");
                });

                colunas[i % 3].appendChild(item);
            });

        } catch (erro) {
            console.error("Erro ao carregar municípios:", erro);
        }
    }

    //  Evento principal
    selectUF.addEventListener("change", (e) => {

        const option = e.target.selectedOptions[0];

        const sigla = option.value;
        const nome = option.dataset.nome;
        const id = option.dataset.id;

        
        kpiUF.textContent = nome ? `${nome} (${sigla})` : "Nenhuma";
        kpiId.textContent = id || "-";

        if (sigla) {
            carregarMunicipios(sigla, nome);
        }
    });

    //  Start
    carregarEstados();
}
