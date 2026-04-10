# API Clean Architecture

Projeto de estudo focado em **Clean Architecture**, **Domain-Driven Design (DDD)**, **testes automatizados** e **design patterns** usando NestJS com TypeScript.

---

## Objetivo

Aprender na prática como estruturar uma API escalável e bem organizada usando os princípios de:

- **Clean Architecture** — separação clara de responsabilidades em camadas
- **DDD (Domain-Driven Design)** — modelagem orientada ao domínio do negócio
- **Testes automatizados** — testes unitários com Jest
- **Design Patterns** — padrões como Builder (Test Data Builder), Abstract Class, etc.

---

## Stack

| Ferramenta | Uso |
|---|---|
| [NestJS](https://nestjs.com/) | Framework principal (HTTP, DI, módulos) |
| [Fastify](https://fastify.dev/) | Adapter HTTP de alta performance |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Jest](https://jestjs.io/) | Testes unitários e de integração |
| [@faker-js/faker](https://fakerjs.dev/) | Geração de dados falsos nos testes |
| [@nestjs/config](https://docs.nestjs.com/techniques/configuration) | Gerenciamento de variáveis de ambiente |

---

## Estrutura de pastas

```
src/
├── shared/                          # Código compartilhado entre módulos
│   ├── domain/
│   │   └── entities/
│   │       ├── entity.ts            # Classe abstrata base para todas as entidades
│   │       └── __tests__/unit/
│   │           └── entity.spec.ts
│   └── infrastructure/
│       └── env-config/
│           ├── env-config.interface.ts   # Contrato (interface) da config de ambiente
│           ├── env-config.module.ts      # Módulo NestJS
│           ├── env-config.service.ts     # Implementação concreta
│           └── __tests__/unit/
│               └── env-config.service.spec.ts
│
└── users/                           # Módulo de usuários
    ├── domain/
    │   ├── entities/
    │   │   ├── user.entity.ts        # Entidade User do domínio
    │   │   └── __tests__/unit/
    │   │       └── user.entity.spec.ts
    │   └── testing/
    │       └── helpers/
    │           └── user-data-builders.ts  # Test Data Builder para UserEntity
    └── infrastructure/
        ├── dto/
        │   ├── create-user.dto.ts
        │   └── update-user.dto.ts
        ├── users.controller.ts
        ├── users.service.ts
        └── users.module.ts
```

---

## Conceitos aplicados

### Clean Architecture — Separação em camadas

O projeto organiza o código em duas camadas principais, onde as dependências apontam **sempre de fora para dentro** — a camada de infraestrutura depende do domínio, nunca o contrário:

```
[ Infrastructure ]  →  [ Domain ]
   Controllers           Entities
   Services              Interfaces (contratos)
   DTOs
   env-config
```

- **Domain**: núcleo da aplicação. Contém entidades e regras de negócio puras, sem dependência de frameworks ou bibliotecas externas.
- **Infrastructure**: implementa os detalhes técnicos (HTTP, configuração, banco de dados) e conhece o domínio.

### DDD — Entidade base

A classe `Entity<Props>` (`src/shared/domain/entities/entity.ts`) é a classe abstrata base para todas as entidades do domínio. Ela garante que toda entidade tenha:

- Um `id` único gerado automaticamente com `crypto.randomUUID()`, ou recebido como parâmetro (útil para reconstruir entidades vindas do banco)
- Um conjunto tipado de `props`
- Um método `toJSON()` para serialização

```ts
export abstract class Entity<Props = any> {
    public readonly _id: string;
    public readonly props: Props;

    constructor(props: Props, id?: string) {
        this.props = props;
        this._id = id ?? generateId();
    }

    get id() {
        return this._id;
    }
}
```

`UserEntity` estende `Entity<UserProps>` e representa o usuário no domínio. O `createdAt` é preenchido automaticamente se não for informado:

```ts
export class UserEntity extends Entity<UserProps> {
    constructor(public props: UserProps, id?: string) {
        super(props, id);
        this.props.createdAt = this.props.createdAt ?? new Date();
    }

    get name() { return this.props.name; }
    get email() { return this.props.email; }
    get password() { return this.props.password; }
    get createdAt() { return this.props.createdAt; }
}
```

### Design Pattern — Test Data Builder

Para facilitar a criação de dados nos testes, foi implementado o padrão **Test Data Builder** com `@faker-js/faker`. Ele gera dados realistas e aleatórios, permitindo sobrescrever apenas o que for relevante para cada cenário de teste:

```ts
// src/users/domain/testing/helpers/user-data-builders.ts
export function UserDataBuilder(props: Partial<UserProps>): UserProps {
    return {
        name: props.name ?? faker.person.firstName(),
        email: props.email ?? faker.internet.email(),
        password: props.password ?? faker.internet.password(),
        ...props,
    };
}
```

Uso nos testes:

```ts
UserDataBuilder({})                // todos os campos aleatórios
UserDataBuilder({ name: 'João' }) // só o nome é fixo, o resto aleatório
```

### Testes automatizados

Os testes unitários ficam em `__tests__/unit/` próximos ao arquivo que testam, com o sufixo `.spec.ts`. Cada teste verifica o comportamento isolado da unidade, sem dependência de banco de dados ou rede:

```ts
describe('UserEntity', () => {
    beforeEach(() => {
        props = UserDataBuilder({});
        user = new UserEntity(props);
    });

    it('should be able to create a user', () => {
        expect(user.props.name).toBe(props.name);
        expect(user.createdAt).toBeInstanceOf(Date);
    });
});
```

---

## Como rodar

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento (watch)
npm run start:dev

# Rodar os testes
npm test

# Rodar testes com relatório de cobertura
npm run test:cov
```

---

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `PORT` | `3000` | Porta da aplicação |
| `NODE_ENV` | `development` | Ambiente de execução |

---

## Proximos passos

- [ ] Implementar repositórios (Repository Pattern)
- [ ] Adicionar casos de uso (Use Cases / Application layer)
- [ ] Validação de entidades com Value Objects
- [ ] Testes de integração
- [ ] Persistência com banco de dados (TypeORM / Prisma)
