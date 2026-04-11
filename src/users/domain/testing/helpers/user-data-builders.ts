// Importa o faker, biblioteca que gera dados falsos realistas (nomes, e-mails, senhas, etc.)
// Muito útil em testes para não precisar inventar dados manualmente.
import { faker } from '@faker-js/faker';

// Importa o tipo UserProps para garantir que o retorno da função seja tipado corretamente.
import { UserProps } from '../../entities/user.entity';

// Design Pattern: Test Data Builder
//
// Função que constrói um objeto UserProps com dados válidos e aleatórios.
// Aceita um objeto parcial (Partial<UserProps>), ou seja, você pode passar
// apenas os campos que quer controlar no teste — o restante é gerado automaticamente.
//
// Exemplos de uso:
//   UserDataBuilder({})                → todos os campos aleatórios
//   UserDataBuilder({ name: 'João' }) → nome fixo, e-mail e senha aleatórios
//
// Isso evita repetição de código nos testes e torna cada teste mais focado,
// já que você só especifica o que realmente importa para aquele cenário.
export function UserDataBuilder(props: Partial<UserProps>): UserProps {
    return {
        // Spread das props passadas — aplica primeiro para que os campos
        // definidos abaixo possam ser sobrescritos pelos valores passados.
        ...props,

        // Se "name" não foi passado, gera um primeiro nome aleatório (ex: "Maria").
        name: props.name ?? faker.person.firstName(),

        // Se "email" não foi passado, gera um e-mail aleatório (ex: "joao@example.com").
        email: props.email ?? faker.internet.email(),

        // Se "password" não foi passada, gera uma senha aleatória.
        password: props.password ?? faker.internet.password(),
    };
}
