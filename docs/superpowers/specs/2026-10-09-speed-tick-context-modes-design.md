# Modos Individual, Siege e Arena no Spd Tick

## Objetivo

Evoluir o modo Time já projetado para que o Spd Tick calcule, na mesma tela,
os breakpoints de um monstro individual, de um time de Siege com três monstros
ou de um time de Arena com quatro monstros. A ferramenta continua calculando
cada monstro de forma independente por Tick; ordem de turno e prevenção de
cortes permanecem no Spd Tuning.

## Alternativas consideradas

1. **Três modos diretos no Spd Tick — escolhido.** Exibir `Individual`,
   `Siege (3)` e `Arena (4)` no mesmo controle segmentado, compartilhando busca,
   fórmula e apresentação dos resultados.
2. **Manter `Individual` e `Time`, com um segundo seletor dentro de Time.**
   Reduziria a quantidade de opções no primeiro nível, mas adicionaria uma etapa
   desnecessária e esconderia a diferença entre Siege e Arena.
3. **Criar ferramentas separadas.** Daria URLs independentes, porém duplicaria
   interface, traduções, testes e manutenção para o mesmo cálculo.

## Experiência e estado

- O seletor principal terá os modos `Individual`, `Siege (3)` e `Arena (4)`,
  traduzidos nos cinco idiomas do site.
- `Individual` permanece como modo padrão e mantém o fluxo atual de um monstro.
- Siege exibe três slots e Arena exibe quatro. Cada slot contém busca, monstro,
  SPD base e a opção individual de conjunto Swift.
- A torre de SPD é compartilhada por todos os monstros do modo visível.
- Ao alternar entre Siege e Arena durante a sessão, os monstros já preenchidos
  permanecem. O quarto slot fica oculto em Siege sem ser descartado da sessão.
- A ação de limpar remove os monstros, Swift e líder do contexto de time, mas
  preserva a torre selecionada.
- URLs novas usam `view=siege` e `view=arena`. URLs existentes com `view=team`
  continuam válidas e são interpretadas como Siege.
- A query string armazena apenas os slots visíveis, suas opções de Swift, torre
  e líder. Parâmetros externos, como UTM, são preservados.

## Lideranças de SPD

- Siege aceita líderes de `Attack Speed` com área `General`, `Guild` ou
  `Element`.
- Arena aceita líderes de `Attack Speed` com área `General`, `Arena` ou
  `Element`.
- `General`, `Guild` e `Arena` afetam todos os integrantes do modo em que são
  válidos. `Element` afeta apenas monstros do elemento indicado.
- O seletor mostra `Sem líder` e cada líder válido presente na composição,
  identificado por monstro e percentual.
- Com exatamente um líder válido, ele é selecionado automaticamente. Com mais
  de um, uma seleção ainda válida é preservada; caso contrário, permanece
  `Sem líder`.
- Trocar o modo invalida imediatamente uma liderança exclusiva do contexto
  anterior, sem aplicar bônus indevido.

## Breakpoints e terminologia

- Toda a ferramenta passa a mostrar somente `Tick 3` até `Tick 8`. Os Ticks 9,
  10 e 11 são removidos da fonte compartilhada de breakpoints, portanto deixam
  de aparecer tanto no modo Individual quanto nos modos de time.
- Remover de todos os idiomas a terminologia `SPD verde` e equivalentes, não
  apenas o marcador entre parênteses.
- Rótulos, descrições, FAQs e conteúdo SEO devem falar em `SPD adicional` ou no
  equivalente natural de cada idioma, sem alterar a fórmula do cálculo.
- Os resultados continuam exibindo a SPD adicional de runa necessária ou o
  estado de que o monstro já alcança o breakpoint.

## Apresentação e acessibilidade

- Os modos de time reutilizam a tabela comparativa, com um monstro por linha e
  os Ticks 3 a 8 nas colunas.
- `Tick 5` e `Tick 6` continuam destacados.
- Em telas largas, os slots se adaptam a três ou quatro colunas conforme o
  modo; em telas menores, quebram em linhas sem reduzir a tipografia abaixo dos
  mínimos do projeto.
- O seletor de modo e todos os comboboxes mantêm navegação por teclado, labels,
  listboxes e estados ativos anunciáveis.
- A interface deixa explícito que os valores são breakpoints individuais, não
  uma garantia de ordem de ataque ou de ausência de corte.

## Organização técnica

- Centralizar em `src/lib/speed-tick.ts` o tipo do modo, a quantidade de slots,
  as áreas de liderança válidas e a compatibilidade com `view=team`.
- Manter quatro slots no estado de time e derivar os slots visíveis da
  configuração do modo, evitando duas implementações paralelas.
- Reaproveitar a mesma fórmula pura de SPD para Individual, Siege e Arena.
- Atualizar mensagens e conteúdo editorial nos cinco idiomas, preservando em
  inglês nomes e descrições importados do SWARFARM.

## Validação

- Testes unitários cobrem os breakpoints limitados ao Tick 8, serialização e
  leitura de Siege/Arena, compatibilidade de `view=team`, quarto slot e regras
  de liderança específicas de cada contexto.
- Testes E2E cobrem os três modos, três monstros em Siege, quatro em Arena,
  mudança de contexto, líder válido, Swift por slot, restauração via URL e
  limpeza do time.
- Verificar por busca que `(+green)`, suas traduções e referências editoriais a
  `SPD verde` não permanecem no conteúdo publicado.
- Executar `pnpm test`, `pnpm build` e `pnpm test:e2e` após gerar o build.

## Fora do escopo

- Calcular ordem de ataque, risco de corte, buffs de SPD ou boosts de ATB.
- Adicionar RTA como quarto modo.
- Salvar times em conta, histórico ou armazenamento local.
- Alterar a fórmula usada para calcular a SPD necessária em cada Tick.
