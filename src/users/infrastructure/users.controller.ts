import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// @Controller('users') define que todas as rotas deste controller
// começam com o prefixo "/users".
@Controller('users')
export class UsersController {
    // O UsersService é injetado automaticamente pelo NestJS via injeção de dependência.
    // "private readonly" impede que o serviço seja substituído ou acessado de fora.
    constructor(private readonly usersService: UsersService) {}

    // POST /users
    // Cria um novo usuário. O corpo da requisição é mapeado para CreateUserDto.
    @Post('/create')
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    // GET /users
    // Retorna todos os usuários cadastrados.
    @Get('/find-all')
    findAll() {
        return this.usersService.findAll();
    }

    // GET /users/:id
    // Retorna um usuário específico pelo ID passado na URL.
    // O "+" converte o parâmetro de string para número.
    @Get('/find-one/:id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    // PATCH /users/:id
    // Atualiza parcialmente um usuário. Recebe o id pela URL e os dados pelo corpo.
    @Patch('/update/:id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    // DELETE /users/:id
    // Remove um usuário pelo ID.
    @Delete('/remove/:id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
