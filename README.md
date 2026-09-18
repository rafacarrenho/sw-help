# SW Help

Toolkit de Summoners War em **Astro + TypeScript**, com saída estática e foco
inicial no **Siege Counter**. Não usa backend, banco de dados, login ou APIs em
tempo de execução. Spd Tuning e Spd Tick permanecem desabilitados no menu.

## Executar

Use Node.js 22.12+ (Node 24 recomendado para os testes TypeScript).

Com pnpm:

```sh
pnpm install
pnpm dev
```

O `pnpm-workspace.yaml` autoriza o script de instalação do `esbuild`, necessário
ao Astro. Mantenha `allowBuilds.esbuild: true` ao reinstalar as dependências.

Alternativamente, com npm:

```sh
npm install
npm run dev
```

Abra `http://localhost:4321`. Para produção:

```sh
npm run build
npm run preview
```

Publique a pasta `dist/` em qualquer hospedagem de arquivos estáticos. Não é
necessário adapter. O projeto pressupõe publicação na raiz do domínio.

## O que está pronto

- Catálogo de defesas com busca por nomes ou aliases, em qualquer ordem.
- Busca ignora acentos e maiúsculas e aceita nomes separados por vírgulas.
- Filtros de torre 4★ e torre livre (sem restrição de estrelas naturais).
- Busca e filtro na URL, preservados ao abrir uma defesa e voltar ao catálogo.
- Uma página estática por defesa, com composição, counters, runas, estratégia,
  ordem interna sugerida e observações.
- Estados sem resultados, sem counters e página 404.
- Interface responsiva, navegação por teclado e catálogo legível sem JavaScript.
- Retratos e fontes locais; falha de imagem usa iniciais como fallback.

## Conteúdo inicial

O site contém **8 defesas, 5 counters demonstrativos e 25 monstros**. Os matchups
e as sugestões de runas são exemplos de cadastro, **não estratégias competitivas
validadas**. A interface identifica essa condição e não apresenta estatísticas
de vitória. Algumas defesas estão sem counters para demonstrar o estado vazio.

## Editar o catálogo

Os dados ficam em três arquivos JSON:

| Arquivo                  | Responsabilidade                                        |
| ------------------------ | ------------------------------------------------------- |
| `src/data/monsters.json` | Nomes, aliases, elementos, estrelas naturais e retratos |
| `src/data/defenses.json` | Equipes de defesa e categoria de torre                  |
| `src/data/counters.json` | Ofensivas vinculadas às defesas, estratégias e fontes   |

1. Cadastre os monstros que faltarem em `monsters.json`. O `id` deve ser único,
   em minúsculas, com hífens; `element` aceita `fire`, `water`, `wind`, `light`
   ou `dark`. `naturalStars` representa a raridade natural, não as estrelas
   após evolução. Para segundo despertar, mantenha a raridade natural.
2. Adicione o retrato em `public/monsters/` e use `/monsters/arquivo.png` no
   campo `image`, ou omita `image` para usar o fallback com iniciais.
3. Crie a defesa com exatamente três IDs distintos em `team`; `leader` recebe
   o ID de um integrante ou `null`. `tower` aceita `4star` ou `open`.
4. Crie os counters com `defenseId` correspondente. Cada counter tem seu próprio
   `id`, equipe, líder, título, estratégia, passos e observações. `turnOrder`
   pode ser um array vazio se não houver ordem documentada. `runes` e `sources`
   também podem ser vazios. A ordem exibida é uma anotação; não calcula ticks.
5. Use `status: "example"` para exemplos. Só altere para `"documented"` quando
   houver documentação do matchup e acrescente ao menos uma fonte com `title`
   e URL HTTP(S) em `sources`. Esse status indica fonte disponível, não garantia
   de vitória. Defesas também possuem status independente.
6. Rode `npm test` e `npm run build`, confira o resultado e publique novamente.

Exemplo de fonte em um counter:

```json
{
  "title": "Análise da composição",
  "url": "https://seu-dominio.com/analise"
}
```

A validação do catálogo interrompe o build se houver IDs duplicados,
referências inexistentes, equipes inválidas, líderes fora do time, monstros 5★
em torres 4★ (inclusive na ofensiva) ou counters documentados sem fonte.

## Estrutura

```text
src/
  components/       Ícones, monstros, equipes e cards de defesa
  data/             Catálogo local e funções de consulta
  layouts/          Estrutura compartilhada do site
  lib/              Tipos, busca e validação
  pages/            Catálogo, detalhes estáticos e 404
  scripts/          Busca e filtros no navegador
  styles/           Estilos e breakpoints
public/monsters/    Retratos locais
tests/             Testes do catálogo e fluxos no navegador
```

## Verificação

```sh
npm test          # busca e integridade do catálogo
npm run build    # tipos Astro/TypeScript e geração estática
npm run test:e2e # fluxos em desktop e viewport mobile (rode o build antes)
```

Os testes de navegador usam Playwright com o Google Chrome instalado
(`channel: "chrome"`). Em outra máquina, instale Chrome ou ajuste
`playwright.config.ts` para usar um Chromium do Playwright. O servidor local é
de preview é iniciado automaticamente pelo teste, usando o build em `dist/`.
A viewport mobile é emulada no Chromium;
não substitui uma verificação em um dispositivo físico com Safari.

## Créditos e fontes

- Metadados e retratos dos monstros consultados no
  [SWARFARM](https://github.com/swarfarm/swarfarm#api), com URLs de origem
  preservadas em cada registro de `monsters.json`. Esses dados foram baixados
  durante a criação; não há consulta ao SWARFARM durante build ou navegação.
- Summoners War, nomes e imagens dos personagens pertencem à Com2uS. Este é
  um projeto independente da comunidade, sem vínculo oficial.
- Fonte DM Sans distribuída localmente por
  [Fontsource](https://fontsource.org/fonts/dm-sans), sob a licença OFL incluída
  no pacote.
- A futura ferramenta Spd Tick tem como referência o
  [calculador indicado no briefing](https://00peanuts.pages.dev/apps/sw-tick-calculator/).

Referências de implementação: [instalação do Astro](https://docs.astro.build/en/install-and-setup/)
e [roteamento estático](https://docs.astro.build/en/guides/routing/).
