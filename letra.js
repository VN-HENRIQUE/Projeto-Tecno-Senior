// Aumentar/diminuir o tamanho da letra — usado em todas as páginas
const botaoTexto = document.getElementById("botao-texto");
const letraSalva = localStorage.getItem("letraGrande") === "true";

function aplicarTamanhoLetra(ativo) {
  document.documentElement.setAttribute("data-letra-grande", ativo ? "true" : "false");
  if (!botaoTexto) return;
  botaoTexto.setAttribute("aria-pressed", ativo ? "true" : "false");
  botaoTexto.textContent = ativo ? "Diminuir letra" : "Aumentar letra";
}

aplicarTamanhoLetra(letraSalva);

if (botaoTexto) {
  botaoTexto.addEventListener("click", () => {
    const ativo = document.documentElement.getAttribute("data-letra-grande") === "true";
    aplicarTamanhoLetra(!ativo);
    localStorage.setItem("letraGrande", (!ativo).toString());
  });
}