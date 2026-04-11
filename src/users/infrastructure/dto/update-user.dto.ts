// Importa o utilitário PartialType do NestJS para criar DTOs de atualização.
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// UpdateUserDto representa os dados aceitos numa requisição de atualização de usuário.
//
// PartialType(CreateUserDto) cria automaticamente uma versão onde
// todos os campos de CreateUserDto são opcionais (Partial<CreateUserDto>).
//
// Isso faz sentido para uma rota PATCH, onde o cliente pode enviar
// apenas os campos que deseja atualizar, sem precisar mandar todos os dados do usuário.
//
// Exemplo: { name: "Novo Nome" } → atualiza só o nome, email e password ficam intactos.
export class UpdateUserDto extends PartialType(CreateUserDto) {}
