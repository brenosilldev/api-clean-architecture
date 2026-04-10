export type UserProps = {
    id?: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt?: Date;
};
export declare class UserEntity {
    readonly props: UserProps;
    constructor(props: UserProps);
}
