# Modo Time no Spd Tick

## Objetivo

Permitir calcular, de uma só vez, a SPD adicional de runa necessária para os
três monstros de um time de Siege alcançarem cada breakpoint de Tick. O novo
fluxo deve reaproveitar a fórmula confiável do Spd Tick e manter separado o
objetivo do Spd Tuning, que continua responsável por ordem de turno, buffs,
boosts de ATB e prevenção de cortes.

## Alternativas consideradas

1. **Adicionar um modo `Time` ao Spd Tick — escolhido.** Mantém todos os
   cálculos de breakpoint em uma única ferramenta, facilita descobrir a função
   nova e evita duplicar fórmula, busca de monstros e configurações.
2. **Adicionar o cálculo ao Spd Tuning.** Colocaria o time no contexto correto,
   mas misturaria dois resultados diferentes: alcançar um Tick absoluto e
   acompanhar outro monstro sem ser cortado.
3. **Criar uma nova ferramenta.** Daria uma página dedicada, porém fragmentaria
   a navegação para uma variação pequena do Spd Tick e aumentaria a manutenção
   de rotas, conteúdo e traduções.

## Experiência

- Adicionar, no início da calculadora atual, um seletor segmentado com os modos
  `Individual` e `Time`.
- Manter `Individual` como padrão e preservar sem mudanças funcionais o fluxo
  atual de um monstro.
- No modo `Time`, exibir três slots de monstros, correspondentes a um time de
  Siege. Cada slot terá busca, retrato, nome, SPD base e controle `Usa Swift`.
- Torre de SPD será uma configuração única e compartilhada pelos três slots.
- A seleção dos monstros não representará ordem de ataque. O modo Time compara
  breakpoints independentes e não promete que o time esteja ajustado contra
  cortes.
- Incluir uma ação `Limpar time` que remova os três monstros, Swift e liderança,
  sem alterar a torre selecionada.
- Manter os textos principais com no mínimo 16 px, os secundários com 14 px e
  etiquetas curtas com pelo menos 12 px também no celular.

## Liderança de SPD

- Detectar entre os três monstros as lideranças cujo atributo seja
  `Attack Speed` e cuja área seja válida em Siege: `General`, `Guild` ou
  `Element`.
- O seletor de liderança terá `Sem líder` e uma opção identificada pelo nome e
  percentual de cada líder de SPD válido presente no time.
- Quando o time passar a ter exatamente uma opção válida, selecioná-la
  automaticamente. Com mais de uma opção, preservar uma seleção ainda válida;
  caso contrário, usar `Sem líder` para não escolher silenciosamente entre
  líderes concorrentes.
- Lideranças `General` e `Guild` afetam os três integrantes. Uma liderança
  `Element` afeta somente monstros do elemento informado nos dados do SWARFARM.
- Lideranças de outros atributos ou exclusivas de outras áreas não aparecem.
- Remover imediatamente do seletor e do cálculo uma liderança cujo monstro seja
  retirado do time.

## Resultado

- Exibir uma tabela comparativa com um monstro por linha e os breakpoints
  existentes de Tick 3 a Tick 11 nas colunas.
- A primeira coluna permanece fixa durante a rolagem horizontal e apresenta
  retrato, nome e SPD base do monstro.
- Cada célula usa a fórmula atual de `requiredAdditionalSpeed` e mostra a SPD
  adicional de runa necessária, por exemplo `168 SPD`, ou `Já atinge`.
- Destacar visualmente as colunas `Tick 5` e `Tick 6`, seguindo a ênfase já
  usada na tabela individual.
- Slots vazios não geram linhas de resultado. Enquanto nenhum monstro estiver
  selecionado, mostrar uma mensagem de estado vazio em vez de uma tabela sem
  conteúdo.
- Em telas estreitas, permitir rolagem horizontal da tabela sem reduzir a
  tipografia abaixo dos mínimos do projeto.

## Estado compartilhável

- Representar o modo na URL somente quando for `Time`, preservando URLs atuais
  como modo individual.
- Persistir na query string os três IDs selecionados, Swift de cada slot, torre
  e o ID do líder escolhido.
- Manter parâmetros externos, como `utm_source`, ao sincronizar o estado.
- Validar todos os parâmetros na leitura. IDs ausentes, líderes que não fazem
  parte do time e valores fora dos limites usam os defaults seguros.
- Trocar entre os modos não apaga o estado montado no outro modo durante a
  sessão. A URL reflete apenas o modo visível.

## Organização técnica

- Manter as fórmulas puras em `src/lib/speed-tick.ts` e adicionar ali os tipos e
  helpers de estado do modo Time, validação da liderança e cálculo do percentual
  efetivo por integrante.
- Reaproveitar no componente `SpeedTick.astro` os mesmos dados de catálogo e o
  comportamento acessível do combobox atual, extraindo pequenos helpers quando
  isso evitar duplicação dentro do script da página.
- Acrescentar as mensagens do modo Time a todos os cinco idiomas existentes.
  Nomes e descrições importados do SWARFARM permanecem em inglês.
- Estender `speed-tick.css` sem alterar a aparência funcional do modo
  Individual.

## Acessibilidade e erros

- O seletor de modo será navegável por teclado e anunciará qual opção está
  ativa.
- Cada busca terá label e listbox próprios, com IDs únicos por slot.
- O cabeçalho da região de resultado descreverá que os valores são SPD adicional
  por Tick.
- Imagens ausentes usarão o fallback visual existente, sem impedir o cálculo.
- Dados inválidos da URL não causam erro de script nem deixam controles e tabela
  em estados divergentes.

## Validação

- Testes unitários cobrem leitura e escrita da query do modo Time, validação de
  líderes de Siege, aplicação de liderança geral/de Guild e aplicação seletiva
  de liderança elemental.
- Testes E2E cobrem a troca de modo, montagem de três monstros, Swift por slot,
  torre compartilhada, detecção e remoção de líder, atualização dos valores,
  limpeza do time, restauração pela URL, fallback de imagem e navegação por
  teclado.
- Confirmar que os testes existentes do modo Individual continuam passando sem
  alteração dos resultados atuais.
- Executar `pnpm test`, `pnpm build` e, após o build, `pnpm test:e2e`.
- Fazer inspeção visual do modo Time em desktop e celular.

## Fora do escopo

- Calcular ordem de ataque ou risco de corte.
- Considerar buffs de SPD, boosts de ATB, artefatos ou passivas; esses recursos
  pertencem ao Spd Tuning.
- Times de Arena/RTA com quatro monstros.
- Salvar times em conta, histórico ou armazenamento local.
- Alterar os breakpoints ou a fórmula existentes.
