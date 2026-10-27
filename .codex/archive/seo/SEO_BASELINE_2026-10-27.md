# Baseline de SEO do PlayerDojo

Data da captura: 2026-10-27

## Fonte e período

- Fonte: Google Search Console pelo servidor conectado ao Codex
- Propriedade: `sc-domain:playerdojo.com`
- Mecanismo: Google
- Tipo de pesquisa: Web
- Período validado: 2026-10-06 a 2026-10-24, inclusive
- Corte de frescor: 2026-10-24

O dia 2026-10-25 retornou apenas 19 impressões e foi excluído como parcial. Não
havia dados no período equivalente anterior, de 2026-09-17 a 2026-10-05, então
esta captura é uma referência inicial e não uma comparação de crescimento.

## Métricas gerais

- Cliques: `75`
- Impressões: `5.562`
- CTR: `1,35%`
- Posição média: `11,01`

## Dispositivos

| Dispositivo | Cliques | Impressões |   CTR | Posição média |
| ----------- | ------: | ---------: | ----: | ------------: |
| Desktop     |      49 |      3.275 | 1,50% |         13,19 |
| Mobile      |      26 |      2.236 | 1,16% |          7,90 |
| Tablet      |       0 |         51 |    0% |          7,10 |

Desktop concentra 59% das impressões e 65% dos cliques, mas tem posição média
pior que mobile. Isso descreve o mix observado e não identifica sozinho uma
causa técnica ou de conteúdo.

## Principais países por cliques

| País           | Cliques | Impressões |   CTR | Posição média |
| -------------- | ------: | ---------: | ----: | ------------: |
| França         |      22 |      1.079 | 2,04% |         10,01 |
| Brasil         |      15 |        620 | 2,42% |         12,90 |
| Estados Unidos |       7 |        850 | 0,82% |         13,52 |
| Espanha        |       6 |        139 | 4,32% |          8,81 |
| Alemanha       |       5 |        573 | 0,87% |          9,33 |

França e Brasil geram o maior número de cliques. Estados Unidos e Alemanha têm
volume relevante de impressões com CTR inferior a 1%, o que merece análise por
página e consulta antes de qualquer mudança.

## Páginas com mais cliques no recorte retornado

| Página                            | Cliques | Impressões |    CTR | Posição média |
| --------------------------------- | ------: | ---------: | -----: | ------------: |
| `/pt/summoners-war/monstros`      |       5 |         38 | 13,16% |          7,84 |
| `/summoners-war/monsters`         |       4 |        121 |  3,31% |          7,46 |
| `/summoners-war/siege-counter`    |       4 |        107 |  3,74% |          6,42 |
| `/fr/summoners-war/siege-counter` |       2 |          8 | 25,00% |          6,88 |
| `/fr/summoners-war/spd-tuning`    |       2 |         13 | 15,38% |          8,77 |

A API ordenou este recorte por cliques. Os números pequenos não sustentam
conclusões fortes de CTR para páginas individuais.

## Consultas com cliques no recorte retornado

| Consulta                     | Cliques | Impressões | Posição média |
| ---------------------------- | ------: | ---------: | ------------: |
| `ariana summoners war`       |       1 |          4 |          6,00 |
| `fire gandalf summoners war` |       1 |          6 |          5,50 |
| `groa summoners war`         |       1 |          9 |          7,11 |
| `rune optimizer`             |       1 |          4 |         23,25 |
| `sigrid sw`                  |       1 |          2 |          9,00 |

O total das linhas de consulta não deve ser comparado diretamente ao total do
domínio porque o Search Console omite consultas anonimizadas.

## Sitemap

O sitemap `https://www.playerdojo.com/sitemap.xml` foi enviado em 2026-10-06,
baixado pelo Google em 2026-10-22 e retornou zero erros e zero avisos. A API
informou 6.400 URLs enviadas e zero indexadas nesse endpoint. Esse zero não deve
ser interpretado como ausência total de indexação, pois o mesmo período contém
impressões e cliques. Use inspeção de URLs representativas para diagnóstico de
indexação.

## Uso desta baseline

Esta é a primeira referência disponível após o início dos dados. Em revisões
futuras, comparar janelas completas de 28 dias e usar 90 dias para páginas ou
idiomas de baixo volume. Avaliar cliques, impressões, CTR e posição em conjunto,
segmentados por página, consulta, país e dispositivo.
