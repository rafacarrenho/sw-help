# Catálogo central de monstros

## Decisões

O usuário autorizou implementar a feature completa sem perguntas. O catálogo
local será a fonte única de monstros para Siege e ferramentas futuras.

- Importar todos os registros da API pública SWARFARM, inclusive formas não
  despertadas, despertadas, segundo despertar e registros não obtíveis. Expor
  essas diferenças claramente, sem confundir formas com monstros únicos.
- Preservar IDs existentes por ID de origem; novos registros recebem IDs
  determinísticos com o identificador SWARFARM. Manter retratos locais.
- Adicionar item de menu, listagem paginada, busca por nome/família, filtros de
  elemento, raridade natural, forma e habilidade de líder. URLs compartilham
  os filtros. Ordenar por nome, raridade ou velocidade base.
- Páginas estáticas individuais apresentam retrato, nome, família, elemento,
  estrelas naturais, forma, tipo, velocidade base, líder e outros integrantes
  da família. Vincular as composições do Siege aos detalhes dos monstros.
- Reutilizar os badges aprovados e o componente de monstro existente.

## Arquitetura

`src/data/monsters.json` armazena a base normalizada. Metadados da importação
registram fonte, data e total. Um script explícito atualiza os dados e baixa
os retratos, sem acesso externo durante build ou uso do site.

As páginas da listagem têm 48 registros e navegação estática para funcionar
sem JavaScript. A busca carrega um índice JSON local sob demanda e renderiza
somente a página atual. Nenhuma busca depende de servidor ou API externa.
Detalhes usam a mesma base e IDs. Habilidades futuras e histórico de patches
poderão referenciar esses IDs sem duplicar os dados de identidade.

## Validação

Validar unicidade, referências, relações de formas, integridade da importação
e existência dos retratos. Testar busca, filtros combinados, paginação, URL,
voltar do detalhe, estado vazio, ausência de JavaScript e navegação do Siege.
Executar build e conferir visualmente desktop e celular.
