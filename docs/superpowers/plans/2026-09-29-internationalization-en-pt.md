# Implementação da internacionalização EN/PT

1. Criar o núcleo tipado de i18n, o mapa de rotas localizadas e testes para
   geração e troca de URLs.
2. Separar dados estruturais de defesas/counters do conteúdo autoral localizado
   e ampliar a validação do catálogo.
3. Extrair páginas compartilhadas e criar entradas finas para as rotas inglesas
   na raiz e portuguesas sob `/pt/`.
4. Localizar Layout, componentes reutilizáveis, catálogo e páginas de detalhe,
   incluindo metadados, canonical, `hreflang` e seletor de idioma.
5. Localizar Comparador de SPD, Spd Tuning e Spd Tick, passando mensagens
   específicas aos scripts do navegador sem duplicar a lógica.
6. Adicionar redirecionamentos das URLs portuguesas antigas, sitemap bilíngue e
   404 localizado.
7. Atualizar testes unitários e E2E para os dois idiomas e executar `pnpm test`,
   `pnpm build` e `pnpm test:e2e` após o build.

Planejamento registrado diretamente: a skill auxiliar `writing-plans` citada
pelo brainstorming não está instalada neste ambiente.
