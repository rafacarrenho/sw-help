# Novas combinações explícitas de defesa de Siege

## Objetivo

Adicionar 22 defesas documentadas ao Siege Counter sem cadastrar counters. Cada
composição será uma entrada explícita em `src/data/defenses.json`, seguindo o
padrão atual do projeto. Com as 31 defesas existentes, o catálogo passará a ter
53 defesas.

## Identificação dos monstros

As abreviações fornecidas serão normalizadas para os seguintes monstros do
catálogo:

- Nina luz: Nina Williams de Luz (`nina-williams-light-2772`)
- Mimmir: Mimirr de Luz (`mimirr-light-655`)
- Verdehan: Vendhan (`vendhan-fire-2203`)
- Start dark: Stark de Trevas (`stark-dark-3057`)
- Qilin vento: Qilin Slasher de Vento (`qilin-slasher-wind-2719`)
- Savanah: Savannah (`savannah`)

## Composições

O primeiro monstro listado será sempre `team[0]` e, portanto, o líder.

1. Tarnisha, Ethna e Lamiella.
2. Nina Williams de Luz, Triton e Driana.
3. Nina Williams de Luz, Triton e Amber.
4. Nina Williams de Luz, Triton e Vendhan.
5. Nephthys, Triton e Driana.
6. Nephthys, Triton e Amber.
7. Nephthys, Triton e Vendhan.
8. Maximilian, Triton e Driana.
9. Maximilian, Triton e Amber.
10. Maximilian, Triton e Vendhan.
11. Stark de Trevas, Triton e Driana.
12. Stark de Trevas, Triton e Amber.
13. Stark de Trevas, Triton e Vendhan.
14. Mimirr, Zen e Ren.
15. Moore, Daphnis e Qilin Slasher de Vento.
16. Moore, Daphnis e Savannah.
17. Chandra, Daphnis e Qilin Slasher de Vento.
18. Chandra, Daphnis e Savannah.
19. Sylvia, Daphnis e Qilin Slasher de Vento.
20. Sylvia, Daphnis e Savannah.
21. Rahul, Daphnis e Qilin Slasher de Vento.
22. Rahul, Daphnis e Savannah.

## Modelo de dados e localização

Cada defesa terá `tower: "open"` e `status: "documented"`. Os IDs serão
derivados dos nomes na mesma ordem do time. As cinco localizações receberão
textos neutros já usados para defesas documentadas, sem alegar estratégia,
desempenho ou taxa de vitória.

Não serão adicionados counters, runas, Tick, ordem de ataque, ordem de
eliminação ou fontes. A interface e o esquema de dados permanecerão
inalterados.

## Prevenção de duplicatas

Antes da inclusão, cada trio será representado por uma assinatura canônica com
os três IDs de monstro ordenados. A assinatura será comparada com todas as
defesas existentes e com as outras 21 entradas, de modo que uma composição não
se repita mesmo quando sua ordem for diferente.

## Validação

A implementação atualizará as expectativas do catálogo para 53 defesas e será
verificada por:

- teste de unicidade das assinaturas canônicas;
- paridade entre as defesas e as cinco localizações;
- `pnpm test`;
- `pnpm build`;
- `pnpm test:e2e` após o build.
