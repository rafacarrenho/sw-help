# Localização do PlayerDojo em espanhol, francês e alemão

## Objetivo

Adicionar `es`, `fr` e `de` ao PlayerDojo com a mesma cobertura funcional,
editorial e de SEO disponível em inglês e português brasileiro. A expansão deve
preservar o site Astro estático, o sistema tipado de rotas e a exigência de que
todo locale publicado tenha conteúdo completo.

O levantamento que orienta a decisão fica registrado em
`docs/research/2026-10-06-language-expansion-priorities.md`.

## Decisões editoriais

- O espanhol será internacional e usará o código `es`, sem variantes regionais.
- Francês e alemão usarão respectivamente `fr` e `de`.
- Todos os textos próprios do PlayerDojo serão traduzidos: interface, SEO, FAQ,
  páginas institucionais, descrições de defesas e instruções de counters.
- Nomes de monstros, nomes de habilidades e descrições importadas do SWARFARM
  permanecerão em inglês, seguindo o padrão já adotado em português.
- Trechos importados em inglês dentro de páginas localizadas usarão `lang="en"`
  para acessibilidade e interpretação correta por mecanismos de busca.
- Termos consolidados da comunidade, nomes de runas e siglas continuarão em sua
  forma reconhecida quando uma tradução literal reduzir clareza. `Tick` manterá
  inicial maiúscula em todos os idiomas.
- Conteúdo demonstrativo continuará claramente identificado, sem inventar
  validação competitiva ou taxas de vitória.

## Arquitetura de i18n

`Locale` passará a aceitar `en`, `pt-BR`, `es`, `fr` e `de`. Os mapas tipados de
mensagens, rotas, metadados, jogos, conteúdo institucional, SEO, defesas e
counters terão cobertura explícita dos cinco idiomas. Não haverá fallback
silencioso para inglês em textos próprios do PlayerDojo; ausência de tradução
deve continuar sendo detectada em build ou teste.

O Astro registrará os prefixos `/es`, `/fr` e `/de`. Inglês continuará como
locale padrão sem prefixo e português permanecerá em `/pt`.

Os slugs institucionais, de catálogo, paginação e comparação serão localizados.
Os termos técnicos reconhecidos internacionalmente `siege-counter`,
`spd-tuning` e `spd-tick` serão preservados para manter consistência, links
previsíveis e vocabulário conhecido pela comunidade.

## Superfície de páginas

Cada novo locale terá páginas estáticas equivalentes para:

- início do portal;
- sobre, contato, privacidade e termos;
- início de Summoners War;
- catálogo e detalhes de monstros;
- paginação do catálogo;
- Siege Counter e detalhes das defesas;
- SPD Comparison;
- Spd Tuning;
- Spd Tick;
- página 404 localizada.

As páginas compartilharão os componentes atuais e fornecerão apenas o locale,
mantendo lógica e comportamento únicos.

## Dados localizados

Serão criados arquivos de defesas e counters para `es`, `fr` e `de` com os
mesmos identificadores dos dados base. A validação de cobertura percorrerá a
lista completa de locales em vez de manter uma lista duplicada de idiomas.

Os nomes dos monstros continuarão vindo do catálogo comum em inglês. Instruções
autorais, títulos de composição e explicações do PlayerDojo serão traduzidos.
Runas continuarão uma por linha e a coluna de sequência conservará um título
curto adequado a cada idioma.

## SEO e descoberta

Cada rota indexável terá canonical no idioma atual e alternates recíprocos para
`en`, `pt-BR`, `es`, `fr`, `de` e `x-default`. Inglês continuará como
`x-default`.

O sitemap, Open Graph, JSON-LD, `llms.txt`, titles, descriptions, FAQs e links
relacionados incluirão os novos idiomas. `og:locale` usará códigos regionais
compatíveis (`es_ES`, `fr_FR`, `de_DE`) sem transformar os locales do site em
variantes regionais.

O seletor mostrará Español, Français e Deutsch com links reais para a rota
equivalente. Parâmetros de busca compartilháveis serão preservados na troca de
idioma conforme o comportamento atual.

## Formatação e acessibilidade

`numberLocale` mapeará os cinco idiomas para formatação adequada. O documento
usará o atributo `lang` do locale ativo, enquanto o conteúdo SWARFARM continuará
marcado como inglês. Labels, mensagens de estado, textos sem JavaScript e
controles acessíveis serão traduzidos sem reduzir os tamanhos mínimos de texto.

## Testes e validação

Os testes unitários serão ampliados para garantir:

- metadados de todos os locales;
- cobertura completa de rotas, mensagens, defesas e counters;
- formatação numérica;
- geração correta de caminhos;
- manutenção de conteúdo SWARFARM em inglês.

Os testes E2E validarão seletor de idioma, canonicals, `hreflang`, navegação,
preservação de query string, 404 e pelo menos uma rota de ferramenta e uma rota
de detalhe em cada novo idioma.

A entrega será validada com `pnpm test`, `pnpm build` e `pnpm test:e2e` após a
geração do build.

## Fora de escopo

- Traduzir nomes ou descrições de habilidades importados do SWARFARM.
- Criar variantes `es-ES`, `es-419`, `fr-FR`, `fr-CA`, `de-DE` ou `de-CH`.
- Adicionar idiomas além de `es`, `fr` e `de` nesta etapa.
- Alterar cálculos, regras das ferramentas ou o catálogo base de monstros.
- Automatizar tradução em tempo de execução.
