// Module é o decorator que transforma uma classe em módulo NestJS.
import { Module } from '@nestjs/common';

// EnvConfigModule gerencia as variáveis de ambiente da aplicação (PORT, NODE_ENV, etc.).
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';

// UsersModule agrupa tudo relacionado ao recurso de usuários (controller, service, etc.).
import { UsersModule } from './users/users.module';

// AppModule é o módulo raiz da aplicação.
// Ele importa todos os outros módulos e serve como ponto de entrada para o NestJS.
// O NestJS usa esse módulo para montar o grafo de dependências da aplicação inteira.
@Module({
    imports: [
        // forRoot() inicializa o módulo de configuração com as opções padrão do projeto
        // (isGlobal: true, envFilePath: '.env'), tornando o ConfigService disponível
        // em toda a aplicação sem precisar importar o módulo novamente em cada lugar.
        EnvConfigModule.forRoot(),

        // Registra o módulo de usuários, expondo suas rotas e serviços.
        UsersModule,
    ],
})
export class AppModule {}
