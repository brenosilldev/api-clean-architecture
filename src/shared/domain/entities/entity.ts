import { randomUUID as generateId } from 'node:crypto';

export abstract class Entity<Props = any> {
    public readonly _id: string;

    public readonly props: Props;

    constructor(props: Props, id?: string) {
        this.props = props;
        this._id = id ?? generateId();
    }

    get id() {
        return this._id;
    }

    toJSON(): Required<Props & { id: string }> {
        return this.props as Required<Props & { id: string }>;
    }
}
