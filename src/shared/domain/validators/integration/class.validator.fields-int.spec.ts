import { ClassValidatorFields } from '../class-validator-fields';
import { MaxLength, IsNumber, IsString, IsNotEmpty, Validator } from 'class-validator';

class StubRules {
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;



    constructor(data: any) {
        Object.assign(this, data); // Atribui as propriedades do objeto data ao objeto this
    }
}

class StubClassValidatorFields extends ClassValidatorFields<StubRules> {
    validate(data: StubRules): boolean {
        return super.validate(new StubRules(data));
    }
}


// Arquivo de integração de ClassValidatorFields
describe('Testes de integração de ClassValidatorFields', () => {
    // Teste de validação com erros
    it('Deve validar com erros', () => {


        const validator = new StubClassValidatorFields();

        console.log(validator.errors);
        // Validar com dados nulos
        expect(validator.validate(null)).toBeFalsy();

        // Validar com dados inválidos
        expect(validator.errors).toStrictEqual({
            name: [
              'name should not be empty',
              'name must be a string',
              'name must be shorter than or equal to 255 characters'
            ],
            price: [
              'price should not be empty',
              'price must be a number conforming to the specified constraints'
            ]
        });
    });


    // Teste de validação sem erros
    it('Deve validar sem erros', () => {
        // Arrange: cria a instância do validador (SUT = sistema sob teste)
        const validator = new StubClassValidatorFields();

        const validateData = { name: 'John Doe', price: 100 };
        // Act: executar o método validate
        expect(validator.validate(validateData)).toBeTruthy();

        // Assert: verificar se os dados foram validados corretamente
        expect(validator.validatedData).toStrictEqual(new StubRules(validateData));
    });
});
