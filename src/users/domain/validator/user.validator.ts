import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';
import { ValidatorFieldsInterface } from '@/shared/domain/validators/validator-fields.interface';
import { MaxLength, IsNumber, IsString, IsNotEmpty, Validator, IsEmail, MinLength, IsDate, IsOptional } from 'class-validator';
import { UserProps } from '../entities/user.entity';

class UserRules implements UserProps { // Regras de validação para o usuário
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    name: string = '';

    @IsEmail()
    @IsNotEmpty()
    email: string = '';

    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    password: string = '';


    @IsDate()
    @IsOptional()
    createdAt?: Date;

    constructor(data: UserProps) {
        Object.assign(this, data); // Atribui as propriedades do objeto data ao objeto this
    }
}

export class UserValidator extends ClassValidatorFields<UserRules> { // Validador de usuário
    validate(data: UserProps): boolean { // Valida os dados do usuário
        return super.validate(new UserRules(data ?? {}));
    }
}


export class UserValidatorFactory { // Fábrica de validadores de usuário
    static create(): UserValidator { // Cria uma instância do validador de usuário
        return new UserValidator(); // Retorna uma instância do validador de usuário
    }
}
