const OFFSET_CORDA_PESTANA = -15;
const FINAL_PESTANA = 285;
const PESTANA_STROKE_WIDTH = 10;

const POSICAO_CASAS = {
    "1": 105,
    "2": 195,
    "3": 281,
    "4": 367,
    "5": 453
}

const POSICAO_CORDAS = {
    "1": 285,
    "2": 235,
    "3": 185,
    "4": 135,
    "5": 85,
    "6": 35
}
    


const CHORD_MODEL = `
  <!-- Nome do acorde -->
  <text id="nomeAcorde" x="50%" y="40" class="posicaoDedo" dominant-baseline="middle" text-anchor="middle">nome</text>
  <text id="primeiraCasa" x="20" y="70" class="primeiraCasa" rotate="270" dominant-baseline="middle" text-anchor="middle">1</text>
  <!-- Cordas -->
  <line x1="25" x2="25" y1="60" y2="484" stroke="black" stroke-width="2"></line>  
  <line x1="75" x2="75" y1="60" y2="484" stroke="black" stroke-width="2"></line>  
  <line x1="125" x2="125" y1="60" y2="484" stroke="black" stroke-width="2"></line>  
  <line x1="175" x2="175" y1="60" y2="484" stroke="black" stroke-width="2"></line>  
  <line x1="225" x2="225" y1="60" y2="484" stroke="black" stroke-width="2"></line>  
  <line x1="275" x2="275" y1="60" y2="484" stroke="black" stroke-width="2"></line>
  <!-- trastes -->
  <line x1="24" x2="276" y1="60" y2="60" stroke="black" stroke-width="4"></line>
  <line x1="24" x2="276" y1="484" y2="484" stroke="black" stroke-width="4"></line>
  <line x1="25" x2="275" y1="145" y2="145" stroke="black" stroke-width="2"></line>
  <line x1="25" x2="275" y1="229" y2="229" stroke="black" stroke-width="2"></line>
  <line x1="25" x2="275" y1="313" y2="313" stroke="black" stroke-width="2"></line>
  <line x1="25" x2="275" y1="397" y2="397" stroke="black" stroke-width="2"></line>
`;

function criaElementoSVGComPropriedades(elemento, props){
    var elemento = document.createElementNS("http://www.w3.org/2000/svg", elemento); 
    for(let prop in props){
        elemento.setAttributeNS(null, prop, props[prop]);
    }
    return elemento;

}

function criaSvgPeloAcorde(chord){
    
    let svg = criaElementoSVGComPropriedades('svg', {"width":"300", "height":"500"})
    svg.innerHTML = CHORD_MODEL;
    svg.getElementById("nomeAcorde").innerHTML = chord.Nome;

    adicionarDedosNoBraco(svg, chord);

    return svg;

    
}

function adicionarDedosNoBraco(svg, chord){
    var dedoPestana = chord.Dedos?.filter( x => x.Numero == 1 && x.Pestana )[0];
    var dedosNoBraco = chord.Dedos;
    if(dedoPestana){
        
        const pestana = criaElementoSVGComPropriedades("line",
        {
            "x1": POSICAO_CORDAS[dedoPestana.Corda] + OFFSET_CORDA_PESTANA,
            "x2": FINAL_PESTANA,
            
            "y1": POSICAO_CASAS[dedoPestana.Casa - (chord.CasaInicial - 1)],
            "y2": POSICAO_CASAS[dedoPestana.Casa - (chord.CasaInicial - 1)],
            
            "stroke":"red",
            "stroke-width":PESTANA_STROKE_WIDTH,
            "stroke-linecap":"round"
        })
        svg.appendChild(pestana); //adicionar pestana
        dedosNoBraco = chord.Dedos.filter(x=>!x.Pestana);
    }

   for (const dedoNoBraco of dedosNoBraco) {
        const dedoAcorde = criaElementoSVGComPropriedades("text",
        {
            "x": POSICAO_CORDAS[dedoNoBraco.Corda],
                        
            "y": POSICAO_CASAS[dedoNoBraco.Casa - (chord.CasaInicial - 1)],
            "rotate":270,
            "class":"posicaoDedo"
        });
        dedoAcorde.innerHTML = dedoNoBraco.Numero;
        svg.appendChild(dedoAcorde); //adicionar dedo no braco
   }

}