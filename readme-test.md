# Guia de testes neste projeto

Documento para **aprender testes com calma**, alinhado a esta API (NestJS + Jest) e aos exemplos em `src/`. A ideia é **ler na ordem dos níveis**; cada nível apoia o próximo. Se já domina um tópico, pode pular o nível correspondente.

---

## Como usar este guia

1. Siga **Nível 1 → 2 → 3** na primeira passagem (você já consegue escrever testes úteis).
2. Depois avance **4 → 5 → 6** conforme for tocando em mocks, Nest e HTTP.
3. Deixe **Nível 7 e 8** para quando quiser **organizar a suíte** e **refinar** qualidade.

No fim há **arquivos de exemplo** neste repositório para abrir ao lado do texto.

---

## Análise da versão anterior (e o que mudou)

**O que funcionava bem:** conteúdo correto (comandos, matchers, builder, Nest, pirâmide, boas práticas) e exemplos fiéis ao projeto.

**O que dificultava o aprendizado:** a ordem misturava **visão estratégica** (“pensar no software como um todo”) **antes** de **primeiro contato** com Jest e arquivos. Quem está começando precisa primeiro de *onde rodar*, *como se chama o arquivo* e *como é um `it`*, e só depois de pirâmide e risco. Havia também **sobreposição** entre “como escrever melhor”, “recursos úteis” e o checklist — mesmas ideias em três lugares.

**O que esta revisão faz:** uma **trilha por níveis** (do concreto ao abstrato), **uma análise explícita** no início, **menos repetição** e um **checklist único** no final.

---

## Nível 1 — Primeiro contato: ferramentas e onde tudo morre

### O que usamos (e para quê)

| Ferramenta | Papel |
|------------|--------|
| **Jest** | Roda os testes, agrupa casos (`describe` / `it`), asserções (`expect`). |
| **ts-jest** | Entende TypeScript nos arquivos `.spec.ts`. |
| **@nestjs/testing** | Monta um “mini Nest” só para teste (`Test.createTestingModule`). |
| **@faker-js/faker** | Gera dados realistas sem inventar string a string. |
| **supertest** | Chama a API HTTP em testes de integração ou e2e. |

A configuração do Jest está em `package.json`, chave `"jest"`: em geral, tudo que está em `src/` e termina em **`.spec.ts`** entra no `npm run test`.

### Comandos que você vai usar no dia a dia

| Comando | Uso |
|---------|-----|
| `npm run test` | Roda a suíte uma vez (CI, antes de commit). |
| `npm run test:watch` | Reexecuta ao salvar — melhor enquanto escreve teste. |
| `npm run test:cov` | Gera cobertura em `coverage/` — útil para achar buracos, não como única meta. |
| `npm run test:debug` | Depura com o inspector do Node. |
| `npm run test:e2e` | Usa `test/jest-e2e.json`; arquivos costumam ser `*.e2e-spec.ts` na pasta `test/`. |

### Onde criar o arquivo de teste

- **Regra do Jest aqui:** qualquer `*.spec.ts` dentro de `src/` pode ser encontrado.
- **Convenção do projeto:** pastas `__tests__/unit` ou `integration` perto do código, por exemplo:
  - `src/users/domain/entities/__tests__/unit/user.entity.spec.ts`
  - `src/shared/domain/validators/integration/class.validator.fields-int.spec.ts`

**Dica:** `unit` = poucas dependências, muitas vezes **simuladas**. `integration` = partes **reais** trabalhando juntas (ex.: `class-validator` de verdade, sem mock da lib).

---

## Nível 2 — Sintaxe e ritmo de um teste

### Estrutura mínima

```ts
describe('NomeDaClasseOuFeature', () => {
  beforeEach(() => {
    // roda antes de cada `it` — estado limpo, sem um teste sujar o outro
  });

  it('deve descrever o comportamento em linguagem clara', () => {
    // Arrange: preparar dados e dependências
    // Act: executar o código sob teste (SUT)
    // Assert: expect(...)
  });
});
```

**AAA (Arrange, Act, Assert)** — ou Given / When / Then — ajuda quem lê e evita misturar setup com asserção. Exemplo real no projeto: `class.validator.fields.spec.ts`.

### Matchers que você mais vai usar

| Matcher | Quando usar |
|---------|----------------|
| `expect(x).toBe(y)` | Primitivos, igualdade estrita `===`. |
| `expect(x).toEqual(y)` | Objetos/arrays, comparação profunda. |
| `expect(x).toStrictEqual(y)` | Igual ao anterior, porém mais estrito (ex.: chaves `undefined`). |
| `expect(x).toBeDefined()` / `toBeNull()` | Presença ou ausência de valor. |
| `expect(x).toBeTruthy()` / `toBeFalsy()` | Condições booleanas (cuidado: `0` e `''` são falsy). |
| `expect(x).toBeInstanceOf(Date)` | Tipo de instância. |
| `expect(x).toEqual(expect.any(String))` | Só importa o tipo, não o valor exato. |

---

## Nível 3 — Dados de teste: Builder + Faker

Objetos grandes repetidos nos `it` cansam e quebram fácil quando o modelo muda. O projeto já usa **Test Data Builder** em `user-data-builders.ts`:

```ts
// tudo aleatório e válido
const props = UserDataBuilder({});

// só o que importa para o cenário; o resto continua aleatório
const props = UserDataBuilder({ name: 'João' });
```

**Objetivo:** cada teste fixa **só o que diferencia** aquele caso; o resto vem do builder.

---

## Nível 4 — Isolar o que atrapalha: mocks e spies

Às vezes você precisa **não** chamar a biblioteca ou o serviço real — para testar **sua** lógica em volta.

```ts
import * as libClassValidator from 'class-validator';

const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync');
spyValidateSync.mockReturnValue([
  { property: 'field', constraints: { isRequired: 'test error' } },
]);

// ... exercita o validador ...

expect(spyValidateSync).toHaveBeenCalled();
spyValidateSync.mockRestore(); // evita vazar mock para o próximo teste
```

**SUT (*system under test*)** = o pedaço de código que você está provando (uma classe, um método).

**Regra prática:** mockar **borda** (HTTP, banco, fila, lib externa pesada) costuma ser bom; mockar **todo o domínio** com `jest.fn()` costuma ser ruim — você deixa de provar regra de negócio. Quando der, prefira **fake em memória** (ex.: repositório que guarda array) em vez de cadeia grande de mocks.

---

## Nível 5 — Serviços e módulo Nest

Classes resolvidas pelo **injetor** do Nest pedem um módulo de teste:

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

Com dependências reais substituídas por dublês, use **`overrideProvider(Token).useValue(mock)`** (ou `useFactory`) no `TestingModule` — o código de produção não precisa mudar só por causa do teste.

---

## Nível 6 — Borda HTTP: integração e e2e

- **`test:e2e`** + `test/jest-e2e.json` — típico Nest.
- Você sobe `Test.createTestingModule` com `AppModule` (ou recorte), obtém `app.getHttpServer()` e usa **supertest** para `POST`/`GET` e `expect(status)`.

Foque e2e em **poucas jornadas que importam** (fluxo crítico de negócio), não em cada detalhe — isso fica mais barato nos níveis 2–4.

---

## Nível 7 — Pensar no software como um todo (depois que a mão já coçou)

Testes dão **feedback rápido**: “depois da minha mudança, o sistema ainda faz o que importa?”.

### Por onde começar a investir tempo

Pergunte: **se isso quebrar em produção, quanto dói?**

1. **Domínio** (regras, dinheiro, permissões, invariantes) → testes **próximos do código puro**, rápidos.
2. **Contratos entre camadas** (o que o repositório promete, o que o caso de uso exige) → testes com **fake** ou **integração** seletiva.
3. **Entrada/saída** (HTTP, DB, fila) → **menos** testes, porém cobrindo **fluxos críticos** na borda.

### Pirâmide (guia)

- **Base larga:** muitos testes rápidos em entidades, validadores, políticas.
- **Meio:** integração onde precisa confiar em composição real (ORM + DB em container, `class-validator` real, módulo Nest).
- **Topo fino:** e2e para jornadas essenciais — lentos e sensíveis; não substituem a base.

### Camadas nesta API (resumo)

| Camada | Foco do teste | Estilo comum |
|--------|----------------|--------------|
| Domínio | Regras, invariantes | Unitário, sem subir app Nest |
| Aplicação | Orquestração, erros de negócio | Unitário com portas fake ou integração |
| Infra | HTTP, serialização, wiring | `TestingModule` + supertest; e2e pontual |

Prefira asserções sobre **comportamento observável** (retorno, estado, efeito) a acoplamento a **detalhe interno** (ex.: “chamou helper X três vezes”) — o segundo quebra na primeira refatoração boa.

### Além do `npm run test`

Aceite claro, **definição de pronto** com teste em bugfix, pipeline rodando testes em todo push e monitoramento em produção **complementam** a suíte automatizada; não substituem uns aos outros.

---

## Nível 8 — Aprofundamento: qualidade e recursos extras

### Hábitos que melhoram qualquer suíte

- Nome do `it` como **especificação** legível (“deve …”, “não deve …”).
- **Um comportamento** por teste; vários `expect` ok se reforçam o **mesmo** comportamento.
- **Determinismo:** sem tempo/rede/aleatório descontrolados sem preparo (`fakeTimers`, builder com valores fixos quando precisar).
- **Sem ordem entre `it`:** cada um deve passar sozinho; estado fresco no `beforeEach`.
- **Regressão:** corrigiu bug → teste que falhava antes do fix → fica para sempre.

### Recursos Jest / ecossistema (quando subir de nível)

| Recurso | Para quê |
|---------|-----------|
| `describe` aninhado | Agrupar por método ou cenário. |
| `it.each` / `test.each` | Vários casos, mesma lógica — tabela enxuta. |
| `toMatchObject` | Objeto parcial — menos frágil a campos irrelevantes. |
| `expect.arrayContaining` | Ordem ou extras no array importam menos. |
| `expect.stringContaining` | Mensagens de erro, URLs. |
| `jest.fn()` + `mockResolvedValue` / `mockRejectedValue` | Async e dependências injetadas. |
| `await expect(p).rejects.toThrow(...)` | Erro assíncrono legível. |
| `jest.useFakeTimers()` | Controlar tempo; lembre de restaurar no `afterEach` se necessário. |
| `ValidationPipe` nos testes de controller | Mesmo contrato HTTP que em produção, quando for o foco. |

### Cobertura (`test:cov`)

Use para achar **módulos críticos sem teste** ou branches óbvias. Meta só de **porcentagem** sem olhar risco costuma gerar testes fracos que dão falsa segurança.

---

## Checklist rápido (antes de abrir o PR)

1. Nome do `it` deixa claro **cenário + resultado esperado**.
2. Teste **não depende** da ordem de execução nem de estado de outro arquivo.
3. Mock só onde isola **I/O ou terceiro**; domínio com lógica real quando possível.
4. Bug corrigido → **teste de regressão** incluído.
5. Domínio e validadores com testes **rápidos** sempre que houver regra nova ou alterada.

---

## Referências no repositório (abrir no editor)

| O que ver | Arquivo |
|-----------|---------|
| Spy + AAA | `src/shared/domain/validators/__tests__/unit/class.validator.fields.spec.ts` |
| Entidade + builder | `src/users/domain/entities/__tests__/unit/user.entity.spec.ts` |
| Integração `class-validator` | `src/shared/domain/validators/integration/class.validator.fields-int.spec.ts` |
| `TestingModule` mínimo | `src/users/infrastructure/users.service.spec.ts` |

Arquitetura geral da API: `README.md` na raiz.
