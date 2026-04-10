import { UserEntity, UserProps } from '../../user.entity';
import { UserDataBuilder } from '../../../testing/helpers/user-data-builders';

describe('UserEntity', () => {
    let user: UserEntity;
    let props: UserProps;

    beforeEach(() => {
        props = UserDataBuilder({});

        user = new UserEntity(props);
    });
    it('should be able to create a user', () => {
        expect(user).toBeDefined();
        expect(user.props.name).toBe(props.name);
        expect(user.props.email).toBe(props.email);
        expect(user.props.password).toBe(props.password);
        expect(user.props.createdAt).toBe(props.createdAt);
    });

    it('should be able to get createdAt', () => {
        expect(user.createdAt).toBeDefined();
        expect(user.createdAt).toBe(props.createdAt);
        expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should be able to get name', () => {
        expect(user.name).toBeDefined();
        expect(user.name).toEqual(props.name);
        expect(user.name).toEqual(expect.any(String)); // Verifica se o nome é uma string
    });

    it('should be able to get email', () => {
        expect(user.email).toBeDefined();
        expect(user.email).toEqual(props.email);
        expect(user.email).toEqual(expect.any(String));
    });

    it('should be able to get password', () => {
        expect(user.password).toBeDefined();
        expect(user.password).toEqual(props.password);
        expect(user.password).toEqual(expect.any(String));
    });
});
