import { SvgAcorde } from "./modules/SvgAcorde.js";
import { AcordesData } from "./modules/AcordesData.js";

const txtId = document.getElementById("txtId");
const txtNome = document.getElementById("txtNome");
const txtCasaInicial = document.getElementById("txtCasaInicial");
const checkPestana = document.getElementById("checkPestana");
const gridAcordesCadastrados = document.querySelector(
  "#gridAcordesCadastrados > tbody"
);
const btnCadastrar = document.getElementById("btnCadastrar");
const btnGerarJson = document.getElementById("btnGerarJson");

let listaAcordesMemoria = await AcordesData.AcordesCadastrados;
let ids = listaAcordesMemoria.map((object) => {
  return object.Id;
});

let proxId = Math.max(...ids) + 1;

function getInfoDedoAcorde(numeroDedo) {
  let checkPestanaValue = false;
  if (numeroDedo == 1) checkPestanaValue = checkPestana.checked;

  const cordaValue = parseInt(
    document.getElementById("txtCorda" + numeroDedo).value
  );
  const casaValue = parseInt(
    document.getElementById("txtCasa" + numeroDedo).value
  );
  if (
    isNaN(cordaValue) ||
    cordaValue == 0 ||
    isNaN(casaValue) ||
    casaValue == 0
  )
    return null;

  return {
    Numero: numeroDedo,
    Pestana: checkPestanaValue,
    Corda: cordaValue,
    Casa: casaValue,
  };
}

function setInfoDedoAcorde(Dedo) {
  let numeroDedo = Dedo.Numero;
  if (numeroDedo == 1) checkPestana.checked = Dedo.Pestana;
  document.getElementById("txtCorda" + numeroDedo).value = Dedo.Corda;
  document.getElementById("txtCasa" + numeroDedo).value = Dedo.Casa;
  desenhaAcorde();
}

function criarObjetoAcorde() {
  let casaInicial = 1;
  if (txtCasaInicial.value != "") casaInicial = parseInt(txtCasaInicial.value);
  let idAcorde = txtId.value == "" ? 0 : txtId.value;

  let acorde = {
    Id: idAcorde,
    Nome: txtNome.value,
    CasaInicial: casaInicial,
    Dedos: [],
  };

  for (let i = 1; i <= 4; i++) {
    const dedo = getInfoDedoAcorde(i);
    if (dedo != null) acorde.Dedos.push(dedo);
  }

  console.log(acorde);
  return acorde;
}

function desenhaAcorde() {
  const divAcorde = document.getElementById("acordeCadastrado");
  if (divAcorde.childNodes.length > 0)
    divAcorde.removeChild(divAcorde.childNodes[0]);
  const svg = SvgAcorde.criaSvgPeloAcorde(criarObjetoAcorde());
  divAcorde.appendChild(svg);
}

function carregarAcordesNaTela() {
  console.log(listaAcordesMemoria);
  if (gridAcordesCadastrados.childNodes.length > 0) {
    for (let i = gridAcordesCadastrados.childNodes.length - 1; i >= 0; i--) {
      gridAcordesCadastrados.childNodes[i].remove();
    }
  }

  listaAcordesMemoria.forEach((acorde) => {
    adicionaLinhaGridAcorde(acorde);
  });
}

function adicionaLinhaGridAcorde(acorde) {
  let linha = document.createElement("tr");
  let cellId = document.createElement("td");
  cellId.innerHTML = acorde.Id;
  linha.appendChild(cellId);

  let cellNome = document.createElement("td");
  cellNome.innerHTML = acorde.Nome;
  linha.appendChild(cellNome);

  let cellPestana = document.createElement("td");
  cellPestana.innerHTML = acorde.Dedos.some((x) => x.Pestana) ? "Sim" : "Não";
  linha.appendChild(cellPestana);

  let cellComando = document.createElement("td");
  cellComando.innerHTML = `<a href="#" onclick="copiarAcorde(${acorde.Id})">Copiar</a> - <a href="#" onclick="editarAcorde(${acorde.Id})">Editar</a> - <a href="#" onclick="apagarAcorde(${acorde.Id})">Apagar</a>`;
  linha.appendChild(cellComando);

  gridAcordesCadastrados.appendChild(linha);
}

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function limparCampos() {
  txtId.value = "";
  txtNome.value = "";
  txtCasaInicial.value = "";

  checkPestana.checked = false;
  for (let i = 1; i <= 4; i++) {
    document.getElementById("txtCorda" + i).value = "";
    document.getElementById("txtCasa" + i).value = "";
  }
}

window.editarAcorde = function (id) {
  let acordes = listaAcordesMemoria.filter((x) => x.Id == id);
  if (acordes.length == 0) alert("Acorde não encontrado na lista.");

  limparCampos();
  let acorde = acordes[0];
  preencherCampos(acorde);
};

window.copiarAcorde = function (id) {
  let acordes = listaAcordesMemoria.filter((x) => x.Id == id);
  if (acordes.length == 0) alert("Acorde não encontrado na lista.");

  limparCampos();
  let acordeClone = { ...acordes[0] };
  acordeClone.Id = "";
  preencherCampos(acordeClone);
};

window.apagarAcorde = function (id) {
  let acordes = listaAcordesMemoria.filter((x) => x.Id == id);
  if (acordes.length == 0) alert("Acorde não encontrado na lista.");

  listaAcordesMemoria = listaAcordesMemoria.filter((x) => x.Id != id);
  carregarAcordesNaTela();
};

function preencherCampos(acorde) {
  txtId.value = acorde.Id;
  txtNome.value = acorde.Nome;
  txtCasaInicial.value = acorde.CasaInicial;

  for (const dedo of acorde.Dedos) {
    setInfoDedoAcorde(dedo);
  }
}

btnCadastrar.addEventListener("click", () => {
  let obj = criarObjetoAcorde();
  if (Number(obj.Id) == 0) {
    obj.Id = proxId;
    proxId++;
    listaAcordesMemoria.push(obj);
  } else {
    let index = listaAcordesMemoria.findIndex((x) => x.Id == obj.Id);
    listaAcordesMemoria[index] = obj;
  }

  carregarAcordesNaTela();
  limparCampos();
});

btnGerarJson.addEventListener("click", () => {
  let json = JSON.stringify(listaAcordesMemoria);
  download("acordes.json", json);
});

const inputs = document.querySelectorAll("#frmCadAcorde input");
inputs.forEach((input) => input.addEventListener("change", desenhaAcorde));
carregarAcordesNaTela();
desenhaAcorde();