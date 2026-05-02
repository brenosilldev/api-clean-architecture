import { ClassValidatorFields } from '../../class-validator-fields';
import * as libClassValidator from 'class-validator';

class StubClassValidatorFields extends ClassValidatorFields<{
    field: string;
}> {}

describe('Testes unitários de ClassValidatorFields', () => {
    it('Deve inicializar errors como null e validatedData como objeto vazio', () => {
        // Arrange: cria a instância do validador (SUT = sistema sob teste)
        const sut = new StubClassValidatorFields();

        // Assert: ao iniciar, errors é null e validatedData começa vazio
        expect(sut.errors).toBeNull();
        expect(sut.validatedData).toMatchObject({});
    });

    it('Deve validar com erros', () => {
        // Arrange: simula o class-validator retornando erro de validação
        const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync');
        spyValidateSync.mockReturnValue([
            { property: 'field', constraints: { isRequired: 'test error' } },
        ]);
        const sut = new StubClassValidatorFields();

        // Act + Assert:
        // - validate retorna false porque existem erros
        // - validatedData permanece vazio
        // - errors é preenchido com a mensagem mapeada por campo
        expect(sut.validate(null as unknown as { field: string })).toBeFalsy();
        expect(spyValidateSync).toHaveBeenCalled();
        expect(sut.validatedData).toMatchObject({});
        expect(sut.errors).toStrictEqual({ field: ['test error'] });
    });

    it('Deve validar sem erros', () => {
        // Arrange: simula o class-validator sem retornar erros
        const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync');
        spyValidateSync.mockReturnValue([]);
        const sut = new StubClassValidatorFields();

        // Act + Assert:
        // - validate retorna true
        // - validatedData recebe os dados validados
        // - errors continua null, pois não houve erro de validação
        expect(sut.validate({ field: 'value' })).toBeTruthy();
        expect(spyValidateSync).toHaveBeenCalled();
        expect(sut.validatedData).toStrictEqual({ field: 'value' });
        expect(sut.errors).toBeNull();
    });
});
