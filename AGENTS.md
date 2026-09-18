# SW Help

## Identidade Git

Este é um projeto pessoal de Rafael Carrenho.

- Usar `Rafael Carrenho` como nome e `rafael.carrenho@hotmail.com` como e-mail
  em todos os commits deste repositório.
- Configurar a identidade com `git config --local`, sem alterar a configuração
  global nem usar a identidade corporativa.
- Antes de criar commits, conferir a identidade efetiva com `git var GIT_AUTHOR_IDENT`
  e `git var GIT_COMMITTER_IDENT`.
- Repositório remoto: `https://github.com/rafacarrenho/sw-help.git`.

## Desenvolvimento

- Usar pnpm para instalar dependências e executar os comandos do projeto.
- Site Astro estático, inteiramente frontend.
- Prioridade atual: Siege Counter. Spd Tuning e Spd Tick ficam desabilitados.
- Manter defesas, counters e monstros nos arquivos de `src/data/`.
- Em defesas e counters de Siege, `team[0]` é sempre o líder e aparece à esquerda.
  Não usar um campo separado para escolher outro líder.
- Nos cards do catálogo, focar nos monstros e seus nomes, sem títulos ou descrições
  da defesa. Exibir o elemento no badge, sem repetir o texto abaixo do nome.
- Os badges de elemento ficam no canto superior direito do retrato, com um
  círculo preto maior parcialmente recortado e símbolos coloridos de 16 px:
  chama, gota, vento, sol e lua.
- Identificar conteúdo demonstrativo; não inventar taxas de vitória ou validação.
- Preservar a legibilidade: textos principais de 16 px, secundários de 14 px
  e etiquetas curtas de pelo menos 12 px, inclusive no celular.
- Nos counters, escrever sempre "Tick" com inicial maiúscula; quando houver
  velocidade em runas, exibir o valor como `Tick 5` e não `tick 5`.
- Na tabela de runas, exibir uma runa por linha, sem usar `/` entre as runas;
  exemplo: "Vampire" em uma linha e "Will" em outra.
- Na coluna de ordem de ataque, usar um título compacto como "Seq." em vez de
  "Ordem de atk" para reduzir o espaço visual.
- Validar as alterações com os comandos pertinentes: `pnpm test`, `pnpm build`
  e, para fluxos de navegação, `pnpm test:e2e` após gerar o build.
