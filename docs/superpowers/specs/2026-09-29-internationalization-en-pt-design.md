# Internacionalização em inglês e português

## Objetivo

Internacionalizar todo o SW Help em inglês e português brasileiro antes da
instrumentação de Analytics e Search Console. O inglês será o idioma principal
e canônico do produto, sem prefixo na URL. O português brasileiro ficará sob o
prefixo `/pt/`.

A implementação deve deixar a inclusão futura de idiomas como espanhol
previsível, sem duplicar a lógica das ferramentas ou traduzir dados oficiais do
jogo que chegam da API.

## Escopo

A primeira entrega cobrirá todas as páginas existentes:

- Siege Counter e detalhes de defesas;
- catálogo, paginação e detalhes de monstros;
- Comparador de SPD;
- Spd Tuning;
- Spd Tick;
- navegação, rodapé e página de erro.

Serão traduzidos a interface, os metadados de SEO, as mensagens de interação e
o conteúdo autoral do projeto. Nomes de monstros, famílias, habilidades,
descrições de habilidades e outros dados importados da API permanecerão como
recebidos, normalmente em inglês.

Termos reconhecidos pela comunidade, como `Siege`, `SPD`, `Tick`, `Swift`,
`Violent` e `Will`, não serão traduzidos artificialmente.

## Estratégia de URLs

O Astro usará `en` como locale padrão sem prefixo. `pt-BR` será associado ao
prefixo `/pt/`. O idioma será determinado apenas pela URL, sem redirecionamento
baseado em navegador, cookie ou `localStorage`.

Mapa inicial de rotas:

| Inglês                  | Português brasileiro         |
| ----------------------- | ---------------------------- |
| `/`                     | `/pt/`                       |
| `/siege/:id/`           | `/pt/siege/:id/`             |
| `/monsters/`            | `/pt/monstros/`              |
| `/monsters/:id/`        | `/pt/monstros/:id/`          |
| `/monsters/page/:page/` | `/pt/monstros/pagina/:page/` |
| `/speed-comparison/`    | `/pt/comparador-spd/`        |
| `/speed-tuning/`        | `/pt/spd-tuning/`            |
| `/speed-tick/`          | `/pt/spd-tick/`              |

IDs de monstros e defesas serão iguais em todos os idiomas. Query parameters
também continuarão independentes de idioma e serão preservados ao usar o
seletor de idioma.

## Compatibilidade com URLs atuais

As rotas portuguesas atuais que não serão reutilizadas pelo inglês receberão
redirecionamentos permanentes para suas novas versões sob `/pt/`:

- `/monstros/...` para `/pt/monstros/...`;
- `/comparador-spd/` para `/pt/comparador-spd/`;
- `/spd-tuning/` para `/pt/spd-tuning/`;
- `/spd-tick/` para `/pt/spd-tick/`.

Os redirecionamentos preservarão query parameters.

A raiz `/` e as rotas `/siege/:id/` passarão a servir inglês. Não é possível
preservar o conteúdo português nessas URLs e simultaneamente usá-las como URLs
canônicas do inglês. As versões portuguesas serão `/pt/` e
`/pt/siege/:id/`.

## Arquitetura das páginas

Rotas não conterão a implementação completa das telas. Cada par de rotas
localizadas carregará o mesmo componente de página e informará apenas o locale
correspondente. Dessa forma, regras, marcação e comportamento interativo terão
uma única implementação.

Um módulo central de internacionalização será responsável por:

- definir e validar os locales suportados;
- carregar dicionários tipados;
- mapear nomes de rotas para slugs localizados;
- gerar URLs no locale atual ou no locale alternativo;
- preservar IDs, paginação e query parameters durante a troca de idioma;
- formatar números e datas com o locale correto;
- expor às páginas somente as mensagens necessárias.

O suporte nativo de i18n do Astro será configurado com `en` como locale padrão,
`pt-BR` sob o caminho `pt` e `prefixDefaultLocale: false`. Um mapa próprio de
rotas complementará esse suporte, pois os slugs também serão traduzidos.

## Dicionários da interface

Textos de interface ficarão em módulos separados por locale. O dicionário
inglês definirá o contrato de chaves e o dicionário português deverá satisfazer
o mesmo tipo em tempo de compilação.

Os dicionários cobrirão:

- títulos, descrições, navegação e rodapé;
- labels, placeholders e opções de formulários;
- textos de acessibilidade e tooltips;
- estados vazios, avisos e mensagens de erro;
- rótulos de elementos, atributos, áreas e fontes do catálogo;
- textos gerados após interações;
- títulos, descrições e dados Open Graph para SEO.

Chaves não serão formadas por frases usadas como identificador. Cada mensagem
terá um nome semântico estável, permitindo alterar o texto inglês sem quebrar a
tradução portuguesa.

## Conteúdo autoral e dados do catálogo

Os arquivos principais de defesas e counters continuarão em `src/data/`, mas
guardarão apenas estrutura e valores independentes do idioma. Campos autorais
localizados serão movidos para arquivos por locale:

```text
src/data/
  defenses.json
  counters.json
  locales/
    en/
      defenses.json
      counters.json
    pt-BR/
      defenses.json
      counters.json
```

Em defesas, `label` e `description` serão localizados. Em counters,
`instruction` será localizado. As traduções serão indexadas pelo ID estável da
defesa ou do counter.

Nomes, famílias, aliases, habilidades, descrições de habilidades e demais
campos importados em `monsters.json`, `skills.json` e metadados relacionados
não serão traduzidos. Valores técnicos usados em filtros e cálculos também não
mudarão; somente seus rótulos visíveis serão localizados.

A validação do catálogo verificará que:

- cada defesa e counter tem conteúdo autoral nos dois locales;
- nenhum arquivo localizado referencia um ID inexistente;
- não existem traduções órfãs ou chaves duplicadas;
- os dados estruturais continuam válidos depois da separação do texto.

Ausências serão detectadas por testes ou build, em vez de depender de fallback
silencioso em produção.

## Scripts interativos

Os scripts do navegador não terão frases em inglês ou português codificadas
diretamente. Cada página serializará um pequeno objeto com as mensagens usadas
por aquela ferramenta, já no idioma atual.

Esse objeto cobrirá resultados, opções produzidas dinamicamente, mensagens de
validação, estados vazios, texto de cópia e conteúdo anunciado por regiões
`aria-live`. O cliente não receberá o dicionário completo nem os dois idiomas.

Valores persistidos na URL continuarão neutros, como IDs, números e nomes de
modo. Assim, o mesmo estado pode ser aberto nos dois idiomas sem conversão.

## Seletor de idioma

O bloco inferior atual da sidebar com “Conhecimento é vantagem”, “Prepare seu
time” e “Feito para a comunidade” será removido. Em seu lugar entrará um
seletor compacto com ícone e links reais para `English` e `Português`.

O seletor:

- apontará para a versão equivalente da página atual;
- marcará o locale ativo com `aria-current` e indicação visual;
- funcionará sem JavaScript;
- manterá query parameters relevantes;
- continuará legível no menu móvel;
- mostrará uma versão compacta acessível quando a sidebar estiver recolhida.

Os demais links, breadcrumbs, paginação e ações de retorno serão produzidos
por helpers localizados para que a navegação nunca saia acidentalmente do
idioma atual.

## SEO

Cada resposta localizada terá:

- `<html lang="en">` ou `<html lang="pt-BR">`;
- título e meta description traduzidos;
- canonical absoluto apontando para a própria versão sem query parameters;
- alternates `hreflang="en"`, `hreflang="pt-BR"` e `hreflang="x-default"`;
- Open Graph com locale e URL correspondentes.

O sitemap incluirá as duas versões canônicas de cada página e seus alternates.
Páginas de ferramenta com estado em query parameters terão canonical para a
rota limpa, evitando que cada configuração compartilhável seja tratada como
uma página diferente.

Rotas sem tradução não serão publicadas usando conteúdo de outro idioma sob
uma URL localizada. A cobertura obrigatória dos dois locales torna fallback de
conteúdo desnecessário.

## Falhas e estados inválidos

Uma rota localizada inexistente retornará 404 no idioma inferido pelo prefixo.
IDs de monstros e defesas inexistentes continuarão retornando 404, sem cair na
versão de outro idioma.

O helper de URLs rejeitará nomes de rota, locales e parâmetros obrigatórios
inválidos durante desenvolvimento. No cliente, query parameters inválidos
continuarão usando os fallbacks seguros já definidos por cada ferramenta.

Se uma imagem ou dado opcional estiver ausente, o fallback visual atual será
mantido e seu texto acessível será localizado.

## Testes

Testes unitários cobrirão:

- paridade de chaves entre os dicionários;
- cobertura e integridade das traduções de defesas e counters;
- geração de todas as rotas em inglês e português;
- mapeamento reverso usado pelo seletor;
- preservação de IDs, paginação e query parameters;
- formatação por locale;
- ausência de textos de interface codificados nos scripts interativos.

Testes de navegação cobrirão, nos dois idiomas:

- carregamento da home e das ferramentas;
- navegação pela sidebar e breadcrumbs;
- troca de idioma na home, em detalhes dinâmicos e em páginas paginadas;
- preservação do estado do Comparador de SPD e demais ferramentas;
- busca, filtros, estados vazios e mensagens dinâmicas;
- idioma, canonical e `hreflang` no documento;
- redirecionamentos das URLs portuguesas antigas;
- 404 localizado;
- seletor na sidebar expandida, recolhida e móvel.

A validação final executará `pnpm test`, `pnpm build` e `pnpm test:e2e` após o
build, conforme as regras do projeto.

## Fora de escopo

Esta entrega não instalará Analytics ou Search Console, não adicionará espanhol
e não traduzirá dados oficiais importados. Também não implementará escolha
automática de idioma por geolocalização ou cabeçalho do navegador.
