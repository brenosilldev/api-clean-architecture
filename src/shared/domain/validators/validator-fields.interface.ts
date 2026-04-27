export type FieldsErrors = {
    [field: string]: string[]; // Array de strings para cada campo que pode ter vários erros
};

export interface ValidatorFieldsInterface<ProposValidated> {
    errors: FieldsErrors | null; // Objeto com os erros de cada campo
    validate(data: ProposValidated): boolean; // Método para validar os dados
    validatedData: ProposValidated | null; // Dados validados
}