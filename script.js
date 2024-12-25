document.getElementById("calcular").addEventListener("click", async function() {
  const jogo = document.getElementById("jogo").value;
  const tipo = document.getElementById("tipo").value;

  // Obtendo o valor sugerido pelo usuário (caso seja uma sugestão de preço ou troca)
  const valorSugerido = parseFloat(prompt("Digite o valor que você sugere para a conta ou produto (em R$):"));

  if (isNaN(valorSugerido) || valorSugerido <= 0) {
    alert("Por favor, insira um valor válido.");
    return;
  }

  const responseMessage = await fetchRaridade(jogo, tipo);

  // Extrair o valor calculado (será necessário um formato fixo para esse retorno, como uma frase com o valor)
  const valorCalculado = parseFloat(responseMessage.match(/R\$ (\d+(\.\d{1,2})?)/)[1]);

  const mensagemFinal = avaliarSugestao(valorCalculado, valorSugerido);

  const resultadoElement = document.getElementById("resultado");
  resultadoElement.style.display = "block";

  // Atualiza a classe de feedback
  if (mensagemFinal.includes("boa")) {
    resultadoElement.classList.add("boa");
    resultadoElement.classList.remove("ruim");
  } else {
    resultadoElement.classList.add("ruim");
    resultadoElement.classList.remove("boa");
  }

  document.getElementById("mensagem").innerHTML = `
    <p>Valor calculado pela IA: R$ ${valorCalculado.toFixed(2)}</p>
    <p>Sua sugestão: R$ ${valorSugerido.toFixed(2)}</p>
    <p>${mensagemFinal}</p>
  `;
});

async function fetchRaridade(jogo, tipo) {
  const apiKey = "sua_chave_da_api_openai"; // Insira sua chave da API OpenAI aqui
  const url = "https://api.openai.com/v1/chat/completions";

  const body = {
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: `O jogo é ${jogo}. O tipo de item é ${tipo}. Qual seria o valor estimado desse item com base no mercado atual?`
      }
    ]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  return data.choices[0].message.content;  // Retorna a resposta do modelo com o valor calculado
}

function avaliarSugestao(valorCalculado, valorSugerido) {
  const diferenca = valorSugerido - valorCalculado;

  if (diferenca > 0) {
    return "Sua sugestão está acima do valor estimado. A sugestão pode ser considerada muito alta.";
  } else if (diferenca < 0) {
    return "Sua sugestão está abaixo do valor estimado. A sugestão pode ser considerada muito baixa.";
  } else {
    return "Sua sugestão está no valor estimado. A sugestão parece justa!";
  }
}
