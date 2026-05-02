import { UserEntity, UserProps } from '../../user.entity';
import { UserDataBuilder } from '../../../testing/helpers/user-data-builders';

describe('UserEntity', () => {
    let user: UserEntity;
    let props: UserProps;

    // "beforeEach" é executado antes de CADA teste ("it").
    // Garante que cada teste começa com um usuário novo e dados frescos,
    // evitando que um teste interfira no resultado de outro.
    beforeEach(() => {
        // Gera um conjunto de props aleatórias usando o Test Data Builder.
        props = UserDataBuilder({});

        // Cria uma nova instância de UserEntity com as props geradas.
        user = new UserEntity(props);
    });

    // Teste: verifica se o usuário foi criado corretamente com todos os campos.
    it('should be able to create a user', () => {
        // "toBeDefined" garante que o objeto foi criado (não é undefined).
        expect(user).toBeDefined();

        // "toBe" faz comparação estrita (===) — verifica se é exatamente o mesmo valor.
        expect(user.props.name).toBe(props.name);
        expect(user.props.email).toBe(props.email);
        expect(user.props.password).toBe(props.password);
        expect(user.props.createdAt).toBe(props.createdAt);
    });

    // Teste: verifica se o getter "createdAt" funciona e retorna uma instância de Date.
    it('should be able to get createdAt', () => {
        // Verifica que createdAt foi definido (não é undefined/null).
        expect(user.createdAt).toBeDefined();

        // Verifica que o valor é o mesmo que foi passado nas props.
        expect(user.createdAt).toBe(props.createdAt);

        // "toBeInstanceOf(Date)" garante que o tipo é um objeto Date, não uma string.
        expect(user.createdAt).toBeInstanceOf(Date);
    });

    // Teste: verifica se o getter "name" retorna o nome correto.
    it('should be able to get name', () => {
        expect(user.name).toBeDefined();

        // "toEqual" compara o valor (funciona igual ao toBe para primitivos).
        expect(user.name).toEqual(props.name);

        // "expect.any(String)" verifica se o valor é do tipo String,
        // sem precisar saber o valor exato — útil quando o dado é aleatório.
        expect(user.name).toEqual(expect.any(String));
    });

    // Teste: verifica se o getter "email" retorna o e-mail correto.
    it('should be able to get email', () => {
        expect(user.email).toBeDefined();
        expect(user.email).toEqual(props.email);
        expect(user.email).toEqual(expect.any(String));
    });

    // Teste: verifica se o getter "password" retorna a senha correta.
    it('should be able to get password', () => {
        expect(user.password).toBeDefined();
        expect(user.password).toEqual(props.password);
        expect(user.password).toEqual(expect.any(String));
    });

    it('Setter for name should update the name ', () => {
        user['name'] = 'updated name';
        expect(user.props.name).toBe('updated name');
    });

    it('Setter for password should update the password ', () => {
        user['password'] = 'updated password';
        expect(user.props.password).toBe('updated password');
    });

    it('Update name method should update the name ', () => {
        user.updateName('updated name');
        expect(user.props.name).toEqual('updated name');
    });

    it('Update password method should update the password ', () => {
        user.updatePassword('updated password');
        expect(user.props.password).toEqual('updated password');

    });
});
