# PlayerDojo

Toolkit bilíngue de Summoners War em **Astro + TypeScript**, com saída estática
e prioridade atual no **Siege Counter**. O site também oferece catálogo de
monstros, Spd Tuning, Comparador de SPD e Spd Tick. Não usa backend, banco de
dados, login ou APIs em tempo de execução.

## Executar

Use Node.js 22.12+ (Node 24 recomendado para os testes TypeScript).

```sh
pnpm install
pnpm dev
```

O `pnpm-workspace.yaml` autoriza o script de instalação do `esbuild`, necessário
ao Astro. Mantenha `allowBuilds.esbuild: true` ao reinstalar as dependências.

Abra `http://localhost:4321`. Para produção:

```sh
pnpm build
pnpm preview
```

O deploy atual usa Cloudflare Workers Static Assets, configurado em
`wrangler.jsonc`.

O domínio canônico de produção é `https://www.playerdojo.com`. Configure o
domínio raiz `https://playerdojo.com` no provedor para redirecionar com status
301 ou 308 para o host com `www`, preservando caminho e query string.

## Publicidade Adsterra

O layout reserva um banner Adsterra em todas as páginas. O tag permanece
desativado enquanto a chave e a URL oficiais não forem informadas no ambiente
de build:

```sh
PUBLIC_ADSTERRA_BANNER_KEY="chave-fornecida-pela-adsterra"
PUBLIC_ADSTERRA_BANNER_SCRIPT_URL="https://dominio-oficial/invoke.js"
PUBLIC_ADSTERRA_BANNER_WIDTH="728"
PUBLIC_ADSTERRA_BANNER_HEIGHT="90"
```

O modo personalizado é carregado somente depois da escolha correspondente no
painel de privacidade. Se a Adsterra fornecer e documentar um tag contextual
sem armazenamento ou identificadores não essenciais, configure-o separadamente:

```sh
PUBLIC_ADSTERRA_CONTEXTUAL_KEY="chave-contextual-oficial"
PUBLIC_ADSTERRA_CONTEXTUAL_SCRIPT_URL="https://dominio-oficial/invoke.js"
```

As variáveis são públicas e incorporadas ao HTML no build. Use somente o código
do placement criado no painel da conta; não invente chaves nem copie tags de
outros sites. Depois de configurar, gere o site novamente e valide o anúncio em
produção.

## O que está pronto

- Catálogo de defesas com busca por nomes ou aliases, em qualquer ordem.
- Busca ignora acentos e maiúsculas e aceita nomes separados por vírgulas.
- Filtros de torre 4★ e torre livre (sem restrição de estrelas naturais).
- Busca e filtro na URL, preservados ao abrir uma defesa e voltar ao catálogo.
- Uma página estática por defesa, com composição, counters, instrução curta,
  runas, ordem interna e metas para todos os status. A coluna SPD combina o
  Tick com o bônus calculado para líder, torre de 15% e Swift.
- Estados sem resultados, sem counters e página 404.
- Interface responsiva, navegação por teclado e catálogo legível sem JavaScript.
- Retratos e fontes locais; falha de imagem usa iniciais como fallback.
- Spd Tuning para Siege, Arena e RTA, com estado compartilhável na URL.
- Comparador estrutural de SPD e calculadora de breakpoints de Tick.
- Interface e rotas canônicas em inglês e português.

## Conteúdo inicial

O site contém **6 defesas e 21 counters**, além do catálogo de monstros
importado. Os matchups e as sugestões de runas são pontos de partida,
**não estratégias competitivas validadas**, e não apresentam estatísticas de
vitória.

## Editar o catálogo

Os dados ficam em três arquivos JSON:

| Arquivo                  | Responsabilidade                                        |
| ------------------------ | ------------------------------------------------------- |
| `src/data/monsters.json` | Nomes, aliases, elementos, estrelas naturais e retratos |
| `src/data/defenses.json` | Equipes de defesa e categoria de torre                  |
| `src/data/counters.json` | Ofensivas, instruções, builds e fontes                  |

1. Cadastre os monstros que faltarem em `monsters.json`. O `id` deve ser único,
   em minúsculas, com hífens; `element` aceita `fire`, `water`, `wind`, `light`
   ou `dark`. `naturalStars` representa a raridade natural, não as estrelas
   após evolução. Para segundo despertar, mantenha a raridade natural.
2. Adicione o retrato em `public/monsters/` e use `/monsters/arquivo.png` no
   campo `image`, ou omita `image` para usar o fallback com iniciais.
3. Crie a defesa com exatamente três IDs distintos em `team`. O primeiro monstro
   é sempre o líder e aparece à esquerda; não há um campo `leader` separado.
   `tower` aceita `4star` ou `open`. O catálogo mostra os monstros, nomes e badges
   de elemento; `label` e `description` são usados somente na página de detalhes.
4. Crie os counters com `defenseId` correspondente. Cada counter tem seu próprio
   `id`, equipe e uma `instruction` curta. Nos counters, o primeiro integrante de
   `team` também é sempre o líder. `turnOrder` pode ser um array vazio se não
   houver ordem documentada. Cada entrada de `runes` aceita `monsterId`, os sets
   e um objeto opcional `stats`. Em `stats`, `hp`, `attack` e `defense`
   representam bônus adicionais; `critRate`, `critDamage`, `resistance` e
   `accuracy` representam metas finais. Use `preferredStats` para marcar um
   atributo como `Desejável` sem inventar um valor. O campo numérico `tick`
   define o breakpoint; a SPD adicional é calculada automaticamente com a SPD
   base, o líder em `team[0]`, torre de 15% e Swift quando presente nos sets.
   `sources` também pode ser vazio.
5. Rode `pnpm test`, `pnpm build` e `pnpm test:e2e`, confira o resultado e
   publique novamente.

Exemplo de fonte em um counter:

```json
{
  "title": "Análise da composição",
  "url": "https://seu-dominio.com/analise"
}
```

A validação do catálogo interrompe o build se houver IDs duplicados,
referências inexistentes, equipes inválidas, monstros 5★
em torres 4★ (inclusive na ofensiva) ou URLs de fonte inválidas.

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
scripts/            Importação e manutenção de dados
tests/             Testes do catálogo e fluxos no navegador
```

## Verificação

```sh
pnpm test      # busca e integridade do catálogo
pnpm build     # tipos Astro/TypeScript e geração estática
pnpm test:e2e  # fluxos em desktop e viewport mobile (rode o build antes)
```

Os testes de navegador usam Playwright com o Google Chrome instalado
(`channel: "chrome"`). Em outra máquina, instale Chrome ou ajuste
`playwright.config.ts` para usar um Chromium do Playwright. O servidor local é
de preview é iniciado automaticamente pelo teste, usando o build em `dist/`.
A viewport mobile é emulada no Chromium;
não substitui uma verificação em um dispositivo físico com Safari.

## Créditos e fontes

- Os símbolos de elemento em `src/components/ElementIcon.astro` reutilizam
  os ícones vetoriais do projeto: chama, gota, vento, sol e lua. São exibidos
  em 16 px sobre um círculo preto parcialmente recortado no canto superior
  direito dos retratos.
- Metadados e retratos dos monstros consultados no
  [SWARFARM](https://github.com/swarfarm/swarfarm#api), com URLs de origem
  preservadas em cada registro de `monsters.json`. Esses dados foram baixados
  durante a criação; não há consulta ao SWARFARM durante build ou navegação.
- Summoners War, nomes e imagens dos personagens pertencem à Com2uS. Este é
  um projeto independente da comunidade, sem vínculo oficial.
- Fonte DM Sans distribuída localmente por
  [Fontsource](https://fontsource.org/fonts/dm-sans), sob a licença OFL incluída
  no pacote.
- A ferramenta Spd Tick tem como referência o
  [calculador indicado no briefing](https://00peanuts.pages.dev/apps/sw-tick-calculator/).

Referências de implementação: [instalação do Astro](https://docs.astro.build/en/install-and-setup/)
e [roteamento estático](https://docs.astro.build/en/guides/routing/).
