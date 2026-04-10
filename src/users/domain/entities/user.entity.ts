export type UserProps = {
    // Props é uma interface que define as propriedades do usuário // Propriedades são as características do usuário
    id?: string;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export class UserEntity {
    constructor(public readonly props: UserProps) {
        this.props.createdAt = this.props.createdAt ?? new Date();
    }
}
