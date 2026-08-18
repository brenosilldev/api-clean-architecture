import { randomUUID as generateId } from 'node:crypto';

export abstract class Entity<Props = any> {// Classe abstrata para entidades

    public readonly _id: string; // ID único da entidade

    public readonly props: Props; // Propriedades da entidade

    constructor(props: Props, id?: string) { // Construtor da entidade
        this.props = props;
        this._id = id ?? generateId();
    }

    get id() { // Getter para o ID da entidade
        return this._id; // Getter para o ID da entidade
    }

    toJSON(): Required<Props & { id: string }> {
        return this.props as Required<Props & { id: string }>; // Método para converter a entidade para JSON
    }
}
