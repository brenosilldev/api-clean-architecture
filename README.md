# API Clean Architecture

Projeto de estudo focado em **Clean Architecture**, **Domain-Driven Design (DDD)**, **testes automatizados** e **design patterns** usando NestJS com TypeScript.

---

## Objetivo

Aprender, na prática, como estruturar uma API escalável e organizada aplicando:

- **Clean Architecture** — separação clara de responsabilidades entre camadas
- **DDD (Domain-Driven Design)** — modelagem orientada às regras de negócio
- **Testes automatizados** — validação contínua da aplicação com confiança para evoluir
- **Design Patterns** — padrões para reduzir acoplamento e melhorar manutenção

> O foco deste projeto é implementação prática. A teoria aparece quando ajuda a tomar melhores decisões de design.

---

## Stack

| Ferramenta | Uso |
|---|---|
| [NestJS](https://nestjs.com/) | Framework principal (HTTP, DI, módulos) |
| [Fastify](https://fastify.dev/) | Adapter HTTP de alta performance |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática e modelagem de contratos |
| [Jest](https://jestjs.io/) | Testes unitários e de integração |
| [@faker-js/faker](https://fakerjs.dev/) | Geração de dados para cenários de teste |
| [@nestjs/config](https://docs.nestjs.com/techniques/configuration) | Gerenciamento de variáveis de ambiente |
| [Prisma ORM](https://www.prisma.io/) | Persistência e consultas tipadas (evolução do projeto) |

---

## O que é Clean Architecture?

Clean Architecture (Robert C. Martin) organiza o sistema para que **as regras de negócio sejam independentes de detalhes técnicos**. Isso significa que domínio e casos de uso não devem depender diretamente de framework, banco, HTTP ou serviços externos.

### As 4 camadas

```text
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
| **Entities** | Regras centrais do domínio, independentes de tecnologia | `UserEntity`, `Entity<Props>` |
| **Use Cases** | Regras de aplicação que orquestram o domínio | `UsersService` (evoluindo para use cases dedicados) |
| **Interface Adapters** | Conversão entre domínio/use case e mundo externo | `UsersController`, DTOs |
| **Frameworks & Drivers** | Implementações concretas de infraestrutura | NestJS, Fastify, Prisma |

### Princípio fundamental: Regra de Dependência

As dependências entre camadas devem sempre apontar para dentro:

```text
Frameworks & Drivers  →  Interface Adapters  →  Use Cases  →  Entities
```

Na prática:

- O domínio não conhece controller, banco ou NestJS
- Use case conhece abstrações (interfaces), não implementações concretas
- Detalhes técnicos ficam nas camadas externas

### Fluxo de controle: Ports & Adapters

```text
   [Controller]
       │
       ▼
[Use Case Input Port]   ← contrato exposto para entrada
       │
       ▼
[Use Case Interactor]   ← implementação da regra de aplicação
       │
       ▼
[Use Case Output Port]  ← contrato de saída
       │
       ▼
   [Presenter]
```

- **Input Port** define o que pode ser executado
- **Interactor** executa a regra de negócio da aplicação
- **Output Port** define como a resposta deve ser produzida
- **Presenter** adapta o resultado para o formato externo (JSON, por exemplo)

Esse desenho desacopla regras de negócio dos detalhes de entrega.

### Por que isso importa?

- Domínio testável sem framework ou banco
- Maior facilidade para trocar tecnologias
- Menor efeito colateral em refatorações

---

## Estrutura de pastas

```text
src/
├── shared/                               # Código compartilhado entre módulos
│   ├── domain/
│   │   └── entities/
│   │       ├── entity.ts                # Entidade base abstrata
│   │       └── __tests__/unit/
│   │           └── entity.spec.ts
│   └── infrastructure/
│       └── env-config/
│           ├── env-config.interface.ts  # Contrato de configuração
│           ├── env-config.module.ts     # Módulo NestJS
│           ├── env-config.service.ts    # Implementação da configuração
│           └── __tests__/unit/
│               └── env-config.service.spec.ts
│
└── users/                                # Contexto de usuários
    ├── domain/                           # Regras de negócio puras
    │   ├── entities/
    │   │   ├── user.entity.ts           # Entidade User e comportamentos
    │   │   └── __tests__/unit/
    │   │       └── user.entity.spec.ts
    │   └── testing/
    │       └── helpers/
    │           └── user-data-builders.ts  # Test Data Builder para UserEntity
    └── infrastructure/                   # Detalhes técnicos do módulo
        ├── dto/
        │   ├── create-user.dto.ts       # Contrato de criação
        │   └── update-user.dto.ts       # Contrato de atualização
        ├── users.controller.ts           # Entrada HTTP
        ├── users.service.ts              # Regra de aplicação (transição para use cases)
        └── users.module.ts               # Composição do módulo
```

---

## Conceitos aplicados

### Entidade base (`Entity<Props>`)

A classe abstrata `Entity<Props>` em `src/shared/domain/entities/entity.ts` padroniza o comportamento mínimo das entidades de domínio:

- `id` único para identidade
- `props` tipadas para estado
- serialização com `toJSON()`

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

`UserEntity` representa o usuário no domínio e concentra dados + comportamento. Ela garante consistência mínima no momento da criação (como `createdAt` padrão) e encapsula mutações com métodos explícitos:

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

> Em DDD, entidade não é apenas estrutura de dados: ela possui identidade e comportamento.

### Design Pattern — Test Data Builder

O padrão **Test Data Builder** simplifica testes ao gerar dados válidos por padrão e permitir sobrescrever apenas o campo relevante do cenário.

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

Uso:

```ts
UserDataBuilder({});
UserDataBuilder({ name: 'João' });
```

### Testes automatizados

Os testes unitários ficam próximos da unidade testada (`__tests__/unit/*.spec.ts`) e validam comportamento de forma isolada.

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

Níveis abordados no projeto:

- **Unitário**: valida regra local de uma classe/função
- **Integração**: valida interação entre componentes
- **E2E**: valida fluxo completo da API

### DTOs (Data Transfer Objects)

DTOs definem o contrato de entrada da API. Eles pertencem à infraestrutura e evitam que o domínio fique acoplado ao formato HTTP.

```ts
export class CreateUserDto {
    name: string;
    email: string;
    password: string;
}
```

### Controller e Service

Controller deve ser fino: recebe requisição, delega a regra de aplicação e devolve resposta.

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

Service concentra a lógica de aplicação e tende a evoluir para use cases dedicados por operação:

```ts
@Injectable()
export class UsersService {
    create(createUserDto: CreateUserDto) {
        // Evolução: instanciar UserEntity, validar e persistir via repositório
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

# Rodar em modo desenvolvimento
npm run start:dev

# Rodar os testes
npm test

# Cobertura
npm run test:cov
```

---

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `PORT` | `3000` | Porta da aplicação |
| `NODE_ENV` | `development` | Ambiente de execução |

---

## Próximos passos

- [ ] Implementar repositórios (Repository Pattern)
- [ ] Adicionar casos de uso dedicados (Application Layer)
- [ ] Evoluir validações com Value Objects
- [ ] Expandir testes de integração e E2E
- [ ] Consolidar persistência com Prisma
- [ ] Configurar workflow de CI com GitHub Actions
