// Importa a classe abstrata Entity para testar seus comportamentos base.
import { Entity } from '../../entity';

// Importa UserProps apenas para tipagem dos dados de teste.
import { UserProps } from '@/users/domain/entities/user.entity';

// "describe" agrupa os testes relacionados à classe Entity.
// É uma boa prática nomear o describe com o nome da classe/função sendo testada.
describe('Entity', () => {
    // Variáveis declaradas aqui são acessíveis em todos os testes do bloco.
    let entity: Entity;
    let props: UserProps;

    // Teste: verifica se a entidade é criada corretamente com um ID gerado automaticamente.
    // O corpo está vazio por enquanto — será implementado conforme o estudo avança.
    it('should be able to create an entity with default id', () => {});
});
