import { ClassValidatorFields } from '../../class-validator-fields';

class StubClassValidatorFields extends ClassValidatorFields<{
    field: string;
}> {}

describe('ClassValidatorFields', () => {
    it('should be able to validate with errors', () => {
        const sut = new StubClassValidatorFields();
        expect(sut.errors).toBeNull();
        expect(sut.validatedData).toMatchObject({});
    });
});
