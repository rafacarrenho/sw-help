# Novas defesas de Siege a partir da referência

## Objetivo

Adicionar ao catálogo de Siege Counter as defesas mostradas na imagem fornecida,
sem cadastrar counters nesta etapa e sem duplicar composições já existentes,
inclusive quando os mesmos três monstros aparecem em outra ordem.

## Abordagem

Cada retrato será associado a um monstro existente em `src/data/monsters.json`.
A ordem visual da referência será preservada no campo `team`, pois `team[0]`
representa o líder. Antes da inclusão, cada trio será convertido em uma
assinatura canônica formada pelos três IDs ordenados. Essa assinatura será
comparada com todas as defesas atuais e com as demais linhas da referência.

Somente assinaturas inéditas serão adicionadas a `src/data/defenses.json`. As
novas entradas terão `status: "documented"`, pois representam composições da
referência fornecida, sem alegar taxa de vitória ou validação adicional. A
torre será definida pelo grau natural dos monstros: `4star` quando todos forem
elegíveis para torre 4★ e `open` quando houver um monstro 5★.

## Conteúdo localizado

Como o carregamento do catálogo exige cobertura completa, cada nova defesa
receberá entradas nos cinco arquivos `src/data/locales/*/defenses.json`. O
texto será neutro e não atribuirá estratégia, desempenho ou taxa de vitória à
composição. Os nomes dos monstros continuarão em inglês, conforme importados
do SWARFARM.

## Escopo

Esta alteração não adicionará counters, runas, ordem de ataque, Tick, ordem de
eliminação ou fontes. Também não modificará a interface nem o esquema de dados.

## Validação

A implementação será verificada por uma checagem explícita de assinaturas
canônicas, por `pnpm test` e por `pnpm build`.
