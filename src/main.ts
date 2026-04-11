// NestFactory é a fábrica principal do NestJS para criar a aplicação.
import { NestFactory } from '@nestjs/core';

// AppModule é o módulo raiz da aplicação — o ponto de entrada que
// conecta todos os outros módulos (UsersModule, EnvConfigModule, etc.).
import { AppModule } from './app.module';

// FastifyAdapter adapta o NestJS para usar o Fastify como servidor HTTP
// em vez do Express (padrão). O Fastify é mais performático para APIs REST.
// NestFastifyApplication é o tipo da aplicação quando se usa o Fastify.
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';

// Função principal assíncrona que inicializa e sobe a aplicação.
// A convenção de nomear "bootstrap" vem da ideia de "inicializar do zero".
async function bootstrap() {
    // Cria a instância da aplicação NestJS com o adapter do Fastify.
    // O tipo genérico <NestFastifyApplication> garante que os métodos
    // específicos do Fastify estejam disponíveis na variável "app".
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );

    // Inicia o servidor na porta definida em PORT (variável de ambiente)
    // ou na porta 3000 caso a variável não esteja definida.
    await app.listen(process.env.PORT ?? 3000);
}

// Chama a função bootstrap para iniciar a aplicação.
bootstrap();
