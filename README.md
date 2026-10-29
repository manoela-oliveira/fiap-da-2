# FIAP - Desenvolvimento de Aplicações (2º Semestre)

> **Professor:** Allan Roberto Molto

---

### Tecnologias Utilizadas
<p>
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=git,html,css,js" />
  </a>
</p>

### Tópicos Avaliados
<ul>
  <li><strong>Manipulação do DOM e Eventos:</strong> Captura e validação de inputs, escuta de eventos de clique e renderização dinâmica sem reload da página.</li>
  <li><strong>Lógica e Regras de Negócio:</strong> Cálculos matemáticos, estruturas condicionais e faixas de classificação dinâmica com estilização via CSS.</li>
  <li><strong>Estruturas de Dados e Iteração:</strong> Organização de dados em arrays de objetos e processamento com métodos como <code>map</code> e <code>forEach</code></li>
  <li><strong>Desenvolvimento em React:</strong> Componentização, manipulação de estado, customização de layout e responsividade.</li>
  <li><strong>Tomada de Decisão e UX/UI:</strong> Criação de dashboards funcionais para priorização de atendimentos operacionais.</li>
</ul>

### Organização de arquivos
```
fiap-da-2/   
  ├── checkpoint4-da/
  │   ├── index.html
  │   ├── script.js
  │   └── style.css      
  ├── checkpoint5-da/
  │   ├── src/
  │   │   ├── App.css
  │   │   ├── App.jsx
  │   │   └── main.jsx
  │   ├── .gitignore
  │   ├── index.html
  │   ├── package-lock.json  
  │   └── package.json     
  └── sprint4-da/
       ├── assets/
       ├── app.js
       ├── index.html
       └── style.css    
```

---

## Detalhes das Atividades

### Checkpoint 4 (CP4)

**Descrição da Atividade:**
Desenvolvimento de uma **Calculadora de Consumo de Energia Elétrica** web utilizando HTML5, CSS3 e JavaScript puro:
* **Entrada de Dados:** Potência do equipamento (W), horas de uso por dia e dias de utilização no mês.
* **Cálculo de Consumo:** Aplicação da fórmula `Consumo (kWh) = (Potência × Horas × Dias) / 1000`.
* **Classificação Dinâmica:**
  * Até 30 kWh → *Consumo Baixo*
  * Acima de 30 até 100 kWh → *Consumo Moderado*
  * Acima de 100 até 200 kWh → *Consumo Alto*
  * Acima de 200 kWh → *Consumo Muito Alto*
* **Manipulação do DOM e Validação:** Validação contra campos em branco ou inválidos, apresentação dos resultados diretamente na interface com feedback visual por CSS (sem uso de `alert()`), e botão para limpar campos e histórico de consulta.

**Demonstração da Entrega:**
<p>
  <img/>

---

### Checkpoint 5 (CP5)

**Descrição da Atividade:**
Evolução e customização de uma **Calculadora de IMC (Índice de Massa Corporal)** desenvolvida em **React**:
* **Aprimoramento de Layout:** Redesenho completo da interface (cores, fontes e layout responsivo) via CSS moderno.
* **Novas Funcionalidades:** Implementação de recursos adicionais (ex.: faixas de peso ideal, histórico de consultas locais, detalhamento visual da categoria do IMC).
* **Estrutura React:** Gerenciamento de estado (`useState`) para captura dinâmica dos dados de peso/altura e renderização condicional do resultado.

**Demonstração da Entrega:**
<p>
  <img>

---

### Sprint 4

**Descrição da Atividade:**
Evolução do sistema de **Monitoramento de Vegetação em Rodovias** para auxílio à tomada de decisão de equipes de manutenção:
* **Estrutura de Dados:** Cadastro e armazenamento dos trechos monitorados utilizando arrays de objetos contendo dados de localização e altura da vegetação.
* **Processamento Automatizado:** Uso de métodos de iteração (`forEach()`, `map()`) e estruturas condicionais para calcular e definir a urgência de intervenção.
* **Classificação e Ação Recomendada:** Classificação dos pontos por níveis de severidade (ex.: *Monitorado*, *Atenção*, *Intervenção Programada* e *Intervenção Prioritária*), atrelando a cada um a ação operacional correspondente.
* **Dashboard Operacional:** Interface visual dinâmica com estilização condicional para destacar trechos críticos de intervenção prioritária.

**Demonstração da Entrega:**
<p>
  <img>
