import { UserValidator, UserValidatorFactory } from "../user.validator";


describe('Validador da class use Validate', () => {
    let sut: UserValidator;

    beforeEach(() => {
        sut = UserValidatorFactory.create();
    });
    it('Deve validar corretamente os campos de um usuário', () => {
        expect(sut.validate({ name: 'John Doe', email: 'john.doe@example.com', password: '123456' })).toBeTruthy();
    });
});
