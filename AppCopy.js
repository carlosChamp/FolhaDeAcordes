import { SvgAcorde } from "./modules/SvgAcorde.js";
import { AcordesData } from "./modules/AcordesData.js";

// Horizontal position (x) of each string in the SVG viewBox
const POSICAO_CORDAS_X = { 1: 285, 2: 235, 3: 185, 4: 135, 5: 85, 6: 35 };

// Inline CSS needed for SVG-to-canvas rendering (mirrors acorde.css)
const ESTILOS_SVG_INLINE = `
  .titulo { font: bold 48px Arial, sans-serif; }
  .posicaoDedo { font: italic bold 48px Arial, sans-serif; }
  .primeiraCasa { font: bold 20px Arial, sans-serif; }
`;

const params     = new URLSearchParams(window.location.search);
const idsParam   = params.get("ids");
const ids        = idsParam ? idsParam.split(",").map(Number).filter(n => !isNaN(n)) : [];
const corInicial = params.get("cor") ?? "red";

const todosAcordes = await AcordesData.AcordesCadastrados;

// DOM
const lblAcordeNome = document.getElementById("lblAcordeNome");
const cmbPadrao     = document.getElementById("cmbPadrao");
const cmbBaixo      = document.getElementById("cmbBaixo");
const cmbCor        = document.getElementById("cmbCor");
const btnCopiar     = document.getElementById("btnCopiar");
const msgCopiado    = document.getElementById("msgCopiado");
const acordesList   = document.getElementById("acordesList");

// Default picked strings: all strings with number < bass (treble side of bass).
// Strings with number > bass are above/muted in typical dedilhado patterns.
function defaultCordasPuxadas(baixo) {
  if (!baixo) return [1, 2, 3];
  return [1, 2, 3, 4, 5, 6].filter(c => c < baixo);
}

// Build initial state for each chord from the URL ids
const chordStates = ids.map(id => {
  const acorde = todosAcordes.find(a => a.Id === id);
  if (!acorde) return null;
  return {
    id,
    nome: acorde.Nome,
    padrao: id,
    baixo: acorde.CordaBaixo ?? null,
    cordasPuxadas: defaultCordasPuxadas(acorde.CordaBaixo),
    cor: corInicial,
  };
}).filter(Boolean);

let selectedIndex = 0;

// Build SVG element for a given chord state.
// - P marks the bass string (drawn by SvgAcorde._desenhaPolegar)
// - X marks checked strings that are on the treble side of the bass (number < CordaBaixo)
function renderSvgForState(state) {
  const acordeBase = todosAcordes.find(a => a.Id === state.padrao);
  if (!acordeBase) return null;

  const acorde = JSON.parse(JSON.stringify(acordeBase));
  acorde.CordaBaixo = state.baixo;

  SvgAcorde._desenhaPolegar = !!acorde.CordaBaixo;
  const svg = SvgAcorde.criaSvgPeloAcorde(acorde);
  svg.setAttributeNS(null, "style", `color: ${state.cor}`);
  svg.setAttributeNS(null, "viewBox", "0 0 300 510");

  // X markers: only for strings with number < CordaBaixo (treble side)
  const cordasComX = state.cordasPuxadas.filter(
    c => !state.baixo || c < state.baixo
  );
  for (const corda of cordasComX) {
    const xMark = document.createElementNS("http://www.w3.org/2000/svg", "text");
    xMark.setAttributeNS(null, "x", POSICAO_CORDAS_X[corda]);
    xMark.setAttributeNS(null, "y", "494");
    xMark.setAttributeNS(null, "fill", state.cor);
    xMark.setAttributeNS(null, "text-anchor", "middle");
    xMark.setAttributeNS(null, "class", "posicaoDedo");
    xMark.textContent = "x";
    svg.appendChild(xMark);
  }

  return svg;
}

// Render all chord cards to the grid
function renderGrid() {
  acordesList.innerHTML = "";
  chordStates.forEach((state, i) => {
    const card = document.createElement("div");
    card.className = "acorde-item" + (i === selectedIndex ? " selected" : "");
    card.dataset.index = i;
    const svgEl = renderSvgForState(state);
    if (svgEl) card.appendChild(svgEl);
    card.addEventListener("click", () => selectChord(i));
    acordesList.appendChild(card);
  });
}

// Select a chord by index: highlight its card and load its settings into controls
function selectChord(index) {
  selectedIndex = index;
  const state = chordStates[index];

  lblAcordeNome.textContent = state.nome;

  const variacoes = todosAcordes.filter(a => a.Nome === state.nome);
  cmbPadrao.innerHTML = "";
  variacoes.forEach((acorde, i) => {
    const opt = document.createElement("option");
    opt.value = acorde.Id;
    opt.textContent = variacoes.length > 1
      ? `Variação ${i + 1} (casa ${acorde.CasaInicial})`
      : `Casa ${acorde.CasaInicial}`;
    cmbPadrao.appendChild(opt);
  });
  cmbPadrao.value = state.padrao;

  cmbBaixo.value = state.baixo ? String(state.baixo) : "";
  cmbCor.value   = state.cor;

  document.querySelectorAll('input[name="corda"]').forEach(cb => {
    cb.checked = state.cordasPuxadas.includes(parseInt(cb.value));
  });

  renderGrid();
}

// Read controls and update the selected chord state, then re-render
function updateSelectedState() {
  const state = chordStates[selectedIndex];
  if (!state) return;

  state.padrao = parseInt(cmbPadrao.value);
  state.baixo  = cmbBaixo.value ? parseInt(cmbBaixo.value) : null;
  state.cor    = cmbCor.value;
  state.cordasPuxadas = Array.from(
    document.querySelectorAll('input[name="corda"]:checked')
  ).map(cb => parseInt(cb.value));

  renderGrid();
}

// Copy the selected chord as a high-resolution PNG image to the clipboard
async function copiarComoImagem() {
  const state = chordStates[selectedIndex];
  if (!state) return;

  const svg = renderSvgForState(state);
  if (!svg) return;

  const [, , vbW, vbH] = svg.getAttribute("viewBox").split(" ").map(Number);
  const scale  = parseFloat(document.querySelector("#cmbEscala").value) || 1;
  const canvas = document.createElement("canvas");
  canvas.width  = vbW * scale;
  canvas.height = vbH * scale;

  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, vbW, vbH);

  // Serialize, then inject xmlns and <style> at the string level to avoid namespace errors
  let svgStr = new XMLSerializer().serializeToString(svg);
  // Ensure SVG namespace is declared
  if (!svgStr.includes('xmlns=')) {
    svgStr = svgStr.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  // Inject styles right after the opening <svg ...> tag
  svgStr = svgStr.replace(/(<svg[^>]*>)/, `$1<style>${ESTILOS_SVG_INLINE}</style>`);

  const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    ctx.drawImage(img, 0, 0, vbW, vbH);
    const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    await navigator.clipboard.write([new ClipboardItem({ "image/png": pngBlob })]);
    msgCopiado.style.display = "inline";
    setTimeout(() => (msgCopiado.style.display = "none"), 2500);
  } catch (err) {
    alert("Não foi possível copiar: " + err.message);
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Event listeners
cmbPadrao.addEventListener("change", () => {
  // When pattern changes, sync bass to the new pattern's default
  const acorde = todosAcordes.find(a => a.Id === parseInt(cmbPadrao.value));
  if (acorde) {
    chordStates[selectedIndex].baixo = acorde.CordaBaixo ?? null;
    cmbBaixo.value = chordStates[selectedIndex].baixo
      ? String(chordStates[selectedIndex].baixo) : "";
  }
  updateSelectedState();
});

cmbBaixo.addEventListener("change", updateSelectedState);
cmbCor.addEventListener("change", updateSelectedState);
document.querySelectorAll('input[name="corda"]').forEach(cb =>
  cb.addEventListener("change", updateSelectedState)
);
btnCopiar.addEventListener("click", copiarComoImagem);

// Initialize
if (chordStates.length > 0) {
  selectChord(0);
} else {
  lblAcordeNome.textContent = "Nenhum acorde selecionado";
  acordesList.innerHTML = "<p>Volte ao início e selecione alguns acordes.</p>";
}
