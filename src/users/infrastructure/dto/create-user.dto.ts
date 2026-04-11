// DTO (Data Transfer Object) — Objeto de Transferência de Dados.
//
// Um DTO define o formato dos dados que chegam numa requisição HTTP.
// Ele é a "fronteira" entre o mundo externo (HTTP) e a lógica interna da aplicação.
//
// Separar o DTO da entidade de domínio é importante porque:
//   - A entidade do domínio tem regras de negócio e não deve ser exposta diretamente
//   - O DTO pode ter validações específicas de entrada (ex: @IsEmail, @IsNotEmpty)
//   - Futuramente, campos como "createdAt" e "id" não devem vir do cliente
//
// Por enquanto a classe está vazia — os campos (name, email, password) serão
// adicionados conforme o estudo avança, provavelmente com decorators de validação
// do pacote "class-validator".
export class CreateUserDto {}
