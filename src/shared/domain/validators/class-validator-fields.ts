import {
    FieldsErrors,
    ValidatorFieldsInterface,
} from './validator-fields.interface';

import { validateSync, type ValidationError } from 'class-validator';

export abstract class ClassValidatorFields<
    PropsValidated extends object,
> implements ValidatorFieldsInterface<PropsValidated> {
    errors: FieldsErrors | null = null;
    validatedData: PropsValidated = {} as PropsValidated;

    validate(data: PropsValidated): boolean {
        const errors: ValidationError[] = validateSync(data);

        if (errors.length) {
            this.errors = {};

            for (const error of errors) {
                this.errors[error.property] = Object.values(
                    error.constraints ?? {},
                );
            }
        } else {
            this.validatedData = data;
        }

        return !errors.length;
    }
}
