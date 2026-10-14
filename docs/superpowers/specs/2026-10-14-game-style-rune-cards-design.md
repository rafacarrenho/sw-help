# Cards de runa inspirados na leitura do jogo

## Objetivo

Simplificar os cards de resultado do Rune Optimizer usando a hierarquia visual
do Summoners War. A leitura deve privilegiar nome do atributo, valor atual,
limite projetado e símbolos, sem repetir frases explicativas em todas as linhas.

## Estrutura do card

O cabeçalho continuará identificando slot, set, estrelas, nível projetado e
Ancient. Abaixo dele, os efeitos serão apresentados como uma lista compacta:

- principal e inato terão etiquetas pequenas para distingui-los;
- substats mostrarão diretamente a sigla e o valor;
- a palavra `Substats` não será repetida em cada linha;
- localização e bloqueio continuarão no rodapé.

## Valores e estados

Um substat grindável seguirá o formato `SPD +31 (+32)`. O primeiro valor é o
valor existente na runa, já incluindo o grind atual. O valor máximo usado pelo
otimizador aparecerá sempre entre parênteses, mesmo quando for igual ao valor
atual. A palavra `limite` não será exibida.

O valor atual será branco quando não tiver grind e dourado/laranja quando já
tiver grind. O limite terá uma terceira cor, visualmente distinta do branco e
do dourado. Substats não grindáveis mostrarão apenas o valor atual.

Substats gemados exibirão somente o símbolo `↻`, com nome acessível e tooltip
localizado. O texto visível `Gemado` será removido. Valor, limite e símbolo
formarão um grupo contínuo: o limite ficará imediatamente depois do valor, e o
símbolo imediatamente depois do limite ou do valor quando não houver limite.

## Alinhamento numérico

Valores usarão algarismos tabulares. Dígitos como `1`, `5` e `0` ocuparão a
mesma largura, fazendo `+15` e `+50` terem o mesmo tamanho visual. O grupo de
valores será alinhado à direita, sem transformar limite e símbolo em colunas
separadas.

## Responsividade e idiomas

No desktop, os cards continuarão em duas colunas; no celular, em uma coluna. A
linha não provocará rolagem horizontal. A página identificará o Rune Optimizer
como `BETA`, e o texto secundário continuará com pelo menos 14 px.

## Validação

Os testes confirmarão:

- valor atual branco sem grind e dourado com grind;
- limite futuro sempre numérico, inclusive quando igual ao valor atual;
- símbolo isolado para substat gemado;
- agrupamento contínuo de valor, limite e símbolo;
- badge `BETA` no título da ferramenta;
- ausência do detalhamento verboso anterior;
- alinhamento tabular configurado no CSS;
- renderização funcional em desktop e mobile.
