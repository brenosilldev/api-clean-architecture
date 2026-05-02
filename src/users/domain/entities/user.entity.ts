import { Entity } from '../../../shared/domain/entities/entity';
import { UserValidatorFactory } from '../validator/user.validator';

export type UserProps = {
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
};

// Entidade de domínio que representa um Usuário.
// Estende Entity<UserProps>, ou seja, herda o _id, props e os métodos da classe base.
// No DDD, a entidade encapsula os dados e garante que eles sejam acessados
// de forma controlada (via getters), sem expor a estrutura interna diretamente.
export class UserEntity extends Entity<UserProps> {
    constructor(public readonly props: UserProps,id?: string) {
        // Chama o construtor da classe pai (Entity), passando as props e o id.
        super(props, id);

        // Se createdAt não foi informado ao criar o usuário, define como a data/hora atual.
        // O operador "??" é o "nullish coalescing": só substitui se for null ou undefined.
        this.props.createdAt = this.props.createdAt ?? new Date();

        UserEntity.validate(props);
    }

    // Getter para acessar a data de criação do usuário.
    // Getters permitem ler o valor de uma propriedade como se fosse um atributo público,
    // sem precisar chamar um método com parênteses: user.createdAt (não user.getCreatedAt()).
    get createdAt() {
        return this.props.createdAt;
    }

    // Getter para acessar o nome do usuário.
    get name() {
        return this.props.name;
    }

   private set name(value: string) {
        this.props.name = value;
    }

    // Getter para acessar o e-mail do usuário.
    get email() {
        return this.props.email;
    }

    // Getter para acessar a senha do usuário.
    get password() {
        return this.props.password;
    }

    private set password(value: string) {
        this.props.password = value;
    }

    updateName(value: string): void {
        UserEntity.validate({ ...this.props, name: value });
        this.props.name = value;
    }

    updatePassword(value: string): void {
        UserEntity.validate({ ...this.props, password: value });
        this.props.password = value;
    }

    static validate(props: UserProps) {
        const validator = UserValidatorFactory.create();
        validator.validate(props);
    }
}
