# SW Help — tabela transposta nos counters de Siege

## Objetivo

Recuperar o layout lateral dos cards de counter no desktop e transpor a tabela
de configuração para aproveitar melhor o espaço. Cada monstro passa a ocupar
uma coluna e cada propriedade da build passa a ocupar uma linha. No celular, a
tabela inteira deve permanecer visível sem rolagem horizontal.

## Layout do card

No desktop, o card volta a ter duas áreas:

- à esquerda, uma área com o número da ofensiva, a composição, a
  instrução curta e eventuais fontes;
- à direita, uma área com o título “Configuração sugerida” e a tabela.

A divisão será 50/50. A largura menor da tabela mantém os valores visualmente
agrupados, enquanto a composição e a instrução ganham espaço para respirar. Em
larguras menores, as duas áreas serão empilhadas na ordem composição,
instrução e tabela.

## Estrutura da tabela

A tabela terá quatro colunas. A primeira identifica cada linha e as outras três
representam os monstros da ofensiva:

| Status | Monstro 1 | Monstro 2 | Monstro 3 |
| ------ | --------- | --------- | --------- |
| Seq.   | valor     | valor     | valor     |
| Runa   | sets      | sets      | sets      |
| HP     | meta      | meta      | meta      |
| ATK    | meta      | meta      | meta      |
| DEF    | meta      | meta      | meta      |
| SPD    | Tick e SPD adicional | Tick e SPD adicional | Tick e SPD adicional |
| CR     | meta      | meta      | meta      |
| CD     | meta      | meta      | meta      |
| RES    | meta      | meta      | meta      |
| ACC    | meta      | meta      | meta      |

Cada cabeçalho de monstro exibirá retrato e nome. A ordem das colunas seguirá a
ordem de ataque quando ela estiver cadastrada; caso contrário, seguirá a ordem
do time. A primeira célula usará `Status` como título acessível e visual.

Runas permanecem uma por linha dentro da célula. SPD continua exibindo
`Tick 5` e o bônus calculado em linhas separadas. `Desejável`, valores ausentes
e as regras de adicional versus valor final não mudam.

## Responsividade

A tabela usará 92 px para a coluna de status no desktop e dividirá o espaço
restante igualmente entre os três monstros. A largura maior do primeiro campo
equilibra o cabeçalho com as demais colunas. Nomes, runas e badges poderão
quebrar linha para evitar overflow. No celular estreito, a coluna de status
continuará reduzida para 52 px.

No desktop, a tabela deve caber na área direita tanto com o menu lateral aberto
quanto fechado. No celular, o card será empilhado e as quatro colunas devem
caber na viewport sem rolagem horizontal. A dica “Arraste para ver todos os
status” será removida junto do comportamento rolável.

Os mínimos de legibilidade permanecem: 16 px para texto principal, 14 px para
conteúdo secundário e 12 px para rótulos curtos.

## Acessibilidade

- A primeira coluna usará cabeçalhos de linha com `scope="row"`.
- Os monstros usarão cabeçalhos de coluna com `scope="col"`.
- Abreviações como `Seq.`, `CR`, `CD`, `RES` e `ACC` manterão nomes completos
  por meio de `abbr` e `title`.
- A tabela não dependerá de posição ou cor para identificar seu conteúdo.
- Como não haverá overflow intencional, o contêiner deixará de ser uma região
  rolável e não precisará de `tabindex`.

## Dados e cálculos

Não haverá alteração no modelo de dados. O template organizará antecipadamente
as três builds em ordem de ataque e reutilizará os formatadores e o cálculo de
SPD existentes. Valores ausentes continuarão exibidos como `—`.

## Testes

- O E2E verificará os três monstros como cabeçalhos de coluna e `Seq.`, `Runa`
  e os oito status como cabeçalhos de linha.
- O E2E confirmará ausência de overflow horizontal na tabela em desktop com o
  menu aberto e fechado.
- O E2E móvel confirmará ausência de overflow horizontal na tabela e na página.
- Valores representativos de Platy e Shihwa continuarão sendo verificados.
- A entrega será validada com `pnpm test`, `pnpm build` e `pnpm test:e2e`.

## Fora do escopo

Não serão alterados counters, metas, runas, ordem de ataque, instruções, fontes,
cálculo de SPD ou o modelo de dados.

## Critério de conclusão

O usuário compara os três monstros verticalmente por atributo, com a tabela à
direita da instrução no desktop e totalmente visível, sem scroll horizontal,
também no celular.
