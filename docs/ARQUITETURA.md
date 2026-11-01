# LEAMSE — Arquitetura do Ecossistema SaaS (Monólito Modular)

## 1. Arquitetura geral
- **Um backend** FastAPI (`backend/app`), API versionada em `/api/v1`, OpenAPI em `/api/docs`.
- **Um banco** MongoDB (nome vem de `DB_NAME`; em produção recomenda-se `empresa_saas`). Driver: PyMongo Async (`AsyncMongoClient`).
- **Núcleo (`app/core`)**: config, security, authentication, authorization, users, organizations, products_catalog, subscriptions, billing, audit.
- **Nove módulos de negócio (`app/products/*`)**, cada um com `api/ models/ schemas/ services/ repositories/ tests/`. Um produto só importa `core` e `shared` — nunca outro produto.
- **Nove aplicações React + TypeScript** (`frontend/src/products/*`), cada uma com `layouts/ components/ pages/ services/ hooks/ types/ utils/` próprios, montadas em caminhos separados (`/crm`, `/erp`, ...). Site institucional em `frontend/src/website`.
- `frontend/src/shared` contém apenas infraestrutura técnica (cliente HTTP, autenticação, componentes de estado e formulários de identidade central).

## 2. Árvore de diretórios (resumo)
```
backend/
  server.py                 -> importa app.main:app (supervisor)
  app/
    main.py
    core/{config,security,authentication,authorization,users,organizations,
          products_catalog,subscriptions,billing,audit}/
    products/{crm,erp,email_api,payments_api,marketplace,recebimento,marketing,chatbot,link_bio}/
        api/ models/ schemas/ services/ repositories/ tests/
    integrations/{email,stripe}/
    database/{mongo.py,indexes.py}
    workers/celery_app.py
    shared/{models.py,repository.py,errors.py}
  tests/
frontend/src/
  website/{layouts,components,pages,services}
  products/<produto>/{layouts,components,pages,services,hooks,types,utils}/<Produto>App.tsx
  shared/{api,auth,components,account}
infra/{docker-compose.yml,nginx.conf,backend.Dockerfile,frontend.Dockerfile}
.github/workflows/ci.yml
```

## 3. Coleções MongoDB
Plataforma: users, organizations, organization_members, organization_invites, products, plans, subscriptions,
subscription_events, payment_records, sessions, email_tokens, audit_logs, product_permissions, notifications, email_outbox.
Produtos: prefixo por domínio (crm_*, erp_*, email_*, payment_*, marketplace_*, receivables/collection_records/receivable_payments,
marketing_*, chatbot_*, bio_*) conforme especificação. Todo documento de tenant contém `organization_id`.

## 4. Índices
- Únicos: users.email; organization_members(organization_id,user_id); product_permissions(organization_id,user_id,product_key);
  subscriptions(organization_id,product_key) parcial `is_current=true`; subscription_events.stripe_event_id (idempotência de webhook);
  payment_records.stripe_session_id; plans(product_key,plan_key).
- Compostos de tenant: `(organization_id, created_at)` em todas as coleções de produto; `(organization_id, status)`, `(organization_id, stage_key)`.
- TTL: sessions.expires_at, email_tokens.expires_at, organization_invites.expires_at, audit_logs.created_at (retenção 365 dias),
  notifications.created_at (180 dias).

## 5. Autenticação
Cadastro (Argon2id) -> e-mail de verificação (token aleatório, armazenado como SHA-256, TTL 24h) -> login com bloqueio após 5 falhas
-> se MFA ativo, `mfa_token` (5 min) + código TOTP -> sessão no Mongo + cookies `access_token` (15 min, HttpOnly, Secure, SameSite=Lax),
`refresh_token` (7 dias, rotação a cada uso, detecção de reutilização -> revoga sessão), `csrf_token` (double-submit, header `X-CSRF-Token`).
Toda requisição valida token + sessão não revogada + usuário ativo. Recuperação de senha revoga todas as sessões.

## 6. Contratação e provisionamento
Site -> produto -> segmento -> plano -> dados da organização -> conta -> Stripe Checkout hospedado -> servidor confirma o pagamento
(webhook assinado OU consulta servidor-a-servidor à sessão Stripe) -> `subscriptions.status=active` (atualização condicional idempotente)
-> `product_permissions` owner -> provisionador do produto (ex.: CRM cria funil do segmento) -> acesso apenas em `/<produto>`.
Retorno do navegador nunca ativa assinatura sozinho. Estados: pending, active, past_due, canceled, expired, suspended.

## 7. Isolamento
Dependência `require_product(produto, permissão)`: identidade -> `X-Organization-Id` -> associação ativa -> organização ativa ->
permissão de produto (RBAC owner/admin/member/viewer) -> assinatura válida -> MFA exigido para `manage`/`billing` -> rate limit por organização.
Repositório `TenantRepository` injeta `organization_id` em toda consulta (IDOR retorna 404). Referências cruzadas são validadas no mesmo tenant.

## 8. Segurança
Argon2id, JWT curto, sessões revogáveis, CSRF, CORS restrito (`CORS_ORIGINS`), headers (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy),
Pydantic estrito (`extra=forbid`) contra NoSQL injection, rate limit por IP/usuário/organização (Redis se `REDIS_URL`, memória caso contrário),
segredo TOTP criptografado (Fernet) em repouso, auditoria de operações críticas, logs sem segredos, webhooks com assinatura + idempotência + proteção a eventos fora de ordem.

## 9. Testes
Pytest (`backend/tests`): segurança, autenticação, isolamento entre organizações, CRM. Vitest/RTL e Playwright: **pendentes** (ver PRD).

## 10. Implantação e domínios
Docker Compose (api, web, mongo, redis, nginx) em `infra/`. Ambientes: development/staging/production via `APP_ENV`.
Fase atual: caminhos (`/crm`, `/erp`, `/email-api`, `/payments-api`, `/marketplace`, `/recebimento`, `/marketing`, `/chatbot`, `/link-bio`).
Futuro: subdomínios (`crm.leamse.com` ...) roteados pelo Nginx para o mesmo build com basename por produto.

## 11. Estado dos produtos
- CRM de Vendas: **funcional** (leads, contatos, oportunidades/funil, atividades, segmentação por mercado, equipe, auditoria, assinatura).
- ERP, Email API, Payments API, Marketplace API, Recebimento, Marketing, Chatbot, Link na Bio: **estrutura criada, regras de negócio pendentes**;
  não são vendáveis no site até serem implementados e validados.
