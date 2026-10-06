# Prioridades de expansão de idiomas

Data do levantamento: 6 de outubro de 2026.

## Objetivo

Manter uma lista verificável de idiomas candidatos para o PlayerDojo, equilibrando
alcance orgânico, atividade da comunidade de Summoners War, monetização por
geografia, concorrência nas buscas e custo de localização.

Este documento é um registro de decisão, não uma garantia de tráfego ou receita.
As prioridades devem ser revistas com dados próprios do Google Search Console,
Google Analytics e Adsterra depois que cada idioma tiver tempo para ser indexado.

## Sinais utilizados

- Summoners War oferece oficialmente 16 idiomas na Steam e nas lojas mobile.
- Na consulta à API pública de avaliações da Steam, francês, alemão e espanhol
  apresentaram comunidades observáveis relevantes fora de inglês e português.
- Os resultados FY2025 da Com2uS informaram 63,5% da receita de jogos fora da
  Coreia, distribuída principalmente entre América do Norte, Ásia e Europa.
- A Adsterra relacionou Alemanha, França, Indonésia, Tailândia, Japão e México
  entre os países de melhor resultado para publishers em seu levantamento de
  2025/2026. Essa relação é específica da rede e não representa RPM garantido.
- Consultas exploratórias nas buscas encontraram uma oferta relativamente baixa
  de ferramentas localizadas em espanhol e alemão; a concorrência em francês e
  nos mercados asiáticos é mais estabelecida.

## Lista priorizada

| Ordem | Idioma | Código recomendado | Estado | Motivo principal |
| ---: | --- | --- | --- | --- |
| 1 | Espanhol neutro | `es` | Aprovado para implementação | Maior expansão potencial de audiência e boa lacuna de ferramentas localizadas. |
| 2 | Francês | `fr` | Aprovado para implementação | Comunidade diretamente observável forte e geografias de boa monetização. |
| 3 | Alemão | `de` | Aprovado para implementação | Comunidade relevante, concorrência moderada e alto potencial de receita por visitante. |
| 4 | Chinês tradicional | `zh-Hant` | Segunda fase | Taiwan e Hong Kong combinam comunidade, busca aberta e boa monetização. |
| 5 | Tailandês | `th` | Segunda fase | Comunidade mobile e sinal favorável na monetização da Adsterra. |
| 6 | Russo | `ru` | Segunda fase, focada em tráfego | Comunidade forte, mas monetização e mercado publicitário menos previsíveis. |
| 7 | Japonês | `ja` | Validar com dados próprios | Mercado de jogos valioso, porém localização exigente e forte concorrência local. |
| 8 | Indonésio | `id` | Experimento futuro | Grande audiência mobile e sinal favorável na Adsterra, com pouco sinal direto na Steam. |
| 9 | Turco | `tr` | Aguardar | Comunidade menor que os candidatos prioritários. |
| 10 | Italiano | `it` | Aguardar | Bom mercado publicitário, mas pouco sinal direto para Summoners War. |
| 11 | Vietnamita | `vi` | Aguardar | Mercado mobile relevante, ainda sem evidência suficiente para superar os candidatos acima. |
| 12 | Coreano | `ko` | Aguardar | Mercado valioso, porém com ecossistema de busca e concorrência próprios. |
| 13 | Chinês simplificado | `zh-Hans` | Aguardar estratégia própria | Exige distribuição, indexação e operação específicas para a China continental. |
| 14 | Árabe | `ar` | Aguardar | Não houve sinal direto suficiente na amostra utilizada. |

## Evidências quantitativas de comunidade

A API pública de avaliações da Steam foi consultada por idioma em 6 de outubro
de 2026. A amostra representa apenas usuários da Steam e pode subestimar mercados
predominantemente mobile.

| Idioma | Avaliações observadas |
| --- | ---: |
| Francês | 1.101 |
| Alemão | 867 |
| Espanhol da Espanha + América Latina | 839 |
| Chinês simplificado + tradicional | 772 |
| Russo | 677 |
| Tailandês | 329 |
| Turco | 128 |
| Italiano | 46 |
| Japonês | 39 |
| Vietnamita | 38 |
| Indonésio | 20 |
| Coreano | 3 |
| Árabe | 0 |

## Estratégia aprovada

1. Implementar primeiro `es`, `fr` e `de` com paridade integral de rotas e
   conteúdo próprio do PlayerDojo.
2. Usar espanhol internacional, sem dividir inicialmente `es-ES` e `es-419`.
3. Manter nomes de monstros, nomes de habilidades e descrições importadas do
   SWARFARM em inglês em todos os idiomas.
4. Depois da indexação, comparar impressões orgânicas, cliques, sessões
   engajadas, receita por mil sessões e cobertura de páginas por idioma.
5. Escolher o próximo idioma entre `zh-Hant`, `th` e `ru` usando dados reais do
   site, não somente estimativas de mercado.

## Fontes

- [Summoners War na Steam](https://store.steampowered.com/app/2426960/Summoners_War_Sky_Arena/)
- [Resultados FY2025 da Com2uS](https://ir.com2us.com/file/download/2434)
- [Países de melhor resultado para publishers na Adsterra](https://adsterra.com/blog/how-much-adsterra-pays/)
- [Demografia do espanhol em 2025, Instituto Cervantes](https://cvc.cervantes.es/lengua/anuario/anuario_25/elm/p01.htm)
- [Observatório da Língua Francesa](https://observatoire.francophonie.org/l-observatoire-de-la-langue-francaise/)
- [Mercado global de jogos em 2025, Newzoo](https://newzoo.com/articles/global-games-market-2025)

## Histórico de execução

| Data | Idioma | Ação | Resultado |
| --- | --- | --- | --- |
| 2026-10-06 | `es`, `fr`, `de` | Implementação aprovada | Em andamento |
