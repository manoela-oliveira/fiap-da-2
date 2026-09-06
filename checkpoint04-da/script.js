const inputPotencia = document.getElementById('potencia');
const inputHoras = document.getElementById('horas');
const inputDias = document.getElementById('dias');

const btnCalcular = document.getElementById('btn-calcular');
const btnLimpar = document.getElementById('btn-limpar');
const areaResultado = document.getElementById('resultado');

// Função de validação dos campos
function validarCampos(potencia, horas, dias) {
    if (isNaN(potencia) || potencia <= 0) {
        return "Por favor, insira um valor válido e maior que zero para a Potência.";
    }
    if (isNaN(horas) || horas <= 0 || horas > 24) {
        return "As horas de utilização por dia devem ser um número entre 0.1 e 24.";
    }
    if (isNaN(dias) || dias <= 0 || dias > 31) {
        return "O número de dias de utilização deve ser um número entre 1 e 31.";
    }
    return null;
}

// Função para definir a classificação baseada no consumo
function obterClasseConsumo(consumo) {
    if (consumo <= 30) {
        return { texto: "Baixo", classe: "consumo-baixo" };
    } else if (consumo > 30 && consumo <= 100) {
        return { texto: "Moderado", classe: "consumo-moderado" };
    } else if (consumo > 100 && consumo <= 200) {
        return { texto: "Alto", classe: "consumo-alto" };
    } else {
        return { texto: "Muito Alto", classe: "consumo-muito-alto" };
    }
}

function limparClassesResultado() {
    areaResultado.className = "resultado-container hidden";
}

// Função de cálculo principal
function calcularConsumo() {
    const potencia = parseFloat(inputPotencia.value);
    const horas = parseFloat(inputHoras.value);
    const dias = parseInt(inputDias.value, 10);

    const erro = validarCampos(potencia, horas, dias);

    limparClassesResultado();

    if (erro) {
        areaResultado.innerHTML = `<p>${erro}</p>`;
        areaResultado.classList.add('erro-validacao');
        areaResultado.classList.remove('hidden');
        return;
    }

    const consumoKwh = (potencia * horas * dias) / 1000;

    const classificacaoInfo = obterClasseConsumo(consumoKwh);

    // Exibição do resultado
    areaResultado.innerHTML = `
        <p>Consumo mensal: <strong>${consumoKwh.toFixed(2)} kWh</strong></p>
        <p>Classificação: <strong>${classificacaoInfo.texto}</strong></p>
    `;
    
    areaResultado.classList.add(classificacaoInfo.classe);
    areaResultado.classList.remove('hidden');
}

// Função para limpar os campos e a área de resultados
function limparFormulario() {
    inputPotencia.value = "";
    inputHoras.value = "";
    inputDias.value = "";
    limparClassesResultado();
    areaResultado.innerHTML = "";
}

btnCalcular.addEventListener('click', calcularConsumo);
btnLimpar.addEventListener('click', limparFormulario);