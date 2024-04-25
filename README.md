# Folha de acordes

Uma abordagem de impressão de um grid de acordes com SVG e Json.

## Breve história do projeto

Durante uma conversa com minha mãe nas férias, percebi que ela dedicava um tempo considerável desenhando e recortando manualmente representações de acordes para o braço do violão. 
Passei a ajuda-la com a tarefa e questionei como funciona e ela explicou:

"Atualmente, nossa turma de música conta com 40 alunos. Os arranjos que são preparados pela professora nem sempre estão em sites famosos e por isso ela os faz manualmente no word, sem a inclusão visual dos acordes.

Para simplificar a vida dos colegas de turma, eu desenho, recorto e distribuo os acordes para que eles possam colá-los nas cifras, escolhendo o local mais adequado."

Uma vez entendida a dinâmica do trabalho, percebi que era possível otimizar o processo. 
Eu poderia gerar um desenho dos acordes e criar uma folha de impressão, de forma que ela só precisaria cortar e entregar para os alunos o conjunto de acordes das músicas.

## Funcionalidades

 - Cadastrar acordes(com livePreview)
 - Gerar Json dos acordes cadastrados
 - Selecionar acordes e imprimir uma folha com 20 cópias por acorde
    

## Como Usar
 - No index, selecione os acordes que serão impressos e clique em imprimir.

## Instalação
 - O projeto foi feito para rodar localmente, qualquer servidor http é capaz de hospedar o projeto.

## O que aprendi?

Com certeza esse foi o pequeno projeto que mais me diverti fazendo. 
Além da oportunidade de aprender mais sobre SVG, também procurei fazer ele usar alguns recursos novos do HTML e JS. 
(Isso restringe seu uso para navegadores mais novos, mas não é um problema uma vez que não será de grande uso e não terá um número de usuários grandes.)

Algumas coisas precisam ser melhoradas, claro: 
 - O cadastro de acordes poderia ser mais dinâmico (talvez usando um svg interativo para o usuário clicar onde ficam os dedos nas cordas).
 - A tela de seleção precisa de alguma melhoria visual, mas pra começar a usar já está bem bacana.
