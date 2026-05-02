// Importa a classe abstrata Entity para testar seus comportamentos base.
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builders';
import { Entity } from '../../entity';

type StubProps = {
    props1: string;
    props2: number;
};

// Classe stub para testar a classe Entity.
class StubEntity extends Entity<StubProps> {}

describe('Entity', () => {
    it('should be able to create an entity', () => {
        const props = { props1: 'props1 value', props2: 10 };
        const entity = new StubEntity(props); // Cria uma nova instância da entidade stub

        expect(entity.props).toStrictEqual(props); // Verifica se as propriedades da entidade são iguais aos valores passados
        expect(entity.id).not.toBeNull(); // Verifica se o ID da entidade não é nulo
    });
});
