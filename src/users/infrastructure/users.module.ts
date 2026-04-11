// Module é o decorator que transforma uma classe em módulo NestJS.
// Módulos organizam o código em blocos coesos — cada funcionalidade
// da aplicação tem seu próprio módulo (users, auth, products, etc.).
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

// @Module configura o módulo de usuários:
//   - controllers: classes que recebem as requisições HTTP deste módulo
//   - providers: serviços disponíveis para injeção dentro deste módulo
@Module({
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
