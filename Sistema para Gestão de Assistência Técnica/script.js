// script.js

// Atualiza o relógio a cada segundo
function atualizarRelogio() {
    const clockElement = document.getElementById("clock");
    const agora = new Date();
    clockElement.textContent = agora.toLocaleTimeString();
  }
  setInterval(atualizarRelogio, 1000);
  atualizarRelogio();
  
  // Alternar exibição das seções
  document.querySelectorAll(".menu li a").forEach(link => {
    link.addEventListener("click", function(event) {
      event.preventDefault();
      const sectionId = this.getAttribute("data-section");
      document.querySelectorAll(".section-content").forEach(sec => {
        sec.style.display = sec.id === sectionId ? "block" : "none";
      });
    });
  });
  
  // Atualiza o campo de idade com base na data de nascimento
  document.getElementById("data_nascimento").addEventListener("change", function() {
    const dataNascimento = new Date(this.value);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mes = hoje.getMonth() - dataNascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
      idade--;
    }
    document.getElementById("idade").value = idade;
  });
  
  // Função genérica para envio de formulários individuais com validação
  async function enviarFormulario(formId, endpoint) {
    const form = document.getElementById(formId);
    if(form){
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
          alert("Por favor, preencha os campos obrigatórios corretamente.");
          return;
        }
        const formData = new FormData(form);
        const dados = {};
        formData.forEach((value, key) => dados[key] = value);
        
        try {
          const resposta = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
          });
          if (resposta.ok) {
            alert(`Dados do formulário ${formId} salvos com sucesso!`);
            form.reset();
          } else {
            alert(`Erro ao salvar os dados do formulário ${formId}.`);
          }
        } catch (error) {
          console.error("Erro:", error);
        }
      });
    }
  }
  
  // Configura envio dos formulários individuais
  enviarFormulario("formCliente", "http://localhost:3000/clientes");
  enviarFormulario("formPeca", "http://localhost:3000/pecas");
  enviarFormulario("formFornecedor", "http://localhost:3000/fornecedores");
  enviarFormulario("formEquipamento", "http://localhost:3000/equipamentos");
  enviarFormulario("formOrcamento", "http://localhost:3000/orcamentos");
  enviarFormulario("formReparo", "http://localhost:3000/reparos");
  
  // Função para enviar todos os formulários de uma vez
  async function salvarTudo() {
    const forms = [
      { id: "formCliente", endpoint: "http://localhost:3000/clientes" },
      { id: "formPeca", endpoint: "http://localhost:3000/pecas" },
      { id: "formFornecedor", endpoint: "http://localhost:3000/fornecedores" },
      { id: "formEquipamento", endpoint: "http://localhost:3000/equipamentos" },
      { id: "formOrcamento", endpoint: "http://localhost:3000/orcamentos" },
      { id: "formReparo", endpoint: "http://localhost:3000/reparos" }
    ];
  
    let erros = [];
    for (const formInfo of forms) {
      const form = document.getElementById(formInfo.id);
      if(form) {
        const formData = new FormData(form);
        let vazio = true;
        formData.forEach(value => { if(value.trim() !== "") vazio = false; });
        if (!vazio) {
          if (!form.checkValidity()) {
            erros.push(`Formulário ${formInfo.id} possui campos obrigatórios não preenchidos.`);
            continue;
          }
          const dados = {};
          formData.forEach((value, key) => dados[key] = value);
          try {
            const resposta = await fetch(formInfo.endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(dados)
            });
            if (!resposta.ok) {
              erros.push(`Erro ao salvar ${formInfo.id}.`);
            }
          } catch (error) {
            erros.push(`Erro na conexão com ${formInfo.id}.`);
          }
        }
      }
    }
    if(erros.length > 0){
      alert("Ocorreram erros:\n" + erros.join("\n"));
    } else {
      alert("Todos os dados foram salvos com sucesso!");
      forms.forEach(formInfo => {
        const form = document.getElementById(formInfo.id);
        if(form) form.reset();
      });
    }
  }
  
  // Configura o botão "Salvar Tudo"
  document.getElementById("salvarTudo").addEventListener("click", salvarTudo);
  
  // Funções para carregar relatórios e estoque (exemplo)
  async function carregarRelatorio(endpoint, containerId) {
    try {
      const resposta = await fetch(endpoint);
      const dados = await resposta.json();
      const container = document.getElementById(containerId);
      container.innerHTML = "";
      dados.forEach(item => {
        const div = document.createElement("div");
        div.textContent = JSON.stringify(item);
        container.appendChild(div);
      });
    } catch (error) {
      console.error("Erro ao carregar relatório:", error);
    }
  }
  
  document.getElementById("relatorios").addEventListener("click", () => {
    carregarRelatorio("http://localhost:3000/reparos", "relatorioReparos");
    carregarRelatorio("http://localhost:3000/pecas", "relatorioPecas");
    carregarRelatorio("http://localhost:3000/clientes", "relatorioClientes");
  });
  
  function carregarEstoque() {
    carregarRelatorio("http://localhost:3000/estoque", "estoquePecas");
  }
  document.querySelector('a[data-section="estoque"]').addEventListener("click", carregarEstoque);
  