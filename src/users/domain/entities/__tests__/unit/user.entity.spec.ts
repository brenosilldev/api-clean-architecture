import { UserEntity, UserProps } from '../../user.entity';
import { faker } from '@faker-js/faker';

describe('UserEntity', () => {
    let user: UserEntity;
    let props: UserProps;

    beforeEach(() => {
        props = {
            name: faker.person.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };

        user = new UserEntity(props);
    });
    it('should be able to create a user', () => {
        expect(user).toBeDefined();
        expect(user.props.name).toBe(props.name);
        expect(user.props.email).toBe(props.email);
        expect(user.props.password).toBe(props.password);
        expect(user.props.createdAt).toBe(props.createdAt);
    });
});
