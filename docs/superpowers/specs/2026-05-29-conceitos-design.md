# Design: docs/conceitos.md

**Data:** 2026-05-29
**Público-alvo:** dev com experiência básica em programação, sem contato anterior com esses padrões
**Abordagem:** narrativa conectada — os 4 conceitos como partes de um mesmo raciocínio

---

## Objetivo

Criar `docs/conceitos.md`: um arquivo separado do README técnico que explica Clean Architecture, DDD, Design Patterns e Testes Automatizados de forma simples e objetiva, com exemplos híbridos (conceito genérico + ponteiro para o projeto).

---

## Estrutura do documento

### Introdução
- Problema: código que cresce rápido, vira bagunça e fica difícil de testar
- Os 4 conceitos como resposta coordenada, não ferramentas isoladas
- Fio condutor: *"Clean Architecture define onde cada coisa vive. DDD orienta o que vai no centro. Design Patterns resolve problemas recorrentes dentro das camadas. Testes automatizados garantem que tudo ainda funciona após cada mudança."*

### Seção 1 — Clean Architecture
- **Problema:** código onde controller conhece banco, banco conhece regra de negócio
- **Ideia central:** regras de negócio no centro, detalhes técnicos na borda
- **Conteúdo:** Regra de Dependência, 4 camadas em uma linha cada, exemplo curto com `UserEntity` e `UsersController`
- **Ponteiro:** `src/users/`

### Seção 2 — DDD
- **Problema:** entidades-anêmicas forçam lógica de negócio a vazar para controllers/services
- **Ideia central:** domínio modela o problema real — entidades têm identidade, estado e comportamento
- **Conteúdo:** diferença entidade-anêmica vs entidade de domínio, Entity/Value Object/Aggregate em uma linha cada, exemplo `UserEntity.updateName()`
- **Ponteiro:** `src/users/domain/entities/user.entity.ts`

### Seção 3 — Design Patterns
- **Problema:** soluções repetidas reinventadas sem nome ou estrutura reconhecível
- **Ideia central:** padrões são vocabulário compartilhado para problemas recorrentes
- **Conteúdo:** Test Data Builder (presente), Repository Pattern (planejado), exemplo `UserDataBuilder({ name: 'João' })`
- **Ponteiro:** `src/users/domain/testing/helpers/user-data-builders.ts`

### Seção 4 — Testes Automatizados
- **Problema:** medo de mudar código porque ninguém sabe o que pode quebrar
- **Ideia central:** testes são a rede de segurança que permite evoluir com confiança
- **Conteúdo:** pirâmide em 3 linhas, por que testar comportamento e não implementação, exemplo com `UserEntity` + `UserDataBuilder`
- **Ponteiros:** `src/users/domain/entities/__tests__/unit/user.entity.spec.ts`, `readme-test.md`

---

## Decisões de design

- Sem diagrama ASCII (já existe no README técnico)
- Sem código extenso — exemplos curtos, máximo 5 linhas
- Linguagem direta: "o problema", "a ideia central", sem jargão desnecessário
- Cada seção segue a mesma estrutura: problema → ideia central → como funciona → onde ver no projeto
