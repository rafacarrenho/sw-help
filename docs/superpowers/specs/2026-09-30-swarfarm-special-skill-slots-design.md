# Compatibilidade com slots especiais do SWARFARM

## Contexto

O snapshot atual do SWARFARM passou a representar habilidades sem uma posição normal com `slot: -1`. O importador preserva o valor da fonte, mas a validação local aceita apenas slots não negativos, o que impede a atualização do catálogo.

## Decisão

- Aceitar `-1` como o único valor sentinela negativo válido para `MonsterSkill.slot`.
- Continuar rejeitando qualquer slot menor que `-1`.
- Na página de detalhes, ordenar primeiro as habilidades com slots normais e depois as habilidades especiais.
- Exibir a etiqueta `S<n>` apenas para slots não negativos; habilidades especiais não recebem uma etiqueta de slot inventada.
- Manter os demais campos exatamente como recebidos do SWARFARM.

## Fluxo de dados

O importador consulta todos os monstros e habilidades, transforma os registros, valida o snapshot completo e só então substitui `monsters.json`, `skills.json` e `monsters-meta.json`. Retratos ainda ausentes são baixados antes da troca atômica dos arquivos de dados.

## Tratamento de erros

A importação deve continuar falhando antes de alterar o catálogo quando houver IDs duplicados, referências ausentes, campos inválidos ou slots menores que `-1`. Falhas de rede ou retratos inválidos mantêm as garantias existentes.

## Verificação

- Adicionar cobertura de validação para aceitar `-1` e rejeitar valores menores.
- Executar novamente a importação completa.
- Revisar o diff para identificar as mudanças trazidas pelo update.
- Executar `pnpm test` e `pnpm build`.

