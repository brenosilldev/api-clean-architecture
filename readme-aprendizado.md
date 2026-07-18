# Roteiro de aprendizado

Conceitos importantes para aprender (ou revisar) acompanhando este projeto. Cada tópico tem referência direta ao código — leia o conceito, depois abra o arquivo indicado.

---

## 1. TypeScript — o básico que você precisa dominar

O projeto usa TypeScript **strict**. Se você não se sente confortável com os tópicos abaixo, comece por eles.

| Conceito | Onde ver no projeto |
|---|---|
| **Tipos e type alias** | `UserProps` em `src/users/domain/entities/user.entity.ts:4` |
| **Interfaces** | `ValidatorFieldsInterface` em `src/shared/domain/validators/validator-fields.interface.ts:5` |
| **Classes abstratas** | `Entity<Props>` em `src/shared/domain/entities/entity.ts:3` |
| **Generics** | `Entity<Props>`, `ClassValidatorFields<PropsValidated>` |
| **Getters e setters** | `get name()`, `private set name()` em `user.entity.ts` |
| **`readonly`** | `public readonly _id: string` em `entity.ts:4` |
| **`static`** | `static validate()` e `static create()` nos validadores |
| **`implements`** | `EnvConfigService implements EnvConfigInterface` |
| **`extends`** | `UserEntity extends Entity<UserProps>` |
| **Path alias `@/`** | Importa de `@/shared/...` em vez de `../../../shared/...` |

> Se `Entity<Props = any>` não fizer sentido, estude generics primeiro.

---

## 2. Programação Orientada a Objetos (OOP)

A arquitetura do projeto é fortemente orientada a objetos. Não basta saber a sintaxe — é preciso entender o **propósito** de cada pilar.

| Pilar | O que significa | Exemplo no projeto |
|---|---|---|
| **Encapsulamento** | Dados internos protegidos, acesso via métodos públicos | `props` é `readonly`, acesso via getters (`user.name`) |
| **Herança** | Classe filha reusa comportamento da classe pai | `UserEntity extends Entity<UserProps>` |
| **Polimorfismo** | Objetos de tipos diferentes respondem à mesma interface | `UserValidator` e qualquer validador futuro implementam `ValidatorFieldsInterface` |
| **Composição** | Classe recebe dependências prontas (em vez de herdar) | `UsersController` recebe `UsersService` no construtor |

**Regra prática:** prefira composição à herança. Herança é usada aqui só para o `Entity` base e o `ClassValidatorFields` — porque faz sentido conceitual (é um "é um"). Para dependências, use composição (injeção).

---

## 3. Clean Architecture

O projeto segue o modelo de Robert C. Martin: código organizado em camadas concêntricas onde **dependências apontam para dentro**.

```
Frameworks & Drivers → Interface Adapters → Use Cases → Entities
```

### As camadas neste projeto

| Camada | O que contém | Proibido fazer aqui |
|---|---|---|
| **Entities** (`domain/`) | Regras de negócio puras. `UserEntity`, `Entity<Props>` | Importar NestJS, HTTP, banco |
| **Use Cases** (em evolução) | Orquestração do domínio. `UsersService` → futuro `CreateUserUseCase` | Conhecer detalhes de HTTP ou banco |
| **Interface Adapters** | Controllers, DTOs, interfaces (ports) | Conter regra de negócio |
| **Frameworks & Drivers** | NestJS, Fastify, class-validator, Prisma (futuro) | Vazar para dentro |

### Ports & Adapters

Desacopla a camada de domínio/aplicação da infraestrutura usando **interfaces**:

```text
[Consumidor] → [Interface (Port)] ← [Implementação (Adapter)]
```

Exemplo real: `EnvConfigInterface` (port) é implementada por `EnvConfigService` (adapter). Quem consome a config depende apenas da interface, não do NestJS.

**Arquivos para estudar:**
- Port: `src/shared/infrastructure/env-config/env-config.interface.ts`
- Adapter: `src/shared/infrastructure/env-config/env-config.service.ts`
- Validação: `ValidatorFieldsInterface` → `ClassValidatorFields` → `UserValidator`

---

## 4. Domain-Driven Design (DDD)

O DDD orienta **o que colocar no centro** do sistema. O nome "domínio" não é tecnologia — é o problema real que o software resolve.

| Conceito | O que é | Status no projeto |
|---|---|---|
| **Entity** | Objeto com identidade única (`id`) e ciclo de vida. Tem comportamento, não é só dados | Implementado (`UserEntity`) |
| **Value Object** | Objeto sem identidade, definido pelos seus atributos. Imutável. Ex.: `Email`, `CPF`, `Address` | Planejado |
| **Aggregate** | Grupo de entidades com uma raiz que garante consistência interna. Ex.: `Pedido` com `Itens` | Planejado |
| **Domain Service** | Lógica de negócio que não pertence a uma única entidade | Planejado |
| **Bounded Context** | Fronteira explícita de um domínio. Cada módulo (`users/`) é um contexto | Parcial |

### Entidade de domínio ≠ entidade de banco

No DDD, a entidade não reflete a tabela do banco. Ela reflete a **regra de negócio**.

```ts
// UserEntity não é um "model" do Prisma — é um objeto de domínio
// com comportamento:
user.updateName('João');   // encapsula regras (validação antes de mudar)
user.updatePassword('...'); // mesma coisa
```

**Arquivo:** `src/users/domain/entities/user.entity.ts`

---

## 5. SOLID na prática

Cada letra do SOLID aparece em algum lugar do projeto. Veja com calma:

| Letra | Princípio | Onde está |
|---|---|---|
| **S** | Single Responsibility — uma classe, uma responsabilidade | `UserEntity` só cuida do usuário; `UserValidator` só valida |
| **O** | Open/Closed — aberto para extensão, fechado para modificação | Novos validadores estendem `ClassValidatorFields` sem modificá-lo |
| **L** | Liskov Substitution — subtipos substituem seus tipos base | `UserValidator` (subtipo) pode substituir `ClassValidatorFields` sem quebrar |
| **I** | Interface Segregation — interfaces específicas, não genéricas | `ValidatorFieldsInterface` tem só o que o validador precisa, nada mais |
| **D** | Dependency Inversion — dependa de abstrações, não de implementações | `EnvConfigService` implementa `EnvConfigInterface`; consumidores usam a interface |

> O **D** do SOLID é o mesmo princípio que guia a **regra de dependência** da Clean Architecture.

---

## 6. Injeção de Dependência (DI) e NestJS

NestJS é o framework que une as peças. Os três conceitos essenciais:

### @Injectable()
Marca uma classe como gerenciável pelo NestJS. Ela pode ser injetada em outras classes.

```ts
@Injectable()
export class UsersService { ... }
```

### @Module()
Agrupa controllers, providers e imports relacionados.

```ts
@Module({
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
```

### Test.createTestingModule()
Cria um módulo Nest só para testes, sem subir o servidor.

```ts
const module = await Test.createTestingModule({
    providers: [UsersService],
}).compile();
```

**Arquivos:**
- `src/app.module.ts` — módulo raiz
- `src/users/infrastructure/users.module.ts` — módulo de funcionalidade
- `src/users/infrastructure/users.service.spec.ts` — teste com TestingModule

---

## 7. Padrões de Design (Design Patterns)

| Padrão | O que resolve | Onde está |
|---|---|---|
| **Abstract Base Class** | Evita repetir código comum entre classes similares | `Entity<Props>`, `ClassValidatorFields<Props>` |
| **Factory** | Centraliza a criação de objetos com lógica | `UserValidatorFactory.create()` |
| **Test Data Builder** | Gera dados de teste com valores padrão semânticos | `UserDataBuilder({})` |
| **Repository** *(planejado)* | Isola o domínio da persistência | Interface + implementação separada |
| **Adapter** | Traduz uma interface para outra que o cliente espera | `EnvConfigService` adapta `ConfigService` do Nest para `EnvConfigInterface` |

---

## 8. Validação em duas camadas

O projeto valida dados em **dois momentos diferentes**, cada um com responsabilidade distinta.

### Camada 1 — Borda HTTP (ValidationPipe)

No `main.ts`, um `ValidationPipe` global valida os DTOs antes de chegar ao controller. Usa `class-validator` + `class-transformer`.

**Responsabilidade:** rejeitar requisições malformadas **antes** de qualquer lógica de domínio.

**Arquivos:** `src/users/infrastructure/dto/create-user.dto.ts`

### Camada 2 — Domínio (ClassValidatorFields)

No construtor de `UserEntity`, o `UserValidator` valida as props. Se inválidas, a entidade nem é criada.

**Responsabilidade:** garantir que o estado do domínio nunca fique inconsistente — independente de como os dados chegaram (HTTP, fila, CLI, teste).

**Arquivos:** `src/users/domain/validator/user.validator.ts`, `src/shared/domain/validators/class-validator-fields.ts`

---

## 9. Testes automatizados (além do básico)

O projeto tem uma pirâmide de testes clara. Veja `readme-test.md` para um guia completo. Aqui estão os conceitos-chave:

| Conceito | O que é | Exemplo |
|---|---|---|
| **SUT** | System Under Test — a unidade que está sendo testada | `UserEntity`, `EnvConfigService` |
| **AAA** | Arrange-Act-Assert — organização do teste | Preparar dados, executar, verificar |
| **Test Data Builder** | Gera dados válidos sem repetição | `UserDataBuilder({ name: 'João' })` |
| **Spy** | Observa se um método foi chamado | `jest.spyOn(lib, 'validateSync')` |
| **Mock** | Substitui dependência real por controle | `mockReturnValue(...)` |
| **Fake** | Implementação simplificada para teste | Repositório que guarda em array em vez de banco |
| **TestingModule** | "Mini NestJS" que monta só o necessário | `Test.createTestingModule` |

**Arquivos de exemplo:**
- `src/users/domain/entities/__tests__/unit/user.entity.spec.ts`
- `src/shared/domain/validators/__tests__/unit/class.validator.fields.spec.ts`
- `src/shared/infrastructure/env-config/__tests__/unit/env-config.service.spec.ts`

---

## 10. Organização de pastas (por que assim?)

```
src/
├── shared/          # Código compartilhado entre contextos
│   ├── domain/      # Regras genéricas de domínio (Entity base, validadores)
│   └── infrastructure/  # Infra compartilhada (config, futuramente DB)
│
└── users/           # Um Bounded Context
    ├── domain/      # Regras de negócio de usuários (imports zero do Nest)
    └── infrastructure/  # Tudo que conecta o domínio ao mundo externo
```

**Por que separar `domain/` de `infrastructure/` dentro de cada módulo?**

- O `domain/` não importa NestJS, Fastify, banco ou qualquer framework
- O `infrastructure/` orquestra a conexão entre o domínio e os frameworks
- Testar o domínio não exige subir módulo Nest — é puro TypeScript

---

## Ordem sugerida de estudo

Se você está começando do zero, esta ordem ajuda a não empacar:

1. **TypeScript** — generics, interfaces, classes abstratas
2. **OOP** — encapsulamento, herança, polimorfismo, composição
3. **NestJS básico** — módulos, controllers, providers, DI
4. **Testes básicos** — Jest, describe/it, matchers, AAA
5. **Clean Architecture** — camadas, regra de dependência
6. **DDD** — entidades, value objects, aggregates
7. **Validação** — duas camadas, class-validator
8. **SOLID** — cada princípio aplicado
9. **Design Patterns** — builder, factory, repository, adapter
10. **Testes avançados** — mocks, spies, TestingModule, integração

Cada tópico tem exemplo concreto neste repositório. Estude um por um, abrindo os arquivos indicados.
