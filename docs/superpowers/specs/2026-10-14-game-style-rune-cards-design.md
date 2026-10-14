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

Um substat grindável seguirá o formato `SPD +31 (+32 limite)`. O primeiro valor
é o valor existente na runa, já incluindo o grind atual. Se ainda houver grind
possível, o valor máximo usado pelo otimizador aparecerá entre parênteses com o
rótulo `limite`. Se a runa já estiver no máximo, aparecerá somente `(limite)`
depois do valor atual.

O valor atual será branco quando não tiver grind e dourado/laranja quando já
tiver grind. A cor não será a única informação: a presença do limite entre
parênteses continuará explicitando a projeção. Substats não grindáveis mostrarão
apenas o valor atual.

Substats gemados exibirão somente o símbolo `↻`, com nome acessível e tooltip
localizado. O texto visível `Gemado` será removido.

## Alinhamento numérico

Valores usarão algarismos tabulares e uma coluna de largura fixa. Dígitos como
`1`, `5` e `0` ocuparão a mesma largura, fazendo `+15` e `+50` alinharem
visualmente. Nome, valor, limite e símbolo terão colunas estáveis em todos os
cards.

## Responsividade e idiomas

No desktop, os cards continuarão em duas colunas; no celular, em uma coluna. A
linha poderá ajustar o texto do limite sem provocar rolagem horizontal. O rótulo
`limite` será localizado nos cinco idiomas, e o texto secundário continuará com
pelo menos 14 px.

## Validação

Os testes confirmarão:

- valor atual branco sem grind e dourado com grind;
- limite futuro e estado já no limite;
- símbolo isolado para substat gemado;
- ausência do detalhamento verboso anterior;
- alinhamento tabular configurado no CSS;
- renderização funcional em desktop e mobile.
