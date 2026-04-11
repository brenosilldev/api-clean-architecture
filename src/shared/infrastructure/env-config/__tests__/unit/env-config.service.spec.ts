// Test é o utilitário do NestJS para criar módulos isolados nos testes.
// TestingModule é o tipo do módulo criado pelo Test.
import { Test, TestingModule } from '@nestjs/testing';

// Importa o serviço que será testado.
import { EnvConfigService } from '../../env-config.service';

// Importa o módulo de configuração para que o ConfigService esteja disponível
// dentro do ambiente de teste (o EnvConfigService depende dele).
import { EnvConfigModule } from '../../env-config.module';

// "describe" agrupa todos os testes do EnvConfigService.
describe('EnvConfigService', () => {
    // Variável que guarda a instância do serviço após a criação do módulo de teste.
    let service: EnvConfigService;

    // "beforeEach" executa antes de cada teste para configurar o ambiente isolado.
    // O uso de "async/await" é necessário porque a criação de módulos NestJS é assíncrona.
    beforeEach(async () => {
        // Test.createTestingModule cria um módulo NestJS isolado, apenas para testes.
        // Isso permite testar o serviço sem subir a aplicação inteira.
        const module: TestingModule = await Test.createTestingModule({
            // Importa o EnvConfigModule com forRoot() para carregar o arquivo .env
            // e disponibilizar o ConfigService para o EnvConfigService.
            imports: [EnvConfigModule.forRoot()],

            // Registra o EnvConfigService como provedor para que possa ser injetado.
            providers: [EnvConfigService],
        }).compile(); // .compile() finaliza a construção do módulo de teste.

        // Recupera a instância do EnvConfigService criada pelo módulo de teste.
        // module.get<T>() é a forma de obter provedores dentro do módulo de teste.
        service = module.get<EnvConfigService>(EnvConfigService);
    });

    // Teste: verifica se getAppPort() retorna 3000 (padrão quando PORT não está no .env).
    it('should return the app port', () => {
        expect(service.getAppPort()).toBe(3000);
    });

    // Teste: verifica se getNodeEnv() retorna o valor da variável NODE_ENV do ambiente,
    // ou 'development' caso não esteja definida.
    it('should return the node env', () => {
        expect(service.getNodeEnv()).toBe(
            process.env.NODE_ENV ?? 'development',
        );
    });
});
