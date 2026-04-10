import { faker } from '@faker-js/faker';
import { UserProps } from '../../entities/user.entity';

export function UserDataBuilder(props: Partial<UserProps>): UserProps {
    return {
        ...props,
        name: props.name ?? faker.person.firstName(),
        email: props.email ?? faker.internet.email(),
        password: props.password ?? faker.internet.password(),
    };
}