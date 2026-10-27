# Documentação operacional do Codex

Este diretório mantém instruções e estado operacional que ajudam futuras
sessões a trabalhar com o PlayerDojo sem redescobrir integrações e decisões.

## Estrutura

- `skills/`: workflows reutilizáveis do projeto.
- `state/`: ponteiros para o estado atual validado.
- `archive/`: snapshots históricos imutáveis.

## Search Console

- Workflow: `skills/playerdojo-search-console/SKILL.md`
- Baseline atual: `state/SEO_BASELINE_CURRENT.md`
- Histórico: `archive/seo/`

Ao capturar uma nova baseline, criar outro arquivo datado no histórico e
atualizar apenas o ponteiro de estado. Não sobrescrever snapshots anteriores.
