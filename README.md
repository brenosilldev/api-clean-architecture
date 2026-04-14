# API Clean Architecture

Projeto de estudo focado em **Clean Architecture**, **Domain-Driven Design (DDD)**, **testes automatizados** e **design patterns** usando NestJS com TypeScript.

---

## Objetivo

Aprender na prática como estruturar uma API escalável e bem organizada usando os princípios de:

- **Clean Architecture** — separação clara de responsabilidades em camadas independentes
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

## O que é Clean Architecture?

Clean Architecture é um conjunto de princípios de design de software criado por Robert C. Martin (Uncle Bob). O objetivo central é criar sistemas onde **as regras de negócio não dependem de detalhes técnicos** — frameworks, bancos de dados, HTTP ou qualquer tecnologia externa.

### As 4 camadas

```
┌──────────────────────────────────────────────────────────┐
│           Frameworks & Drivers                           │
│   (Web, DB, UI, Devices, External Interfaces)            │
│   ┌──────────────────────────────────────────────────┐   │
│   │           Interface Adapters                     │   │
│   │   (Controllers, Gateways, Presenters)            │   │
│   │   ┌──────────────────────────────────────────┐   │   │
│   │   │         Application Business Rules       │   │   │
│   │   │              (Use Cases)                 │   │   │
│   │   │   ┌──────────────────────────────────┐   │   │   │
│   │   │   │   Enterprise Business Rules      │   │   │   │
│   │   │   │          (Entities)              │   │   │   │
│   │   │   └──────────────────────────────────┘   │   │   │
│   │   └──────────────────────────────────────────┘   │   │
│   └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

| Camada | O que contém | Exemplo neste projeto |
|---|---|---|
| **Entities** | Regras de negócio da empresa — independentes de qualquer aplicação | `UserEntity`, `Entity<Props>` |
| **Use Cases** | Regras de negócio da aplicação — orquestram as entidades para um objetivo | `UsersService` (futuramente classes de Use Case dedicadas) |
| **Interface Adapters** | Convertem dados entre o formato dos Use Cases e o mundo externo | `UsersController`, DTOs, Gateways |
| **Frameworks & Drivers** | Detalhes técnicos: HTTP, banco de dados, frameworks | NestJS, Fastify, TypeORM/Prisma |

### Princípio fundamental: a Regra de Dependência

As dependências entre camadas devem **sempre apontar para dentro**. A camada de Entities não conhece Use Cases; Use Cases não conhecem Controllers; Controllers não conhecem o banco de dados diretamente — sempre através de interfaces (portas).

```
Frameworks & Drivers  →  Interface Adapters  →  Use Cases  →  Entities
```

Nenhuma camada interna sabe que as camadas externas existem.

### Fluxo de controle: Ports & Adapters

O diagrama abaixo mostra como uma requisição HTTP percorre as camadas respeitando a Regra de Dependência:

```
   [Controller]
       │
       │ chama
       ▼
[Use Case Input Port]    ← interface que o Controller conhece
       │
       │ implementado por
       ▼
[Use Case Interactor]    ← lógica de aplicação (Use Case concreto)
       │
       │ chama
       ▼
[Use Case Output Port]   ← interface que o Interactor conhece
       │
       │ implementado por
       ▼
   [Presenter]           ← formata a resposta para o mundo externo
```

- **Input Port**: interface que define o que o Controller pode chamar — o Use Case expõe apenas um contrato.
- **Use Case Interactor**: a implementação concreta que orquestra Entities e Repositories.
- **Output Port**: interface que define como o resultado será entregue — o Presenter implementa essa interface sem que o Use Case saiba qual tecnologia está sendo usada.

Esse modelo permite trocar o Controller (REST → GraphQL → CLI) ou o Presenter (JSON → XML → gRPC) sem alterar nenhuma regra de negócio.

### Por que isso importa?

- O domínio pode ser testado sem subir o framework ou conectar ao banco
- Trocar o banco de dados ou o framework HTTP não exige reescrever as regras de negócio
- Cada camada tem uma responsabilidade bem definida e pode evoluir de forma independente

---

## Estrutura de pastas

```
src/
├── shared/                              # Código compartilhado entre módulos
│   ├── domain/
│   │   └── entities/
│   │       ├── entity.ts               # Classe abstrata base para todas as entidades
│   │       └── __tests__/unit/
│   │           └── entity.spec.ts
│   └── infrastructure/
│       └── env-config/
│           ├── env-config.interface.ts  # Contrato (interface) da configuração de ambiente
│           ├── env-config.module.ts     # Módulo NestJS
│           ├── env-config.service.ts    # Implementação concreta
│           └── __tests__/unit/
│               └── env-config.service.spec.ts
│
└── users/                               # Módulo de usuários
    ├── domain/                          # Camada de domínio — regras de negócio puras
    │   ├── entities/
    │   │   ├── user.entity.ts           # Entidade User com getters e comportamentos
    │   │   └── __tests__/unit/
    │   │       └── user.entity.spec.ts
    │   └── testing/
    │       └── helpers/
    │           └── user-data-builders.ts  # Test Data Builder para UserEntity
    └── infrastructure/                  # Camada de infraestrutura — detalhes técnicos
        ├── dto/
        │   ├── create-user.dto.ts       # Formato esperado para criação de usuário
        │   └── update-user.dto.ts       # Formato esperado para atualização de usuário
        ├── users.controller.ts          # Recebe requisições HTTP e delega ao serviço
        ├── users.service.ts             # Lógica de aplicação (futuramente: use cases)
        └── users.module.ts             # Módulo NestJS do contexto de usuários
```

---

## Conceitos aplicados

### Entidade base (`Entity<Props>`)

A classe abstrata `Entity<Props>` em `src/shared/domain/entities/entity.ts` é a base para todas as entidades do domínio. Ela garante que toda entidade tenha:

- Um `id` único gerado automaticamente com `crypto.randomUUID()`, ou recebido como parâmetro (útil para reconstruir entidades vindas do banco)
- Um conjunto tipado de `props`
- Um método `toJSON()` para serialização

```ts
export abstract class Entity<Props = any> {
    public readonly _id: string;
    public readonly props: Props;

    constructor(props: Props, id?: string) {
        this.props = props;
        this._id = id ?? crypto.randomUUID();
    }

    get id() {
        return this._id;
    }
}
```

### Entidade de domínio (`UserEntity`)

`UserEntity` estende `Entity<UserProps>` e representa o usuário no domínio. O `createdAt` é preenchido automaticamente se não for informado. Os campos são acessados via **getters**, que encapsulam o estado interno sem expor a estrutura diretamente:

```ts
export class UserEntity extends Entity<UserProps> {
    constructor(public readonly props: UserProps, id?: string) {
        super(props, id);
        this.props.createdAt = this.props.createdAt ?? new Date();
    }

    get name()      { return this.props.name; }
    get email()     { return this.props.email; }
    get password()  { return this.props.password; }
    get createdAt() { return this.props.createdAt; }

    updateName(value: string): void {
        this.props.name = value;
    }
}
```

> No DDD, entidades possuem **identidade** (o `id`) e podem ter **comportamentos** (métodos como `updateName`). Elas não são apenas bags de dados.

### Design Pattern — Test Data Builder

Para facilitar a criação de dados nos testes, foi implementado o padrão **Test Data Builder** com `@faker-js/faker`. Ele gera dados realistas e aleatórios, permitindo sobrescrever apenas o que for relevante para cada cenário de teste:

```ts
// src/users/domain/testing/helpers/user-data-builders.ts
export function UserDataBuilder(props: Partial<UserProps>): UserProps {
    return {
        name: props.name ?? faker.person.firstName(),
        email: props.email ?? faker.internet.email(),
        password: props.password ?? faker.internet.password(),
        createdAt: props.createdAt ?? new Date(),
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
    let props: UserProps;
    let user: UserEntity;

    beforeEach(() => {
        props = UserDataBuilder({});
        user = new UserEntity(props);
    });

    it('should be able to create a user', () => {
        expect(user.props.name).toBe(props.name);
        expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should update the user name', () => {
        user.updateName('Novo Nome');
        expect(user.name).toBe('Novo Nome');
    });
});
```

### DTOs (Data Transfer Objects)

DTOs definem o contrato de entrada das requisições HTTP. Eles existem na camada de infraestrutura e não devem vazar para o domínio:

```ts
// create-user.dto.ts
export class CreateUserDto {
    name: string;
    email: string;
    password: string;
}
```

### Controller e Service

O **Controller** recebe a requisição HTTP e delega ao **Service** — ele não contém lógica de negócio:

```ts
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/create')
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
}
```

O **Service** concentra a lógica de aplicação. Em uma Clean Architecture completa, aqui ficariam os **Use Cases** — cada operação encapsulada em sua própria classe:

```ts
@Injectable()
export class UsersService {
    create(createUserDto: CreateUserDto) {
        // Futuramente: instanciar UserEntity, validar, persistir via repositório
        return 'This action adds a new user';
    }
}
```

---

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/users/create` | Cria um novo usuário |
| `GET` | `/users/find-all` | Retorna todos os usuários |
| `GET` | `/users/find-one/:id` | Retorna um usuário pelo ID |
| `PATCH` | `/users/update/:id` | Atualiza um usuário pelo ID |
| `DELETE` | `/users/remove/:id` | Remove um usuário pelo ID |

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
