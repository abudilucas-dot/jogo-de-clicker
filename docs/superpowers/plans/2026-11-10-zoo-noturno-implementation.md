# Zoo Noturno Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar o Zoo Noturno como um jogo clicker web original, responsivo e persistente, com conta, ranking opt-in e progressão completa.

**Architecture:** Um cliente React/Vinext mantém a simulação imediata para boa resposta ao toque e encapsula a economia em funções puras. Um adaptador de persistência começa em `localStorage` para visitantes e usa Supabase para autenticação, dados por jogador, placar e validação de sincronização; o servidor é a fonte de verdade para sessões autenticadas. Conteúdo (animais, habitats, geradores, upgrades e conquistas) vive em catálogos tipados, separados da interface.

**Tech Stack:** React, TypeScript, Vinext, Vite/Vitest, Testing Library, Supabase Auth/Postgres/Edge Functions, CSS modular com variáveis de design, GitHub e Sites.

**Spec:** `docs/superpowers/specs/2026-11-10-zoo-noturno-design.md`

## Global Constraints

- Não reutilizar arte, código, textos, nomes ou identidade visual da referência; todos os assets e textos são originais.
- Entregar interface responsiva para celular e desktop, com controles de teclado, foco visível, contraste e redução de movimento/som.
- Patas são a moeda principal; Luz lunar é moeda de prestígio; produção offline possui teto de 8 horas.
- Prestígio reinicia Patas e geradores, mas mantém áreas, melhorias de habitat, coleção, conquistas e Luz lunar.
- Visitantes jogam sem login; o ranking é opt-in e mostra somente apelido público.
- Progresso autenticado é validado no servidor; nunca expor `service_role` ou segredo do Supabase ao navegador.
- Toda tabela do schema `public` exposta à Data API usa RLS e políticas restritas por proprietário.
- Fixar versões e versionar o lockfile. Publicar inicialmente como Site privado.

## Review Focus

- Relógio local manipulado ou ausência por mais de 8 horas: crédito offline deve ser limitado e nunca negativo.
- Save local e conta com estados concorrentes: só estado válido e mais avançado pode prevalecer, sem duplicar moeda.
- Duplo clique, toque repetido e reenvio de sincronização: ações idempotentes não podem produzir Patas extras no backend.
- Usuário fora do ranking: perfil e pontuação jamais devem aparecer nas consultas públicas.
- Redução de movimento, navegação por teclado e viewport estreito: o ciclo de jogar continua utilizável sem depender de animação ou hover.

---

## Estrutura de arquivos

- `src/game/economy.ts`: fórmulas puras de clique, custo, produção, ganho offline e prestígio.
- `src/game/types.ts`: contratos de estado, catálogo, save e eventos.
- `src/content/zoo.ts`: catálogo inicial dos cinco habitats, animais, geradores, upgrades e conquistas.
- `src/game/reducer.ts`: transições determinísticas de jogo local.
- `src/storage/local-save.ts`: serialização, validação e migração de save visitante.
- `src/storage/sync.ts`: cliente de sincronização e resolução explícita de estado mais avançado.
- `src/features/play/*`: placar, panda clicável, lista de geradores e upgrades.
- `src/features/zoo/*`: mapa, álbum, conquistas, prestígio e configurações.
- `src/features/account/*`: sessão, migração de visitante e controle de ranking.
- `src/features/leaderboard/*`: ranking semanal/geral e estados de privacidade.
- `src/styles/*`: tokens de Zoo Noturno, layout adaptativo e modo de movimento reduzido.
- `supabase/migrations/*`: schema, índices, RLS e funções RPC mínimas.
- `supabase/functions/*`: endpoints autenticados para aplicar eventos, conceder progresso offline e atualizar ranking.
- `tests/*`: testes de economia, reducer, persistência, componentes e integração do adaptador.

### Task 1: Fundação do repositório e entrega privada

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/styles/base.css`, `.env.example`, `.gitignore`, `.openai/hosting.json`
- Create: `tests/setup.ts`, `tests/app.test.tsx`
- Modify: `README.md`

**Interfaces:**
- Produces: `npm run dev`, `npm run test`, `npm run build` e a raiz `App` para as tarefas de interface.

- [ ] **Step 1: Criar o teste falho de renderização da aplicação**

```tsx
it('renders the Zoo Noturno shell', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: /zoo noturno/i })).toBeInTheDocument()
})
```

- [ ] **Step 2: Rodar o teste para confirmar a falha**

Run: `npm run test -- tests/app.test.tsx`

Expected: FAIL porque a aplicação ainda não existe.

- [ ] **Step 3: Configurar Vinext/React/TypeScript, Vitest e o shell mínimo de `App`**

Incluir scripts de desenvolvimento, teste, typecheck e build; fixar dependências e lockfile. Adicionar variáveis públicas do Supabase apenas como nomes vazios em `.env.example`, nunca valores secretos. Configurar `.openai/hosting.json` após obter o identificador do Site privado.

- [ ] **Step 4: Rodar validações da fundação**

Run: `npm run test -- tests/app.test.tsx && npm run build`

Expected: PASS; build contém o artefato estático configurado.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json index.html src tests .env.example .gitignore README.md .openai/hosting.json
git commit -m "chore: scaffold zoo noturno web game"
```

### Task 2: Economia, catálogo e estado de jogo local

**Files:**
- Create: `src/game/types.ts`, `src/game/economy.ts`, `src/game/reducer.ts`, `src/content/zoo.ts`
- Test: `tests/game/economy.test.ts`, `tests/game/reducer.test.ts`, `tests/content/zoo.test.ts`

**Interfaces:**
- Produces: `calculateClickReward(state)`, `calculateGeneratorCost(generator, quantity)`, `calculateProductionPerSecond(state)`, `calculateOfflineReward(state, now)`, `calculatePrestigeReward(state)`, `reduceGame(state, action)` e `INITIAL_CATALOG`.

- [ ] **Step 1: Escrever testes falhos para economia e transições**

```ts
expect(calculateOfflineReward(state, state.lastSavedAt + 9 * HOUR)).toEqual(
  productionForEightHours,
)
expect(reduceGame(state, { type: 'PRESTIGE' }).unlockedHabitatIds).toEqual(state.unlockedHabitatIds)
expect(reduceGame(state, { type: 'PRESTIGE' }).paws).toBe(0)
```

- [ ] **Step 2: Rodar os testes de domínio para confirmar a falha**

Run: `npm run test -- tests/game tests/content`

Expected: FAIL por módulos ausentes.

- [ ] **Step 3: Implementar os contratos e a economia determinística**

Usar dinheiro e custos como inteiros finitos; recusar resultados negativos ou não finitos. Criar cinco habitats: Bosque de Bambu/panda, Savana de Neon/zebra, Jardim da Lua/raposa, Aquário Prismático/axolote e Selva de Estrelas/tigre. Definir marcos iniciais no catálogo para que cada compra e desbloqueio possa ser apresentado pela interface.

- [ ] **Step 4: Rodar os testes de domínio**

Run: `npm run test -- tests/game tests/content`

Expected: PASS, incluindo teto offline de 8 horas e retenção de áreas/melhorias após prestígio.

- [ ] **Step 5: Commit**

```bash
git add src/game src/content tests/game tests/content
git commit -m "feat: add clicker economy and zoo progression"
```

### Task 3: Save visitante e sincronização com resolução de conflitos

**Files:**
- Create: `src/storage/local-save.ts`, `src/storage/sync.ts`, `src/storage/save-schema.ts`
- Test: `tests/storage/local-save.test.ts`, `tests/storage/sync.test.ts`

**Interfaces:**
- Consumes: `GameState`, `reduceGame` e `calculateOfflineReward`.
- Produces: `loadLocalSave(): GameState | null`, `saveLocal(state: GameState): void`, `selectMostAdvancedSave(local: GameState, remote: GameState): GameState`, `GameSyncClient`.

- [ ] **Step 1: Escrever testes falhos de serialização e de seleção de save**

```ts
expect(selectMostAdvancedSave(smallerSave, largerSave)).toEqual(largerSave)
expect(loadLocalSave()).toBeNull() // para JSON inválido
```

- [ ] **Step 2: Rodar os testes de storage para confirmar a falha**

Run: `npm run test -- tests/storage`

Expected: FAIL por adaptadores ausentes.

- [ ] **Step 3: Implementar save versionado e sincronização idempotente**

Versionar o payload, validar conteúdo ao ler e preservar o estado de maior progresso válido quando existe divergência. Definir uma chave de operação (`eventId`) para toda sincronização remota, evitando crédito duplicado em reenvios.

- [ ] **Step 4: Rodar os testes de storage**

Run: `npm run test -- tests/storage`

Expected: PASS para JSON corrompido, migração de versão e conflitos local/remoto.

- [ ] **Step 5: Commit**

```bash
git add src/storage tests/storage
git commit -m "feat: persist visitor progress and resolve save conflicts"
```

### Task 4: Backend Supabase seguro

**Files:**
- Create: `supabase/config.toml`, `supabase/migrations/<generated>_zoo_schema.sql`
- Create: `supabase/functions/apply-game-event/index.ts`, `supabase/functions/leaderboard/index.ts`
- Create: `tests/integration/supabase-contract.test.ts`
- Modify: `.env.example`, `src/storage/sync.ts`

**Interfaces:**
- Consumes: `GameSyncClient`, sessões Supabase Auth e payloads `GameEvent` com `eventId`.
- Produces: tabelas `player_profiles`, `game_saves`, `game_events`, `leaderboard_entries`; RPC/Edge Function autenticada `apply-game-event`; consulta pública somente para jogadores opt-in.

- [ ] **Step 1: Consultar o changelog e documentação atuais do Supabase e criar testes de contrato falhos**

Registrar as versões/APIs verificadas no README técnico. Cobrir isolamento por `user_id`, rejeição de um `eventId` repetido e exclusão de jogador não participante do ranking.

- [ ] **Step 2: Executar os testes de contrato para confirmar a falha**

Run: `npm run test -- tests/integration/supabase-contract.test.ts`

Expected: FAIL até existir projeto local/configurado e contrato implementado.

- [ ] **Step 3: Criar migration pelo Supabase CLI e implementar políticas e funções**

Descobrir comandos via `supabase --help` antes de usar o CLI. Habilitar RLS em toda tabela `public`; políticas de leitura/escrita com `TO authenticated` e propriedade `auth.uid() = user_id`; nenhuma chave privilegiada no cliente. Processar progresso offline no endpoint autenticado com teto de 8 horas e idempotência por `eventId`; permitir leitura de placar somente para apelido/pontuação de participantes opt-in.

- [ ] **Step 4: Verificar segurança e contratos do backend**

Run: `supabase db advisors && npm run test -- tests/integration/supabase-contract.test.ts`

Expected: sem alerta crítico de RLS e testes PASS.

- [ ] **Step 5: Commit**

```bash
git add supabase src/storage .env.example tests/integration README.md
git commit -m "feat: add secure account saves and leaderboard backend"
```

### Task 5: Ciclo jogável e visual Zoo Noturno

**Files:**
- Create: `src/features/play/GameScreen.tsx`, `src/features/play/AnimalButton.tsx`, `src/features/play/GeneratorPanel.tsx`, `src/features/play/UpgradePanel.tsx`
- Create: `src/styles/tokens.css`, `src/styles/game.css`
- Test: `tests/features/play/GameScreen.test.tsx`, `tests/features/play/AnimalButton.test.tsx`
- Modify: `src/App.tsx`, `src/styles/base.css`

**Interfaces:**
- Consumes: `GameState`, `reduceGame`, `INITIAL_CATALOG`.
- Produces: `GameScreen` que recebe `{ state: GameState; dispatch: Dispatch<GameAction> }`.

- [ ] **Step 1: Escrever testes falhos de clique e compra**

```tsx
await user.click(screen.getByRole('button', { name: /panda/i }))
expect(screen.getByText(/patas: 1/i)).toBeInTheDocument()
expect(screen.getByRole('button', { name: /comprar bambu/i })).toBeEnabled()
```

- [ ] **Step 2: Rodar testes da tela de jogo para confirmar a falha**

Run: `npm run test -- tests/features/play`

Expected: FAIL por componentes ausentes.

- [ ] **Step 3: Implementar a tela de jogo responsiva e original**

Aplicar tokens azul profundo, roxo elétrico e ciano; usar panda/bambu com assets originais ou CSS/SVG próprios. Mostrar Patas, Patas/segundo, Luz lunar, feedback de clique, seletor de quantidade 1/10/25/máximo, geradores e upgrades. Garantir rótulos acessíveis e estado visível sem depender apenas da cor.

- [ ] **Step 4: Rodar testes de interação e build**

Run: `npm run test -- tests/features/play && npm run build`

Expected: PASS e build estático concluído.

- [ ] **Step 5: Commit**

```bash
git add src/features/play src/styles src/App.tsx tests/features/play
git commit -m "feat: build neon zoo clicker gameplay"
```

### Task 6: Mapa, álbum, conquistas, prestígio e configurações

**Files:**
- Create: `src/features/zoo/MapScreen.tsx`, `src/features/zoo/AlbumScreen.tsx`, `src/features/zoo/AchievementsScreen.tsx`, `src/features/zoo/PrestigeDialog.tsx`, `src/features/zoo/SettingsScreen.tsx`, `src/features/zoo/navigation.tsx`
- Create: `src/styles/responsive.css`, `src/styles/accessibility.css`
- Test: `tests/features/zoo/PrestigeDialog.test.tsx`, `tests/features/zoo/navigation.test.tsx`, `tests/features/zoo/SettingsScreen.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: catálogo e ações do reducer.
- Produces: `ZooNavigation`, `PrestigeDialog`, páginas de coleção e configuração.

- [ ] **Step 1: Escrever testes falhos de navegação, prestígio e acessibilidade**

```tsx
expect(screen.getByText(/mantém áreas e melhorias/i)).toBeInTheDocument()
await user.click(screen.getByRole('button', { name: /reduzir movimento/i }))
expect(document.documentElement).toHaveAttribute('data-reduce-motion', 'true')
```

- [ ] **Step 2: Rodar testes das telas secundárias para confirmar a falha**

Run: `npm run test -- tests/features/zoo`

Expected: FAIL por componentes ausentes.

- [ ] **Step 3: Implementar as cinco telas e navegação adaptativa**

No desktop, manter barra lateral; no celular, navegação inferior e painéis deslizantes. Exibir silhuetas para animais bloqueados. Fazer o diálogo de prestígio listar expressamente o que reinicia e o que permanece. Persistir as preferências de som e movimento no save local.

- [ ] **Step 4: Rodar testes das telas secundárias**

Run: `npm run test -- tests/features/zoo`

Expected: PASS para confirmação de prestígio, navegação por teclado e redução de movimento.

- [ ] **Step 5: Commit**

```bash
git add src/features/zoo src/styles tests/features/zoo src/App.tsx
git commit -m "feat: add zoo collection prestige and settings"
```

### Task 7: Conta, migração e ranking opt-in

**Files:**
- Create: `src/features/account/AuthPanel.tsx`, `src/features/account/MigrateSaveDialog.tsx`, `src/features/account/ProfileScreen.tsx`, `src/features/leaderboard/LeaderboardScreen.tsx`
- Test: `tests/features/account/MigrateSaveDialog.test.tsx`, `tests/features/leaderboard/LeaderboardScreen.test.tsx`
- Modify: `src/App.tsx`, `src/storage/sync.ts`

**Interfaces:**
- Consumes: Supabase session, `GameSyncClient` e `selectMostAdvancedSave`.
- Produces: fluxo de login por e-mail, migração visitante→conta, `setLeaderboardOptIn(enabled, nickname)` e tela de placar.

- [ ] **Step 1: Escrever testes falhos para privacidade e migração**

```tsx
expect(screen.queryByText('Seu apelido público')).not.toBeInTheDocument()
await user.click(screen.getByRole('button', { name: /entrar no ranking/i }))
expect(screen.getByLabelText(/apelido público/i)).toBeRequired()
```

- [ ] **Step 2: Rodar testes de conta e ranking para confirmar a falha**

Run: `npm run test -- tests/features/account tests/features/leaderboard`

Expected: FAIL por recursos ausentes.

- [ ] **Step 3: Implementar sessão e placar com privacidade por padrão**

Oferecer migração transparente do visitante e explicar que o save de maior progresso vence. Exigir ação explícita e apelido válido antes de publicar no ranking. Exibir ranking semanal e geral apenas com campos públicos aprovados pelo backend.

- [ ] **Step 4: Rodar testes de conta/ranking e typecheck**

Run: `npm run test -- tests/features/account tests/features/leaderboard && npm run typecheck`

Expected: PASS; usuário opt-out não é renderizado como participante.

- [ ] **Step 5: Commit**

```bash
git add src/features/account src/features/leaderboard src/storage tests/features src/App.tsx
git commit -m "feat: add account migration and opt-in leaderboard"
```

### Task 8: Verificação final, GitHub e publicação privada

**Files:**
- Modify: `README.md`, `.openai/hosting.json`
- Create: `docs/release-checklist.md`

**Interfaces:**
- Consumes: build estático concluído, Site criado e remoto `origin` configurado para `https://github.com/abudilucas-dot/jogo-de-clicker.git`.
- Produces: commit enviado ao GitHub, versão arquivada e Site privado publicado.

- [ ] **Step 1: Criar checklist de release e falhas esperadas**

Cobrir first-run visitante, 8 horas offline, compra máxima, prestígio, login/migração, opt-in/out do ranking, viewport móvel, teclado e redução de movimento.

- [ ] **Step 2: Rodar toda a suíte antes da publicação**

Run: `npm run test && npm run typecheck && npm run build`

Expected: todos os comandos PASS.

- [ ] **Step 3: Fazer QA visível no navegador**

Executar o ciclo visitante de clique→compra→prestígio; confirmar navegabilidade em viewport móvel; testar migração/autenticação em ambiente Supabase configurado e verificar que o ranking não mostra jogador opt-out.

- [ ] **Step 4: Empacotar, enviar e publicar**

Criar o Site privado, persistir seu `project_id` no manifesto, executar o helper de empacotamento com o build validado, enviar a fonte ao `origin` e salvar/publicar somente o SHA enviado. Não publicar chaves, `.env` ou `service_role`.

- [ ] **Step 5: Confirmar deployment e registrar a versão**

Run: `git status --short --branch`

Expected: branch enviada ao GitHub, diretório limpo, deployment privado com URL retornada pela plataforma.

- [ ] **Step 6: Commit**

```bash
git add README.md .openai/hosting.json docs/release-checklist.md
git commit -m "docs: add zoo noturno release checklist"
```

## Self-review

- **Cobertura:** Tasks 2, 5 e 6 cobrem economia, conteúdo, prestígio, acessibilidade e as telas; Tasks 3, 4 e 7 cobrem visitante, conta, segurança e ranking; Task 8 valida e publica. Não há requisito do spec sem uma tarefa associada.
- **Consistência:** `GameState` e `GameAction` fluem de `types.ts` para reducer, storage e recursos; `eventId` é o contrato comum para sincronização idempotente.
- **Review focus:** cada risco recebe prova: teto offline (Task 2/4), conflitos/save (Task 3/7), eventos repetidos (Task 4), ranking opt-in (Task 4/7), responsividade/acessibilidade (Task 6/8).
- **Proporção:** o plano fixa interfaces e passos verificáveis sem antecipar corpo de componentes ou SQL específico que dependa das versões atuais do Supabase.
