# Ordenação do catálogo por atributos

## Objetivo

Adicionar ao seletor de ordenação do catálogo as opções de maior HP, maior ATQ
e maior DEF, usando os atributos máximos já importados do SWARFARM. A ordenação
deve continuar funcionando com filtros, paginação, histórico e retorno da ficha.

## Dados e arquitetura

`MonsterSummary` passa a carregar uma projeção `sortStats` com somente `hp`,
`attack` e `defense`. O catálogo não enviará os demais atributos detalhados nem
as habilidades ao navegador. `toMonsterSummary` é o único ponto responsável
por montar essa projeção para o HTML inicial e para `/monstros/index.json`.

`readMonsterFilters` aceitará `hp`, `attack` e `defense` como valores válidos de
`sort`. `filterMonsters` ordenará cada atributo do maior para o menor. Registros
sem o atributo recebem valor zero e aparecem depois dos registros completos.
Empates mantêm os critérios já existentes: nome, elemento, forma e ID.

## Interface

O seletor “Ordenar por” ganhará três opções:

- Maior HP máximo
- Maior ATQ máximo
- Maior DEF máxima

A escolha continuará refletida na URL e será restaurada ao navegar, recarregar
ou retornar de uma ficha. Os cards não ganharão novas informações visuais; esta
alteração é restrita ao controle e ao comportamento de ordenação.

## Validação

Testes unitários verificarão a leitura dos novos valores, a ordem decrescente e
a projeção reduzida. O fluxo E2E cobrirá a seleção de um atributo, a atualização
da URL e a ordem dos primeiros resultados. A entrega também será validada com
`pnpm test`, `pnpm build` e `pnpm test:e2e`.
