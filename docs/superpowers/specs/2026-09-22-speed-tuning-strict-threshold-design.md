# Speed Tuning: limite estrito de SPD

## Contexto

O cálculo atual transforma o limite contínuo de velocidade de um seguidor em
SPD de combate com `floor(limite)`. Isso permite que o resultado fique no
inteiro imediatamente abaixo do limite necessário para preencher a barra no
tick correto.

No caso de regressão Kabilla, Gemini e Talisman, com torre 15%, líder geral de
19%, Swift nos três monstros, Kabilla com +230 SPD e boost de ATB de 30%, os
resultados seguros devem ser:

- Kabilla: 391 SPD de combate;
- Gemini: +178 SPD verde;
- Talisman: +182 SPD verde.

## Decisão

O motor deve exigir uma velocidade estritamente superior ao limite contínuo.
A SPD mínima de combate será calculada como `floor(limite) + 1`, em vez de
`floor(limite)`.

Essa regra será aplicada no núcleo puro de tuning, antes da conversão para SPD
verde. A conversão existente continuará considerando separadamente SPD base,
torre, liderança e o arredondamento visual do bônus de Swift.

Quando um monstro anterior precisar ser elevado para preservar a ordem do time,
ele continuará usando a SPD de combate segura calculada para o monstro seguinte.

## Escopo

- Alterar somente o limite inteiro de SPD de combate em `tuneFollower`.
- Não copiar exceções ou comportamentos específicos do calculador de referência.
- Não adicionar margem configurável.
- Não alterar a interface da página.

## Validação

- Atualizar os testes unitários existentes que exercitam `tuneFollower`.
- Adicionar uma regressão explícita para Kabilla, Gemini e Talisman.
- Confirmar no fluxo E2E que a página exibe `+178 SPD` e `+182 SPD` para o caso.
- Executar `pnpm test`, `pnpm build` e `pnpm test:e2e`.

