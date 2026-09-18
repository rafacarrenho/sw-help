# SW Help — primeira versão do Siege Counter

## Objetivo e decisões confirmadas

Criar nesta pasta um site Astro, inteiramente frontend, reunindo helpers de
Summoners War. O foco desta entrega é o Siege Counter. Spd Tuning e Spd Tick
aparecem apenas no menu, desabilitados e com o texto “Em breve”.

O usuário escolheu manter o catálogo em arquivos do projeto. Cada publicação
distribui a mesma versão do catálogo para todos os visitantes. Não haverá
backend, autenticação ou editor de conteúdo pelo navegador nesta versão.

## Proposta para aprovação

### Experiência

- Página inicial dedicada ao catálogo de defesas de Siege.
- Interface em português, tema escuro, detalhes em âmbar e layout responsivo.
- Navegação lateral no desktop e navegação compacta no celular.
- Busca por nomes de monstros, aceitando múltiplos nomes sem depender da ordem,
  de maiúsculas ou de acentos. Aliases podem ser definidos no catálogo.
- Filtros combináveis para torres restritas a 4★ e torres sem essa restrição.
- Cards com a composição de três monstros, indicação do líder, tipo de torre
  e quantidade de counters cadastrados.
- Cada defesa leva a uma página com endereço próprio, sua composição e a lista
  de counters. Cada counter mostra três monstros, líder quando aplicável,
  estratégia, ordem sugerida de ações, runas e cuidados quando documentados.
- Busca e filtro ficam nos parâmetros da URL, permitindo compartilhar a busca
  e recuperá-la ao voltar de uma página de defesa.
- Estado sem resultados com ação para limpar filtros; defesas sem counters
  apresentam uma mensagem explícita.

### Conteúdo e confiabilidade

O catálogo separa monstros, defesas e counters. Monstros têm identificador,
nome, aliases, elemento e referência de retrato opcional. Defesas têm
identificador, três referências de monstros, líder opcional, categoria de torre
e notas. Counters têm identificador, defesa de destino, três referências de
monstros, líder opcional, estratégia, recomendações e fontes quando disponíveis.

A primeira versão pode incluir um pequeno catálogo demonstrativo, claramente
identificado como exemplo sem validação competitiva. Não apresentar taxa de
vitória, popularidade ou garantia de sucesso sem dados reais. Counters
documentados devem indicar sua fonte; exemplos não devem parecer recomendações
validadas. Imagens ausentes usam um fallback com nome e elemento.

### Arquitetura

- Astro com saída estática e TypeScript.
- Layout compartilhado para identidade visual e navegação.
- Componentes separados para monstros, composições, cards de defesa e counters.
- Dados tipados e validados no build: IDs únicos, referências existentes,
  equipes com exatamente três monstros e líder pertencente à equipe.
- Páginas de defesa geradas no build a partir do catálogo.
- JavaScript nativo apenas para busca e filtros; React não é necessário para
  este escopo. O catálogo e os detalhes permanecem legíveis sem JavaScript.
- Nenhuma consulta externa é necessária durante o uso do site.
- README com comandos de desenvolvimento, build e atualização do catálogo.

### Acessibilidade e validação

- Campos com labels, foco visível, controles operáveis por teclado e contraste
  legível; elementos desabilitados não levam a páginas inexistentes.
- Nomes e elementos também aparecem em texto, sem depender apenas de cores.
- Verificar build estático, tipos e integridade das referências do catálogo.
- Verificar busca com múltiplos nomes, filtros combinados, resultado vazio,
  recuperação da busca pela URL e navegação para detalhes.
- Conferir layout em desktop e celular e navegação por teclado.

## Fora desta entrega

Calculadoras de velocidade e ticks, login, backend, cadastro pelo site, votação,
estatísticas de partidas, importação de conta e sugestões automáticas com base
nos monstros do jogador.

## Critério de conclusão

O usuário consegue abrir o catálogo, localizar uma defesa, acessar seus
counters e consultar as orientações cadastradas. O projeto gera um site estático
e permite adicionar conteúdo editando arquivos documentados. Spd Tuning e Spd
Tick permanecem visíveis e desabilitados.

## Revisão da proposta

Escopo limitado ao Siege Counter; armazenamento definido pelo usuário; ausência
de backend preservada; exemplos diferenciados de conteúdo validado; critérios
de conclusão e validação definidos. Após a apresentação da proposta, o usuário
reiterou a escolha por arquivos no projeto; a implementação seguiu esse escopo.
