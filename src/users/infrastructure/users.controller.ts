// Importa os decorators HTTP do NestJS para definir rotas e métodos.
// Controller → define a rota base do recurso
// Get, Post, Patch, Delete → mapeiam os métodos HTTP
// Body → extrai o corpo da requisição
// Param → extrai parâmetros da URL (ex: :id)
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

// Importa o serviço que contém a lógica de negócio dos usuários.
// O controller não tem lógica própria — ele apenas recebe a requisição HTTP
// e delega o processamento para o serviço correspondente.
import { UsersService } from './users.service';

// DTOs (Data Transfer Objects) definem o formato esperado dos dados
// que chegam no corpo das requisições.
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
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    // GET /users
    // Retorna todos os usuários cadastrados.
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    // GET /users/:id
    // Retorna um usuário específico pelo ID passado na URL.
    // O "+" converte o parâmetro de string para número.
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    // PATCH /users/:id
    // Atualiza parcialmente um usuário. Recebe o id pela URL e os dados pelo corpo.
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    // DELETE /users/:id
    // Remove um usuário pelo ID.
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
