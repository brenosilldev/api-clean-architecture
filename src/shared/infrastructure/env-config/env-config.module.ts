// DynamicModule é o tipo retornado por módulos que se configuram em tempo de execução.
// Module é o decorator que transforma uma classe em módulo NestJS.
import { DynamicModule, Module } from '@nestjs/common';

// ConfigModule é o módulo oficial do NestJS para leitura de variáveis de ambiente.
// ConfigModuleOptions são as opções de configuração que podemos passar para ele.
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';

// Importa o serviço que implementa a leitura das variáveis de ambiente.
import { EnvConfigService } from './env-config.service';

// "path" é um módulo nativo do Node.js para manipulação de caminhos de arquivo.
// (Importado aqui mas ainda não utilizado — pode ser usado futuramente para
// apontar o caminho do arquivo .env de forma dinâmica.)
import path from 'path';

// @Module configura este módulo:
//   - imports: outros módulos que este módulo depende (vazio por enquanto, pois
//     ConfigModule é adicionado dinamicamente via forRoot)
//   - providers: serviços que este módulo disponibiliza internamente
//   - exports: serviços que outros módulos podem usar ao importar EnvConfigModule
@Module({
    imports: [],
    providers: [EnvConfigService],
    exports: [EnvConfigService],
})
// EnvConfigModule estende ConfigModule para reaproveitar sua lógica de leitura do .env
// e adicionar configurações padrão do projeto (como isGlobal e envFilePath).
export class EnvConfigModule extends ConfigModule {
    // Método estático que configura o módulo com opções padrão do projeto.
    // É chamado no AppModule como: EnvConfigModule.forRoot()
    // Aceita opções extras opcionais para sobrescrever ou complementar o padrão.
    static forRoot(options: ConfigModuleOptions = {}): Promise<DynamicModule> {
        return super.forRoot({
            // Spread das opções personalizadas passadas pelo chamador.
            ...options,

            // isGlobal: true → disponibiliza ConfigModule em todos os módulos da aplicação
            // sem precisar importar em cada um. Um import único no AppModule é suficiente.
            isGlobal: true,

            // Define qual arquivo .env será carregado.
            envFilePath: '.env',
        });
    }
}
