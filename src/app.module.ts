import { Module } from '@nestjs/common';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { UsersModule } from './users/infrastructure/users.module';

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
