# Atualização completa do projeto

## Objetivo

Atualizar o projeto sem alterar sua arquitetura ou o conteúdo editorial dos
counters. A atualização cobre dependências diretas e transitivas, catálogo
importado do SWARFARM, documentação e validações automatizadas.

## Estratégia

- Atualizar todas as dependências diretas para as versões estáveis mais recentes,
  incluindo majors quando forem aceitos pelos peers oficiais. O pnpm será
  atualizado para a série 12; o TypeScript permanecerá na série 6 enquanto o
  `@astrojs/check` não declarar compatibilidade com a série 7.
- Regenerar o lockfile apenas com pnpm e corrigir vulnerabilidades transitivas com
  versões diretas ou overrides somente quando a resolução normal não bastar.
- Executar o importador existente do SWARFARM para preservar IDs locais, aliases,
  validações e retratos já cadastrados enquanto incorpora os novos registros.
- Atualizar o README para refletir cinco idiomas, a estrutura atual de dados, os
  números reais do catálogo e a proibição de fontes externas nos counters.
- Não alterar defesas, matchups, builds nem textos editoriais, salvo ajustes
  estritamente necessários para compatibilidade ou documentação.

## Tratamento de falhas

Qualquer incompatibilidade causada por uma atualização será corrigida no menor
escopo possível. O catálogo anterior será preservado pelo próprio importador se a
fonte estiver incompleta ou violar invariantes conhecidas.

## Validação

Ao final serão executados `pnpm format:check`, `pnpm test`, `pnpm build`,
`pnpm test:e2e`, `pnpm audit` e uma nova consulta de versões. A entrega só será
considerada concluída quando o Git mostrar apenas as alterações intencionais e
as verificações não apresentarem falhas pendentes.
