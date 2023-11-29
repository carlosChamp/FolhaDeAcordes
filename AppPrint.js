import { SvgAcorde } from "./modules/SvgAcorde.js";
import { AcordesData } from "./modules/AcordesData.js";

const REPETICOES_POR_ACORDE = 20;

const queryStringParams = new URLSearchParams(window.location.search);

const ids = queryStringParams.get("ids").split(",");
const cor = queryStringParams.get("cor");

const acordesToPrint = (await AcordesData.AcordesCadastrados).filter((acorde) =>
  ids.includes(acorde.Id.toString())
);

const grid = document.getElementById("grid");
console.log(acordesToPrint);
acordesToPrint.forEach((acorde) => {
  for (let j = 0; j < REPETICOES_POR_ACORDE; j++) {
    const svg = SvgAcorde.criaSvgPeloAcorde(acorde);
    if (cor != undefined || cor != "") {
      svg.setAttributeNS(null, "style", "color: " + cor);
    }
    const item = document.createElement("div");
    item.appendChild(svg);
    grid.appendChild(item);
  }
});

window.print();
