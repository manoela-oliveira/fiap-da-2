import { useState } from 'react';
import './App.css';

export default function App() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [historico, setHistorico] = useState([]);

  // Função para classificar o IMC e definir a estilização
  function classificarIMC(imc) {
    if (imc < 18.5) {
      return { texto: 'Abaixo do peso', classe: 'imc-baixo' };
    } else if (imc >= 18.5 && imc <= 24.9) {
      return { texto: 'Peso normal / Adequado', classe: 'imc-normal' };
    } else if (imc >= 25 && imc <= 29.9) {
      return { texto: 'Sobrepeso', classe: 'imc-sobrepeso' };
    } else {
      return { texto: 'Obesidade', classe: 'imc-obesidade' };
    }
  }

  function handleCalcular(e) {
    e.preventDefault();
    setErro('');

    // Tratamento de pontuação (aceita vírgula ou ponto)
    let pesoNum = parseFloat(peso.toString().replace(',', '.'));
    let alturaNum = parseFloat(altura.toString().replace(',', '.'));

    // Converte centímetros para metros caso o usuário digite ex: 175 em vez de 1.75
    if (alturaNum > 3) {
      alturaNum = alturaNum / 100;
    }

    // Validações
    if (isNaN(pesoNum) || pesoNum <= 20 || pesoNum > 400) {
      setErro('Por favor, informe um peso válido entre 20kg e 400kg.');
      setResultado(null);
      return;
    }

    if (isNaN(alturaNum) || alturaNum <= 0.5 || alturaNum > 2.5) {
      setErro('Por favor, informe uma altura válida (ex: 1.70).');
      setResultado(null);
      return;
    }

    // Cálculo do IMC
    const imc = pesoNum / (alturaNum * alturaNum);
    const infoClassificacao = classificarIMC(imc);

    // Cálculo do peso ideal conforme altura
    const pesoMinIdeal = (18.5 * (alturaNum * alturaNum)).toFixed(1);
    const pesoMaxIdeal = (24.9 * (alturaNum * alturaNum)).toFixed(1);

    const novoResultado = {
      imc: imc.toFixed(2),
      classificacao: infoClassificacao.texto,
      classe: infoClassificacao.classe,
      pesoIdeal: `${pesoMinIdeal} kg - ${pesoMaxIdeal} kg`,
      data: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setResultado(novoResultado);

    // Adiciona ao histórico (máximo 4 itens mais recentes)
    setHistorico((prev) => [novoResultado, ...prev.slice(0, 3)]);
  }

  function handleLimpar() {
    setPeso('');
    setAltura('');
    setResultado(null);
    setErro('');
  }

  return (
    <main className="container">
      <h1>Calculadora de IMC</h1>

      <form onSubmit={handleCalcular}>
        <div className="input-group">
          <label htmlFor="peso">Peso corporal (kg):</label>
          <input
            type="text"
            id="peso"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            placeholder="Ex: 54.5"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="altura">Altura (m):</label>
          <input
            type="text"
            id="altura"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            placeholder="Ex: 1.68"
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" id="btn-calcular">CALCULAR</button>
          <button type="button" id="btn-limpar" onClick={handleLimpar}>LIMPAR</button>
        </div>
      </form>

      {/* Mensagem de Erro */}
      {erro && (
        <section className="resultado-container erro-validacao">
          <p>{erro}</p>
        </section>
      )}

      {/* Resultado */}
      {resultado && (
        <section className={`resultado-container ${resultado.classe}`}>
          <p>Seu IMC: <strong>{resultado.imc}</strong></p>
          <p>Classificação: <strong>{resultado.classificacao}</strong></p>
          <p className="dica-saude">
            Faixa de peso ideal: <strong>{resultado.pesoIdeal}</strong>
          </p>
        </section>
      )}

      {/* Histórico*/}
      {historico.length > 0 && (
        <div className="historico-container">
          <h3>Histórico Recente</h3>
          <ul>
            {historico.map((item, index) => (
              <li key={index}>
                <span>{item.data} - IMC {item.imc}</span>
                <span className="historico-status">({item.classificacao})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}