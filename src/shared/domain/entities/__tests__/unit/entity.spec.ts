// Importa a classe abstrata Entity para testar seus comportamentos base.
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builders';
import { Entity } from '../../entity';
import  { UserEntity, UserProps } from '@/users/domain/entities/user.entity';
import { en } from '@faker-js/faker';


type StubProps = {
    props1: string;
    props2: number;
};

// Classe stub para testar a classe Entity.
class StubEntity extends Entity<StubProps> {}





describe('Entity', () => {
    it('should be able to create an entity', () => {
      const props = { props1: 'props1 value', props2: 10 };
      const entity = new StubEntity(props);

      expect(entity.props.props1).toStrictEqual(props.props1);
      expect(entity.id).not.toBeNull();
    });

  
});
