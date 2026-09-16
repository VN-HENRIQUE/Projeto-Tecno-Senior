// Este arquivo cuida do comportamento do site (menus, navegação, progresso).
// O conteúdo dos módulos e temas fica em dados.js — carregue dados.js antes
// deste arquivo no HTML.

// ===== Elementos =====
const paginaInicio = document.getElementById("pagina-inicio");
const paginaModulo = document.getElementById("pagina-modulo");
const paginaTopico = document.getElementById("pagina-topico");
const caminho = document.getElementById("caminho");
const progressoEl = document.getElementById("trilha-progresso");

const pmNumero = document.getElementById("pm-numero");
const pmTitulo = document.getElementById("pm-titulo");
const pmDescricao = document.getElementById("pm-descricao");
const pmCaminho = document.getElementById("pm-caminho");
const botaoVoltarModulo = document.getElementById("botao-voltar-modulo");

const ptTitulo = document.getElementById("pt-titulo");
const ptDescricao = document.getElementById("pt-descricao");
const ptCorpo = document.getElementById("pt-corpo");
const ptConcluir = document.getElementById("pt-concluir");
const ptProximo = document.getElementById("pt-proximo");
const botaoVoltarTopico = document.getElementById("botao-voltar-topico");

const TITULO_SITE = document.title;

// ===== Progresso salvo (guarda cada tema concluído, ex.: "1-0", "1-1") =====
function chaveTema(numeroModulo, indiceTema) {
  return `${numeroModulo}-${indiceTema}`;
}

function carregarConcluidos() {
  try {
    return JSON.parse(localStorage.getItem("temasConcluidos") || "[]");
  } catch {
    return [];
  }
}

function salvarConcluidos(lista) {
  localStorage.setItem("temasConcluidos", JSON.stringify(lista));
}

function temaConcluido(numeroModulo, indiceTema) {
  return carregarConcluidos().includes(chaveTema(numeroModulo, indiceTema));
}

function moduloConcluido(modulo) {
  return modulo.temas.every((_, indice) => temaConcluido(modulo.numero, indice));
}

function alternarTemaConcluido(numeroModulo, indiceTema) {
  let concluidos = carregarConcluidos();
  const chave = chaveTema(numeroModulo, indiceTema);
  const jaConcluido = concluidos.includes(chave);

  if (jaConcluido) {
    concluidos = concluidos.filter((c) => c !== chave);
  } else {
    concluidos.push(chave);
  }

  salvarConcluidos(concluidos);
  return !jaConcluido;
}

function atualizarProgresso() {
  const totalConcluidos = dadosModulos.filter(moduloConcluido).length;
  progressoEl.textContent = `${totalConcluidos} de ${dadosModulos.length} módulos concluídos`;
}

// ===== Página inicial: monta a trilha com os módulos =====
function montarTrilha() {
  const indiceAtual = dadosModulos.findIndex((m) => !moduloConcluido(m));

  dadosModulos.forEach((modulo, indice) => {
    const li = document.createElement("li");
    li.className = "modulo";

    const concluido = moduloConcluido(modulo);
    const ehAtual = indice === indiceAtual;

    li.innerHTML = `
      <button class="modulo-botao" data-abrir-modulo="${modulo.numero}">
        ${ehAtual ? '<span class="modulo-badge">Continue aqui</span>' : ""}
        <span class="modulo-marca${concluido ? " concluido" : ""}${ehAtual ? " atual" : ""}">${modulo.numero}</span>
        <span class="modulo-texto">
          <span class="modulo-titulo">${modulo.titulo}</span>
          <span class="modulo-descricao">${modulo.descricao}</span>
        </span>
      </button>
    `;

    caminho.appendChild(li);
  });

  caminho.querySelectorAll("[data-abrir-modulo]").forEach((botao) => {
    botao.addEventListener("click", () => {
      irParaModulo(Number(botao.getAttribute("data-abrir-modulo")));
    });
  });

  atualizarProgresso();
}

function montarMenuDoModulo(modulo) {
  pmCaminho.innerHTML = "";

  const indiceAtual = modulo.temas.findIndex((_, i) => !temaConcluido(modulo.numero, i));

  modulo.temas.forEach((tema, indice) => {
    const li = document.createElement("li");
    li.className = "modulo";

    const concluido = temaConcluido(modulo.numero, indice);
    const ehAtual = indice === indiceAtual;

    li.innerHTML = `
      <button class="modulo-botao" data-abrir-tema="${indice}">
        ${ehAtual ? '<span class="modulo-badge">Continue aqui</span>' : ""}
        <span class="modulo-marca${concluido ? " concluido" : ""}${ehAtual ? " atual" : ""}">${indice + 1}</span>
        <span class="modulo-texto">
          <span class="modulo-titulo">${tema.titulo}</span>
          <span class="modulo-descricao">${tema.descricao}</span>
        </span>
      </button>
    `;

    pmCaminho.appendChild(li);
  });

  pmCaminho.querySelectorAll("[data-abrir-tema]").forEach((botao) => {
    botao.addEventListener("click", () => {
      irParaTopico(modulo.numero, Number(botao.getAttribute("data-abrir-tema")));
    });
  });
}

function preencherPaginaModulo(modulo) {
  pmNumero.textContent = modulo.numero;
  pmNumero.classList.toggle("concluido", moduloConcluido(modulo));
  pmTitulo.textContent = modulo.titulo;
  pmDescricao.textContent = modulo.descricao;
  montarMenuDoModulo(modulo);
  document.title = `${modulo.titulo} — ${TITULO_SITE}`;
}

// ===== Página do tema: o conteúdo detalhado =====
function atualizarBotaoConcluirTema(numeroModulo, indiceTema) {
  const concluido = temaConcluido(numeroModulo, indiceTema);
  ptConcluir.setAttribute("data-concluido", concluido ? "true" : "false");
  ptConcluir.textContent = concluido
    ? "Tema concluído — toque para desmarcar"
    : "Marcar como concluído";
}

function preencherPaginaTopico(modulo, indiceTema) {
  const tema = modulo.temas[indiceTema];

  ptTitulo.textContent = tema.titulo;
  ptDescricao.textContent = tema.descricao;
  ptCorpo.innerHTML = tema.paragrafos.map((paragrafo) => `<p>${paragrafo}</p>`).join("");
  atualizarBotaoConcluirTema(modulo.numero, indiceTema);

  botaoVoltarTopico.textContent = `← Voltar para ${modulo.titulo}`;
  botaoVoltarTopico.href = `#modulo-${modulo.numero}`;

  const proximoNaMesmaModulo = modulo.temas[indiceTema + 1];
  const proximoModulo = dadosModulos.find((m) => m.numero === modulo.numero + 1);

  if (proximoNaMesmaModulo) {
    ptProximo.hidden = false;
    ptProximo.textContent = `Próximo: ${proximoNaMesmaModulo.titulo} →`;
    ptProximo.href = `#modulo-${modulo.numero}-tema-${indiceTema + 1}`;
  } else if (proximoModulo) {
    ptProximo.hidden = false;
    ptProximo.textContent = `Próximo módulo: ${proximoModulo.titulo} →`;
    ptProximo.href = `#modulo-${proximoModulo.numero}`;
  } else {
    ptProximo.hidden = true;
  }

  document.title = `${tema.titulo} — ${TITULO_SITE}`;
}

// ===== Trocar entre as três páginas =====
function mostrarPagina(pagina) {
  paginaInicio.hidden = pagina !== "inicio";
  paginaModulo.hidden = pagina !== "modulo";
  paginaTopico.hidden = pagina !== "topico";
}

function irParaModulo(numero, trocarHash = true) {
  const modulo = dadosModulos.find((m) => m.numero === numero);
  if (!modulo) return;

  preencherPaginaModulo(modulo);
  mostrarPagina("modulo");
  window.scrollTo(0, 0);
  paginaModulo.focus();

  if (trocarHash) {
    history.pushState(null, "", `#modulo-${numero}`);
  }
}

function irParaTopico(numeroModulo, indiceTema, trocarHash = true) {
  const modulo = dadosModulos.find((m) => m.numero === numeroModulo);
  if (!modulo || !modulo.temas[indiceTema]) return;

  preencherPaginaTopico(modulo, indiceTema);
  mostrarPagina("topico");
  window.scrollTo(0, 0);
  paginaTopico.focus();

  if (trocarHash) {
    history.pushState(null, "", `#modulo-${numeroModulo}-tema-${indiceTema}`);
  }
}

function voltarParaTrilha(trocarHash = true) {
  mostrarPagina("inicio");
  document.title = TITULO_SITE;

  if (trocarHash) {
    history.pushState(null, "", "#trilha");
    const trilha = document.getElementById("trilha");
    if (trilha) trilha.scrollIntoView();
  }
}

// Reconstrói a home (checkmarks) quando se volta de um módulo ou tema
function atualizarTrilha() {
  caminho.querySelectorAll(".modulo-marca").forEach((marca, indice) => {
    const modulo = dadosModulos[indice];
    marca.classList.toggle("concluido", moduloConcluido(modulo));
  });
  atualizarProgresso();
}

// ===== Abre a página certa direto pelo endereço, e faz o botão voltar do navegador funcionar =====
function tratarHash() {
  const hash = window.location.hash;
  const combinacaoTema = hash.match(/^#modulo-(\d+)-tema-(\d+)$/);
  const combinacaoModulo = hash.match(/^#modulo-(\d+)$/);

  if (combinacaoTema) {
    irParaTopico(Number(combinacaoTema[1]), Number(combinacaoTema[2]), false);
  } else if (combinacaoModulo) {
    irParaModulo(Number(combinacaoModulo[1]), false);
  } else {
    voltarParaTrilha(false);
    atualizarTrilha();
  }
}

window.addEventListener("popstate", tratarHash);

botaoVoltarModulo.addEventListener("click", (evento) => {
  evento.preventDefault();
  voltarParaTrilha();
  atualizarTrilha();
});

botaoVoltarTopico.addEventListener("click", (evento) => {
  evento.preventDefault();
  const combinacao = botaoVoltarTopico.getAttribute("href").match(/^#modulo-(\d+)$/);
  if (combinacao) irParaModulo(Number(combinacao[1]));
});

ptConcluir.addEventListener("click", () => {
  const combinacao = window.location.hash.match(/^#modulo-(\d+)-tema-(\d+)$/);
  if (!combinacao) return;

  const numeroModulo = Number(combinacao[1]);
  const indiceTema = Number(combinacao[2]);

  alternarTemaConcluido(numeroModulo, indiceTema);
  atualizarBotaoConcluirTema(numeroModulo, indiceTema);
});

ptProximo.addEventListener("click", (evento) => {
  evento.preventDefault();
  const href = ptProximo.getAttribute("href");
  const combinacaoTema = href.match(/^#modulo-(\d+)-tema-(\d+)$/);
  const combinacaoModulo = href.match(/^#modulo-(\d+)$/);

  if (combinacaoTema) {
    irParaTopico(Number(combinacaoTema[1]), Number(combinacaoTema[2]));
  } else if (combinacaoModulo) {
    irParaModulo(Number(combinacaoModulo[1]));
  }
});

// ===== Início =====
montarTrilha();
tratarHash();
