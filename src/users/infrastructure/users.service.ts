// @Injectable() marca essa classe como um provedor gerenciado pelo NestJS.
// Isso permite que ela seja injetada em outras classes (como o UsersController).
import { Injectable } from '@nestjs/common';

// Importa os DTOs para tipar os parâmetros dos métodos.
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// UsersService é a camada de serviço do módulo de usuários.
// No Clean Architecture, aqui ficarão os casos de uso (use cases) do domínio.
// Por enquanto os métodos retornam strings placeholder — serão implementados
// conforme o estudo avança (com repositório, entidade, persistência, etc.).
@Injectable()
export class UsersService {
    // Responsável por criar um novo usuário.
    // Receberá o DTO, criará uma UserEntity e a persistirá via repositório.
    create(createUserDto: CreateUserDto) {
        return 'This action adds a new user';
    }

    // Responsável por buscar todos os usuários.
    findAll() {
        return `This action returns all users`;
    }

    // Responsável por buscar um usuário específico pelo ID.
    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    // Responsável por atualizar um usuário existente.
    // Receberá o id e os dados parciais do UpdateUserDto.
    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    // Responsável por remover um usuário pelo ID.
    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
