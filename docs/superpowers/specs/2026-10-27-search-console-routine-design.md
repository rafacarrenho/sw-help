# Integração e rotina do Google Search Console

Data: 2026-10-27

## Contexto

O servidor Search Console já estava conectado ao Codex e a conta Google já
enxergava `sc-domain:playerdojo.com`, mas o service account usado pelo servidor
autorizava somente `sc-domain:luabify.com`. O repositório também não possuía uma
rotina operacional nem uma baseline própria.

## Alternativas consideradas

1. Reutilizar o servidor conectado e registrar um workflow local do projeto.
   Mantém credenciais fora do repositório, permite consultas sob demanda e segue
   o padrão já usado no Luabify. Esta é a abordagem adotada.
2. Criar um script Node com a API do Google e credenciais locais. Duplicaria a
   integração, aumentaria a superfície de segredo e não agregaria valor ao site
   Astro estático.
3. Criar uma automação agendada em CI. Pode ser útil no futuro, mas exigiria
   credenciais no provedor e uma política de atualização automática que não é
   necessária para estabelecer a rotina atual.

## Desenho adotado

- Autorizar `sc-domain:playerdojo.com` no service account existente.
- Manter a integração fora do código entregue ao navegador.
- Criar uma skill local acionada por tarefas de SEO, tráfego, indexação e
  sitemap.
- Consultar dados completos, excluindo dias parciais, e comparar janelas
  equivalentes.
- Versionar somente resumos agregados e úteis para decisões.
- Manter snapshots datados imutáveis e um ponteiro para a baseline atual.

## Fluxo de dados

Codex consulta o servidor Search Console, que usa o service account autorizado
para ler a propriedade do domínio. A análise produz um resumo agregado em
`.codex/archive/seo/`. O arquivo `.codex/state/SEO_BASELINE_CURRENT.md` aponta
para o snapshot validado mais recente.

Nenhuma credencial, token ou dado do Search Console participa do build do Astro
ou do runtime público.

## Segurança e falhas

- A leitura é o padrão. Operações mutáveis continuam dependendo de solicitação
  explícita do usuário.
- Se a propriedade deixar de aparecer na conta autorizada, a análise deve parar
  e relatar o problema.
- Dias recentes parciais não entram em comparações.
- Consultas anonimizadas, baixo volume e campos incompletos do endpoint de
  sitemap devem ser declarados como limitações.

## Validação

A integração é considerada operacional quando:

- a conta lista `sc-domain:playerdojo.com`;
- uma consulta de desempenho retorna linhas;
- o sitemap pode ser lido;
- a skill passa pelo validador de skills;
- os documentos não contêm o caractere proibido U+2014.
