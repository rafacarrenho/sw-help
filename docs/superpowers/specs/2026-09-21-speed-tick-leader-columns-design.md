# Colunas de liderança na tabela de Spd Tick

## Objetivo

Permitir que o usuário compare, em uma única tabela, a SPD adicional
necessária para cada breakpoint de Tick com todas as porcentagens de liderança
de velocidade presentes no catálogo local.

## Experiência

- Manter a seleção de monstro e de Torre SPD existente.
- Manter um breakpoint por linha, com a primeira coluna identificando o Tick e
  sua velocidade mínima.
- Substituir a coluna única de resultado por uma coluna para cada porcentagem
  única de liderança de SPD encontrada nos monstros.
- Incluir `0%` para representar o cálculo sem líder.
- Ordenar as colunas de forma crescente. Com os dados atuais, os cabeçalhos
  serão `0%`, `10%`, `15%`, `16%`, `17%`, `19%`, `20%`, `21%`, `23%`, `24%`,
  `28%`, `30%` e `33%`.
- Mostrar somente a porcentagem no cabeçalho. A área de aplicação e os nomes
  dos monstros que possuem a liderança não fazem parte da tabela.
- Cada célula continua usando a linguagem atual: a quantidade de SPD adicional
  ou `Já atinge` quando nenhum acréscimo é necessário.
- Destacar os breakpoints principais de Tick 4, Tick 5 e Tick 6 como na versão
  atual.

## Dados e cálculo

As porcentagens serão derivadas de `src/data/monsters.json` por meio do catálogo
tipado, considerando apenas habilidades cujo atributo seja `Attack Speed`.
Valores repetidos serão deduplicados por porcentagem, sem distinção por área ou
elemento. O valor `0` será acrescentado explicitamente.

Para cada combinação de breakpoint e liderança, a página reutilizará o cálculo
de velocidade existente com:

- a SPD base do monstro selecionado;
- a porcentagem da coluna de liderança;
- a porcentagem selecionada em Torre SPD;
- a velocidade mínima do breakpoint.

A liderança do próprio monstro selecionado não será aplicada automaticamente.
Todas as colunas representam cenários independentes e comparáveis.

## Implementação

O módulo `src/lib/speed-tick.ts` será a fonte das porcentagens únicas e dos
breakpoints. A página serializará essas duas coleções para o script do navegador,
evitando manter listas duplicadas no HTML e no TypeScript do cliente.

O renderizador criará os cabeçalhos e as células a partir dessas coleções. Se
um monstro sem SPD válida chegar ao cálculo, a interface não deverá produzir
`NaN` ou `Infinity`; o caso será tratado como dado indisponível.

## Responsividade e acessibilidade

A tabela ficará dentro de uma região com rolagem horizontal. Em telas estreitas,
a primeira coluna permanecerá fixa para preservar a referência do Tick durante a
rolagem. Cabeçalhos continuarão sendo células semânticas de tabela e os textos
respeitarão o mínimo de 12 px definido pelo projeto.

## Validação

- Testar a extração, deduplicação e ordenação de todas as porcentagens de SPD.
- Testar o cálculo para ao menos um breakpoint sem líder e com liderança.
- Confirmar que a tabela renderizada possui uma coluna para cada porcentagem e
  que mudanças de monstro e Torre SPD recalculam todas as células.
- Executar `pnpm test`, `pnpm build` e `pnpm test:e2e` depois de gerar o build.
- Conferir a rolagem horizontal e a coluna de Tick fixa em largura de celular.

## Fora do escopo

Filtrar líderes por Arena, Guilda, Masmorras ou elemento; mostrar monstros que
possuem cada liderança; alterar os breakpoints; ou modificar a fórmula de
velocidade existente.
