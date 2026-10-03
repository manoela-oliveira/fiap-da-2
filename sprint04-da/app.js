// Configuração dos pontos de sensoriamento com dados fictícios
const pontosMonitorados = [
    { id: 1, nome: "Trecho Serra - KM 10", lat: -23.5112, lng: -46.5891, vegHeight: 8, topografia: "Plano", soloSaturado: false, acumulado24h: 15 },
    { id: 2, nome: "Trecho Serra - KM 28", lat: -23.4755, lng: -46.4560, vegHeight: 14, topografia: "Encosta", soloSaturado: true, acumulado24h: 120 },
    { id: 3, nome: "Trecho Dutra - KM 45", lat: -23.4124, lng: -46.3211, vegHeight: 31, topografia: "Plano", soloSaturado: false, acumulado24h: 5 }, 
    { id: 4, nome: "Trecho Dutra - KM 62", lat: -23.3645, lng: -46.1852, vegHeight: 7, topografia: "Plano", soloSaturado: false, acumulado24h: 0 },
    { id: 5, nome: "Trecho Serra - KM 80", lat: -23.3101, lng: -46.0125, vegHeight: 25, topografia: "Encosta", soloSaturado: false, acumulado24h: 40 },
    { id: 6, nome: "Trecho Dutra - KM 95", lat: -23.2212, lng: -45.9014, vegHeight: 32, topografia: "Plano", soloSaturado: false, acumulado24h: 12 },
    { id: 7, nome: "Trecho Dutra - KM 110", lat: -23.1895, lng: -45.8550, vegHeight: 9, topografia: "Plano", soloSaturado: false, acumulado24h: 0 },
    { id: 8, nome: "Trecho Serra - KM 125", lat: -23.1114, lng: -45.7121, vegHeight: 18, topografia: "Encosta", soloSaturado: true, acumulado24h: 140 },
    { id: 9, nome: "Trecho Dutra - KM 140", lat: -23.0255, lng: -45.5560, vegHeight: 5, topografia: "Plano", soloSaturado: false, acumulado24h: 0 },
    { id: 10, nome: "Trecho Serra - KM 160", lat: -22.9511, lng: -45.4212, vegHeight: 29, topografia: "Encosta", soloSaturado: false, acumulado24h: 90 }
];

let map;
let markers = {};

function classificarVegetacao(height) {
    if (height < 11) {
        return { label: "Normal", classe: "status-normal", corIcone: "#22c55e", acao: "Acompanhar crescimento", prioridade: 1 };
    } else if (height < 20) {
        return { label: "Atenção", classe: "status-atencao", corIcone: "#eab308", acao: "Planejar vistoria", prioridade: 2 };
    } else if (height < 30) {
        return { label: "Risco", classe: "status-risco", corIcone: "#fd9813", acao: "Agendar roçada", prioridade: 3 };
    } else {
        return { label: "Crítico", classe: "status-critico", corIcone: "#ef4444", acao: "Roçada imediata", prioridade: 4 };
    }
}

function inicializarMapa() {
    map = L.map('map').setView([-23.25, -45.95], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

async function obterDadosClimaticos(lat, lng) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m,precipitation`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro na API");
        const data = await response.json();
        return data.current;
    } catch (error) {
        console.error("Falha ao obter dados climáticos:", error);
        return null;
    }
}

function avaliarRiscoDeslizamento(ponto, clima) {
    const chuvaAtual = clima ? clima.precipitation : 0;
    if (ponto.topografia === "Encosta" && (chuvaAtual > 2.0 || ponto.soloSaturado || ponto.acumulado24h >= 100)) {
        return true;
    }
    return false;
}

async function processarDadosDashboard() {
    const listaContainer = document.getElementById("lista-pontos");
    listaContainer.innerHTML = "";

    let contadores = { normal: 0, atencao: 0, risco: 0, critico: 0, deslizamento: 0 };

    // Processamento de dados utilizando map()
    const dadosProcessados = await Promise.all(pontosMonitorados.map(async (ponto) => {
        const clima = await obterDadosClimaticos(ponto.lat, ponto.lng);
        const statusVeg = classificarVegetacao(ponto.vegHeight);
        const temRiscoDeslizamento = avaliarRiscoDeslizamento(ponto, clima);
        
        // Define peso final para ordenação (Deslizamento tem prioridade máxima = 5)
        const prioridadeFinal = temRiscoDeslizamento ? 5 : statusVeg.prioridade;

        return { ...ponto, clima, statusVeg, temRiscoDeslizamento, prioridadeFinal };
    }));

    // Ordenação (destacando maior prioridade no topo da lista) usando sort()
    dadosProcessados.sort((a, b) => b.prioridadeFinal - a.prioridadeFinal);

    // Iteração final para popular a UI utilizando forEach()
    dadosProcessados.forEach(dado => {
        // Atualiza contadores
        if (dado.statusVeg.label === "Normal") contadores.normal++;
        else if (dado.statusVeg.label === "Atenção") contadores.atencao++;
        else if (dado.statusVeg.label === "Risco") contadores.risco++;
        else if (dado.statusVeg.label === "Crítico") contadores.critico++;

        if (dado.temRiscoDeslizamento) contadores.deslizamento++;

        adicionarMarcadorMapa(dado, dado.statusVeg, dado.clima, dado.temRiscoDeslizamento);
        criarCardPonto(dado, dado.statusVeg, dado.clima, dado.temRiscoDeslizamento);
    });

    // Atualiza contadores do dashboard
    document.getElementById("qtd-normal").textContent = contadores.normal;
    document.getElementById("qtd-atencao").textContent = contadores.atencao;
    document.getElementById("qtd-risco").textContent = contadores.risco;
    document.getElementById("qtd-critico").textContent = contadores.critico;
    document.getElementById("qtd-deslizamento").textContent = contadores.deslizamento;
    
    atualizarMensagemSeguranca(contadores.deslizamento);
}

function atualizarMensagemSeguranca(quantidadeRisco) {
    const containerSeguranca = document.getElementById("container-seguranca");
    const textoSeguranca = document.getElementById("texto-seguranca");

    if (quantidadeRisco > 0) {
        containerSeguranca.classList.add("perigo-ativo");
        textoSeguranca.innerHTML = `Detectamos trechos de encosta sob alto risco de deslizamento devido ao acúmulo de chuvas. <strong>Não realizar envio de equipes de manutenção para estas áreas</strong> a fim de garantir sua integridade física.`;
    } else {
        containerSeguranca.classList.remove("perigo-ativo");
        textoSeguranca.innerHTML = `Todas as encostas apresentam índices de umidade estáveis. O envio de equipes de manutenção está autorizado sob os parâmetros habituais de segurança.`;
    }
}

function adicionarMarcadorMapa(ponto, statusVeg, clima, temRiscoDeslizamento) {
    const tempTexto = clima ? `${clima.temperature_2m}°C` : "N/D";
    const ventoTexto = clima ? `${clima.wind_speed_10m} km/h` : "N/D";
    const chuvaTexto = clima ? `${clima.precipitation} mm` : "N/D";

    const corMarcador = temRiscoDeslizamento ? "#961100" : statusVeg.corIcone;

    const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${corMarcador}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });

    const marker = L.marker([ponto.lat, ponto.lng], { icon: customIcon }).addTo(map);
    
    const popupConteudo = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 180px;">
            <strong style="color: #13b959; font-size:13px;">${ponto.nome}</strong><br>
            <span style="font-size:10px; color:#64748b;">Topografia: ${ponto.topografia}</span>
            <hr style="margin: 6px 0; border: none; border-top: 1px solid #e2e8f0;">
            <strong>Vegetação:</strong> ${ponto.vegHeight} cm <br>
            <strong style="color: ${statusVeg.corIcone};">Ação: ${statusVeg.acao}</strong><br>
            <strong>Chuva Atual:</strong> ${chuvaTexto} <br>
            <strong>Acumulado 24h:</strong> ${ponto.acumulado24h} mm <br>
            <strong>Temperatura:</strong> ${tempTexto}<br>
            <strong>Vento:</strong> ${ventoTexto}
            ${temRiscoDeslizamento ? `<div style="color: #be123c; font-weight: bold; margin-top: 5px; font-size: 11px;">⚠️ ALERTA: PROIBIDO O ENVIO DE EQUIPES</div>` : ''}
        </div>
    `;
    
    marker.bindPopup(popupConteudo);
    markers[ponto.id] = marker;
}

function criarCardPonto(ponto, statusVeg, clima, temRiscoDeslizamento) {
    const listaContainer = document.getElementById("lista-pontos");

    const card = document.createElement("div");
    card.className = "card-ponto";
    card.setAttribute("data-id", ponto.id);

    const tempTexto = clima ? `${clima.temperature_2m} °C` : "Indisponível";
    const ventoTexto = clima ? `${clima.wind_speed_10m} km/h` : "Indisponível";
    const chuvaTexto = clima ? `${clima.precipitation} mm` : "Indisponível";

    let alertaVisual = "";
    if (temRiscoDeslizamento) {
        alertaVisual = `
            <div class="alerta-deslizamento">
                ALERTA: Solo saturado (${ponto.acumulado24h}mm). Suspender equipes de manutenção no local.
            </div>
        `;
    }

    card.innerHTML = `
        <div class="card-ponto-header">
            <span class="card-ponto-nome">${ponto.nome}</span>
            <span class="badge-status ${temRiscoDeslizamento ? 'status-deslizamento-badge' : statusVeg.classe}">
                ${temRiscoDeslizamento ? 'Alerta de Risco' : statusVeg.label}
            </span>
        </div>
        <div class="card-ponto-dados">
            <div class="info-linha">
                <span>Topografia:</span>
                <strong>${ponto.topografia}</strong>
            </div>
            <div class="info-linha">
                <span>Altura da Vegetação:</span>
                <strong>${ponto.vegHeight} cm</strong>
            </div>
            <div class="info-linha destaque-acao">
                <span>Ação Recomendada:</span>
                <strong style="color: ${statusVeg.corIcone};">${statusVeg.acao}</strong>
            </div>
            <div class="clima-detalhes">
                <div class="info-linha">
                    <span>Precipitação Atual:</span>
                    <strong>${chuvaTexto}</strong>
                </div>
                <div class="info-linha">
                    <span>Acumulado 24h:</span>
                    <strong>${ponto.acumulado24h} mm</strong>
                </div>
                <div class="info-linha">
                    <span>Vento / Temperatura:</span>
                    <span>${ventoTexto} / ${tempTexto}</span>
                </div>
                ${alertaVisual}
            </div>
        </div>
    `;

    card.addEventListener("click", () => {
        document.querySelectorAll(".card-ponto").forEach(c => c.classList.remove("selecionado"));
        card.classList.add("selecionado");
        map.setView([ponto.lat, ponto.lng], 12);
        markers[ponto.id].openPopup();
    });

    listaContainer.appendChild(card);
}

window.addEventListener("DOMContentLoaded", () => {
    inicializarMapa();
    processarDadosDashboard();
});