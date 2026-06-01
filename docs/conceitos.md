# Conceitos fundamentais

Este documento explica os quatro pilares que guiam a estrutura desta API. Eles não são independentes — funcionam juntos como partes de um mesmo raciocínio.

> **Clean Architecture** define onde cada coisa vive.
> **DDD** orienta o que vai no centro.
> **Design Patterns** resolve problemas recorrentes dentro das camadas.
> **Testes automatizados** garantem que tudo ainda funciona após cada mudança.

---

## O problema que todos resolvem

Código cresce. Sem estrutura, o que era simples vira uma teia: o controller conhece o banco, o banco conhece a regra de negócio, qualquer mudança quebra algo inesperado. Testar se torna difícil. Evoluir, arriscado.

Os quatro conceitos abaixo são respostas a esse problema. Cada um atua em um nível diferente, mas o objetivo é o mesmo: código que você consegue entender, mudar e testar com confiança.

---

## Clean Architecture

### O problema

Quando a regra de negócio fica misturada com framework, banco ou HTTP, trocar qualquer detalhe técnico exige mexer em lugares que não deveriam importar para o negócio.

### A ideia central

As regras de negócio ficam no **centro** do sistema e não conhecem nenhum detalhe técnico. Framework, banco e HTTP são detalhes que ficam na **borda**.

### Como funciona

O sistema é organizado em camadas concêntricas. A regra de dependência é simples: **as dependências sempre apontam para dentro**.

```
Frameworks & Drivers  →  Interface Adapters  →  Use Cases  →  Entities
```

| Camada | O que contém |
|---|---|
| **Entities** | Regras centrais do domínio, sem dependência de tecnologia |
| **Use Cases** | Regras de aplicação que orquestram o domínio |
| **Interface Adapters** | Conversão entre domínio e mundo externo (controllers, DTOs) |
| **Frameworks & Drivers** | Implementações concretas: NestJS, Fastify, Prisma |

Na prática neste projeto: a `UserEntity` não importa nada do NestJS. O `UsersController` não sabe como o usuário é salvo no banco. Cada peça conhece apenas o que precisa.

**Ver na prática:** `src/users/`

---

## DDD — Domain-Driven Design

### O problema

Entidades que são apenas sacos de dados forçam a lógica de negócio a vazar para controllers e services. O domínio fica anêmico — existe no nome, mas não no comportamento.

### A ideia central

O domínio modela o **problema real**, não o banco de dados. Entidades têm identidade, estado e comportamento.

### Como funciona

A diferença entre uma entidade anêmica e uma entidade de domínio:

```ts
// Anêmica — só dado, sem comportamento
class User {
  name: string;
  email: string;
}

// Domínio — dado + comportamento + identidade
class UserEntity extends Entity<UserProps> {
  get name() { return this.props.name; }

  updateName(value: string): void {
    this.props.name = value; // a entidade muta a si mesma
  }
}
```

Três conceitos-chave do DDD:

| Conceito | O que é |
|---|---|
| **Entity** | Tem identidade única (um `id`); persiste ao longo do tempo |
| **Value Object** | Descreve algo sem identidade própria (ex.: um endereço, um e-mail) |
| **Aggregate** | Grupo de entidades com uma fronteira de consistência e uma raiz |

**Ver na prática:** `src/users/domain/entities/user.entity.ts`

---

## Design Patterns

### O problema

Os mesmos problemas aparecem repetidamente em projetos diferentes. Sem padrões, cada desenvolvedor inventa sua própria solução — sem nome, sem estrutura reconhecível, difícil de comunicar.

### A ideia central

Padrões são **soluções nomeadas** para problemas recorrentes. Usar o nome certo comunica a intenção sem precisar explicar o código.

### Dois padrões neste projeto

**Test Data Builder**

Gera objetos válidos com dados aleatórios por padrão. Cada teste sobrescreve apenas o campo que importa para aquele cenário.

```ts
// tudo aleatório e válido
UserDataBuilder({});

// só o campo relevante para o teste é fixo
UserDataBuilder({ name: 'João' });
```

Sem esse padrão, cada teste criaria manualmente todos os campos — frágil e repetitivo.

**Repository Pattern** *(planejado)*

Isola o domínio do mecanismo de persistência. O use case fala com uma interface (`UserRepository`), não com o Prisma diretamente. Trocar o banco não toca nas regras de negócio.

**Ver na prática:** `src/users/domain/testing/helpers/user-data-builders.ts`

---

## Testes automatizados

### O problema

Sem testes, qualquer mudança no código carrega o risco de quebrar algo que funcionava. O resultado é medo de refatorar e evolução cada vez mais lenta.

### A ideia central

Testes são a **rede de segurança** que permite evoluir o código com confiança. Não são documentação, não são burocracia — são feedback rápido de que o sistema ainda faz o que deveria.

### Como funciona

A pirâmide de testes organiza onde investir esforço:

- **Base — Unitários:** muitos, rápidos, isolados. Testam uma classe ou função. São a maioria.
- **Meio — Integração:** componentes reais trabalhando juntos (ex.: validador + regra + módulo Nest).
- **Topo — E2E:** fluxo completo da API. Poucos, lentos, cobrem as jornadas críticas.

Uma regra importante: **teste comportamento, não implementação**. Um teste que quebra em toda refatoração não protege — atrapalha. O que importa é o resultado observável, não como o código chegou lá.

Exemplo neste projeto — o teste foca no comportamento da entidade, não em detalhes internos:

```ts
it('should update the user name', () => {
  user.updateName('Novo Nome');
  expect(user.name).toBe('Novo Nome');
});
```

O `UserDataBuilder` cuida dos dados de suporte. O teste fixa só o que diferencia aquele cenário.

**Ver na prática:** `src/users/domain/entities/__tests__/unit/user.entity.spec.ts` e `readme-test.md`

---

## Como tudo se conecta

| Conceito | Pergunta que responde |
|---|---|
| Clean Architecture | *Onde cada coisa vive no sistema?* |
| DDD | *O que vai no centro? Como modelar o domínio?* |
| Design Patterns | *Como resolver este problema recorrente dentro das camadas?* |
| Testes automatizados | *Como garantir que tudo ainda funciona?* |

Juntos, eles permitem que o sistema cresça sem virar bagunça — e que você consiga mudar qualquer parte com confiança.
