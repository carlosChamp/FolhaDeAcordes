import { SvgAcorde } from "./modules/SvgAcorde.js";
import { AcordesData } from "./modules/AcordesData.js";

const acordesCadastrados = await AcordesData.AcordesCadastrados;

let acordesSelecionados = [];

const txtPesquisa = document.getElementById("txtPesquisa");
const btnPrint = document.getElementById("btnPrint");
const dlgImpressao = document.getElementById("dlgImpressao");
const cmbCor = document.getElementById("cmbCor");
const gridImpressao = document.getElementById("acordesImpressao");

async function pesquisarSugestoes(filtroPesquisa = "") {
  let acordes = acordesCadastrados;
  if (filtroPesquisa != "")
    acordes = await acordes.filter((a) => a.Nome.startsWith(filtroPesquisa));
  montarGridAcordes(acordes);
}

function openPrintDialog() {
  dlgImpressao.showModal();
  montarGridAcordesImpressao();
  cmbCor_onChange(null);
}

function montarGridAcordes(acordes) {
  let grid = document.getElementById("acordesDisponiveis");
  grid.innerHTML = "";

  acordes.forEach((acorde) => {
    const item = document.createElement("li");
    item.setAttribute("data-idAcorde", acorde.Id);
    let classList = "gridItem";
    if (acordesSelecionados.includes(acorde.Id)) classList += " selecionado";

    item.setAttribute("class", classList);
    item.appendChild(SvgAcorde.criaSvgPeloAcorde(acorde));
    item.addEventListener("click", onClickToggleSelecao);

    grid.appendChild(item);
  });
}

function montarGridAcordesImpressao(){
  gridImpressao.innerHTML = "";

  acordesSelecionados.forEach((idAcorde) => {
    let acorde = acordesCadastrados.find(x => x.Id == idAcorde);
    const item = document.createElement("li");
  
    let classList = "gridItem gridItemSmall";
    item.setAttribute("class", classList);
    item.appendChild(SvgAcorde.criaSvgPeloAcorde(acorde));
    item.addEventListener("click", onClickToggleSelecao);

    gridImpressao.appendChild(item);
  });
}


function onClickToggleSelecao(e) {
  let idAcorde = parseInt(e.currentTarget.getAttribute("data-idAcorde"));
  if (acordesSelecionados.includes(idAcorde))
    acordesSelecionados = acordesSelecionados.filter((x) => x != idAcorde);
  else 
    acordesSelecionados.push(idAcorde);
  pesquisarSugestoes(txtPesquisa.value);
}

function imprimirAcordes(e){
  if(dlgImpressao.returnValue == "confirm")
    window.open(`print.html?ids=${acordesSelecionados.join(",")}&cor=${encodeURIComponent(cmbCor.value)}  `, "_blank");

}

function cmbCor_onChange(e){
  gridImpressao.setAttribute("style", "color:" + cmbCor.value);
}

txtPesquisa.addEventListener("change", (e) => {
  pesquisarSugestoes(e.target.value);
});

cmbCor.addEventListener("change", cmbCor_onChange)

document
  .querySelectorAll("dialog button")
  .forEach(button => {
    button.addEventListener("click",(e) => {
      e.preventDefault();
      dlgImpressao.close(e.currentTarget.value);
    })
  })


btnPrint.addEventListener("click", openPrintDialog);

dlgImpressao.addEventListener("close", imprimirAcordes)

pesquisarSugestoes();

