// Importa a função randomUUID do módulo nativo do Node.js para gerar IDs únicos.
// Renomeamos para "generateId" para deixar o código mais legível.
import { randomUUID as generateId } from 'node:crypto';

// Classe abstrata que serve de base para todas as entidades do domínio.
// "abstract" significa que ela não pode ser instanciada diretamente —
// sempre precisará ser estendida por outra classe (ex: UserEntity).
//
// O tipo genérico <Props = any> permite que cada entidade defina
// suas próprias propriedades de forma tipada.
export abstract class Entity<Props = any> {
    // O ID da entidade. É readonly (só pode ser definido uma vez, no construtor).
    // O underscore (_id) é uma convenção para indicar que é um atributo "interno",
    // acessado de fora apenas pelo getter "id" abaixo.
    public readonly _id: string;

    // As propriedades da entidade (ex: name, email, password para um usuário).
    // O tipo é definido por quem estende essa classe.
    public readonly props: Props;

    // Construtor recebe as props e opcionalmente um id.
    // Se o id não for passado, um novo UUID é gerado automaticamente.
    // Isso é útil para:
    //   - Criar uma nova entidade (sem id) → gera um novo UUID
    //   - Reconstruir uma entidade salva no banco (com id existente) → reutiliza o id
    constructor(props: Props, id?: string) {
        this.props = props;
        this._id = id ?? generateId();
    }

    // Getter público para acessar o ID de fora da classe.
    // Expõe _id como "id", mantendo a convenção de nome limpo para quem consome.
    get id() {
        return this._id;
    }

    // Converte a entidade para um objeto JSON simples.
    // Retorna as props com o campo "id" incluído.
    // O "Required<...>" garante que todos os campos sejam considerados obrigatórios
    // na tipagem do retorno, mesmo que alguns sejam opcionais nas props originais.
    toJSON(): Required<Props & { id: string }> {
        return this.props as Required<Props & { id: string }>;
    }
}
