# Detalhes ampliados do catálogo de monstros

## Objetivo

Enriquecer as fichas individuais do catálogo com os dados que o SWARFARM já
oferece e que hoje são descartados: atributos completos, habilidades e formas
de obtenção. Os textos vindos da API permanecem no idioma original.

## Decisões

- Manter o site inteiramente estático e sem consultas ao SWARFARM durante o
  build ou no navegador.
- Acrescentar aos registros de monstros os atributos de nível máximo, taxa
  crítica, dano crítico, resistência, precisão, IDs de habilidades e origens.
- Normalizar habilidades em `src/data/skills.json`, evitando repetir uma mesma
  habilidade em vários monstros da família.
- Exibir nome, descrição, slot, recarga, golpes, características (passiva e
  área), efeitos, multiplicador e progressão das habilidades quando disponíveis.
- Exibir “Como obter” somente quando a fonte informar ao menos uma origem. A
  ausência da seção não será interpretada como monstro não obtível.
- Preservar `speed` no registro do monstro para compatibilidade com a busca e o
  Speed Tick.
- Manter o índice de busca deliberadamente pequeno. Atributos detalhados,
  origens e habilidades não serão serializados no HTML nem no `index.json`.
- Não incluir nesta entrega custos de despertar, transformações, receitas de
  fusão ou ícones de habilidades. Eles continuam possíveis em uma evolução
  posterior sem alterar o modelo adotado.

## Arquitetura e fluxo de dados

O importador percorre os endpoints paginados de monstros e habilidades. Depois
de validar a resposta completa, normaliza os monstros, seleciona apenas as
habilidades efetivamente referenciadas e grava ambos os arquivos por troca
atômica. Retratos continuam locais como hoje.

`src/data/catalog.ts` exporta `skillById` junto de `monsterById`. A ficha
individual resolve os IDs do monstro durante a geração estática. A listagem usa
uma função comum de projeção para expor apenas os campos necessários a cards,
busca, filtros e ordenação.

## Interface

A ficha mantém o cabeçalho atual. O quadro de fatos passa a mostrar os oito
atributos de combate: HP, ATQ, DEF, SPD, taxa crítica, dano crítico, resistência
e precisão. Abaixo dele aparecem:

1. “Habilidades”, em cards ordenados por slot, com texto original da fonte e
   metadados disponíveis.
2. “Como obter”, em uma lista de origens; fontes marcadas como farmáveis recebem
   indicação visual e descrições são exibidas quando presentes.

As seções usam a tipografia mínima já definida pelo projeto, reorganizam-se em
uma coluna no celular e não dependem de JavaScript.

## Validação e falhas

- Rejeitar habilidade referenciada que não exista no arquivo normalizado.
- Rejeitar atributos percentuais ou numéricos fora de faixas plausíveis.
- Preservar os arquivos locais se a API ou o esquema falharem durante a
  importação.
- Testar a projeção do índice para impedir vazamento futuro de campos pesados.
- Cobrir a ficha enriquecida em teste E2E, inclusive sem JavaScript e sem
  overflow horizontal.
- Validar com `pnpm test`, `pnpm build` e `pnpm test:e2e` após o build.
