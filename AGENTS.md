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
- Identificar conteúdo demonstrativo; não inventar taxas de vitória ou validação.
- Preservar a legibilidade: textos principais de 16 px, secundários de 14 px
  e etiquetas curtas de pelo menos 12 px, inclusive no celular.
- Validar as alterações com os comandos pertinentes: `pnpm test`, `pnpm build`
  e, para fluxos de navegação, `pnpm test:e2e` após gerar o build.
