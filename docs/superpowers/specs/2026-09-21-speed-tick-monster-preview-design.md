# Retratos e filtros em linha no Spd Tick

## Objetivo

Deixar a seleção do monstro mais visual e compacta na calculadora de Spd Tick,
mantendo Monstro e Torre SPD na mesma linha e exibindo o retrato selecionado
tanto no filtro quanto no cabeçalho dos resultados.

## Experiência

- Organizar os campos Monstro e Torre SPD em uma única linha em desktop e
  celular.
- Dar mais largura ao campo de monstro e manter Torre SPD compacto, sem reduzir
  os textos abaixo dos mínimos de legibilidade do projeto.
- Preservar o `select` nativo de monstro para manter navegação por teclado,
  semântica e comportamento consistente entre navegadores.
- Mostrar um retrato compacto do monstro selecionado à esquerda do `select`.
- Mostrar um retrato maior ao lado do nome no bloco `Monstro selecionado`.
- Atualizar os dois retratos, o fallback, o nome, a SPD base e os valores da
  tabela na mesma renderização quando a seleção mudar.

## Dados e componentes

Os dados serializados pela página passarão a incluir o caminho de imagem de cada
monstro. Não haverá nova fonte de dados nem consulta externa. Os dois retratos
usarão a mesma estrutura visual local, com `img` decorativa quando houver imagem
e as duas primeiras letras do nome como fallback quando ela estiver ausente.

Como o conteúdo muda no navegador, os retratos serão elementos da própria página
de Spd Tick em vez do componente Astro estático usado nos cards do catálogo. A
aparência seguirá o mesmo padrão de borda, fundo e recorte do catálogo.

## Responsividade e acessibilidade

O formulário usará duas colunas em todas as larguras, com proporção flexível
para o monstro e largura mínima para Torre SPD. Em telas pequenas, espaçamentos e
retrato serão reduzidos, mas os campos continuarão na mesma linha e terão altura
adequada para toque.

O nome continuará sendo o conteúdo acessível do controle. As imagens serão
decorativas porque o nome já aparece em texto. O fallback será ocultado de
tecnologias assistivas.

## Validação

- Testar que a seleção de outro monstro atualiza os dois retratos, o nome e a
  SPD base.
- Verificar o fallback para monstros sem imagem.
- Confirmar que os dois filtros permanecem lado a lado e que a página não cria
  overflow horizontal em desktop e celular.
- Executar `pnpm test`, `pnpm build` e o E2E específico de Spd Tick.

## Fora do escopo

Substituir o `select` por um combobox customizado, mostrar retratos para todas as
opções enquanto o menu nativo está aberto, adicionar busca de monstros ou alterar
os cálculos de velocidade.
