# SW Help — remoção do status de exemplo nos counters

## Objetivo

Remover dos counters de Siege o badge `EXEMPLO` e todo o modelo criado
exclusivamente para sustentá-lo. A interface deixa de classificar cada counter
como exemplo ou documentado, reduzindo ruído visual e complexidade nos dados.

## Interface

O badge `EXEMPLO` não será mais renderizado ao lado do número da ofensiva. Os
estilos exclusivos de `example-tag` serão removidos quando não houver outro uso
real no código-fonte.

O aviso geral no final da página permanece, mas passa de “Os exemplos não
garantem vitória” para “As sugestões não garantem vitória”. Assim, a interface
continua deixando claro que as composições não representam garantia de
resultado sem manter a classificação removida.

## Modelo de dados

O campo `status` será removido de todos os counters em
`src/data/counters.json` e da interface TypeScript correspondente. Não haverá
substituto para `example` ou `documented`.

Status pertencentes a outras entidades, como defesas, não fazem parte desta
mudança e permanecem intactos.

## Validação e documentação

Serão removidas as regras que exigem uma fonte quando o counter possui status
`documented`, pois essa classificação deixará de existir. A validação das URLs
das fontes cadastradas e todas as demais regras dos counters continuam ativas.

O README deixará de orientar o uso de `status: "example"` ou
`status: "documented"` em counters. Testes unitários e E2E serão atualizados
para não depender do campo ou do badge removido e para confirmar o novo texto
do aviso geral.

## Fora do escopo

Não serão alterados composições, status de build, runas, instruções, cálculos de
SPD, fontes já cadastradas ou o sistema de status das defesas.

## Validação

- A busca no código-fonte não deverá encontrar referências ao badge
  `example-tag` nem ao status de counter removido.
- Os dados continuarão válidos sem o campo `status` nos counters.
- O E2E verificará a ausência do badge e a presença do aviso “As sugestões não
  garantem vitória”.
- A entrega será validada com `pnpm test`, `pnpm build` e `pnpm test:e2e`.

## Critério de conclusão

Nenhum counter exibe ou armazena a classificação de exemplo/documentado, e a
página mantém apenas um aviso geral e neutro sobre a ausência de garantia de
vitória.
