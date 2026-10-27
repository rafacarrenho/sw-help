---
name: playerdojo-search-console
description: Consultar e interpretar dados do Google Search Console do PlayerDojo em tarefas de SEO, tráfego orgânico, indexação, sitemap, pesquisa de demanda e avaliação antes ou depois de mudanças públicas.
---

# PlayerDojo Search Console

## Contrato da integração

- Usar a propriedade `sc-domain:playerdojo.com`.
- O acesso ocorre pelo servidor Search Console conectado ao Codex. Não adicionar
  credenciais, tokens ou dependências do Google ao frontend estático.
- A conta configurada deve listar a propriedade antes de qualquer análise.
- Consultas são somente leitura por padrão. Envio ou remoção de sitemap,
  solicitação de indexação e alteração de contas exigem pedido explícito do
  usuário.

## Início de uma sessão

1. Executar `get_started` uma vez para confirmar as capacidades disponíveis.
2. Executar `accounts_manage` com `action: list` quando houver dúvida sobre a
   autorização da propriedade.
3. Identificar o último dia completo com `analytics_query`, dimensão `date`.
   Não incluir um dia recente claramente parcial apenas para aproximar a janela
   da data atual.
4. Registrar os intervalos exatos usados. Nunca descrever uma janela incompleta
   como "últimos 28 dias".

## Rotina de análise

Para revisões mensais e antes de priorizar trabalho de SEO:

1. Comparar 28 dias completos com os 28 dias completos anteriores usando
   `analytics_compare`.
2. Consultar `page`, `query`, `country` e `device` com `analytics_query`.
3. Consultar 90 dias quando o volume de uma página, idioma ou consulta for baixo.
4. Verificar sitemaps com `sitemaps_list` e, quando a tarefa envolver uma URL
   específica, verificar indexação e canonical com `inspection_inspect`.
5. Separar fatos retornados pela API de interpretações. Mudança simultânea não
   prova causalidade de uma alteração no site.

Para medir uma entrega, usar a data real de publicação como limite. Comparar
janelas completas equivalentes depois de 28 dias e repetir em 90 dias quando o
volume ainda for insuficiente. Segmentar pela URL e pelo grupo de consultas
afetados, sem depender apenas dos totais do domínio.

## Snapshot versionado

Quando a análise estabelecer uma nova referência:

1. Criar `.codex/archive/seo/SEO_BASELINE_YYYY-MM-DD.md`.
2. Registrar propriedade, mecanismo, tipo de pesquisa, data da captura, período
   consultado e corte de frescor.
3. Incluir métricas gerais e somente os recortes que sustentam decisões reais.
4. Registrar limitações, amostragem e dias parciais excluídos.
5. Atualizar `.codex/state/SEO_BASELINE_CURRENT.md` para apontar ao novo arquivo.
6. Manter snapshots antigos intactos.

Não versionar exports brutos com consultas potencialmente sensíveis quando um
resumo agregado for suficiente.

## Interpretação segura

- Tratar posição como média ponderada e não como posição fixa.
- Não somar linhas de consultas para reconstruir totais: consultas anonimizadas
  podem ser omitidas pela API.
- Preferir os totais de `analytics_compare`; recortes servem para diagnóstico.
- Um sitemap sem erros não prova que todas as URLs estão indexadas.
- O campo de URLs indexadas do endpoint de sitemap pode estar incompleto. Se ele
  divergir de dados de desempenho, confirmar URLs representativas com inspeção.
- Não inventar volume de busca, taxa de conversão, receita ou efeito causal.

## Evidência de conclusão

Ao relatar uma análise, informar:

- propriedade e intervalo consultados;
- último dia completo incluído;
- métricas e segmentos relevantes;
- limitações dos dados;
- arquivo de baseline atualizado, quando aplicável.
