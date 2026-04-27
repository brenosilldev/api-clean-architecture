import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

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
    
    // Pipes são classes que processam os dados da requisição antes de chegar ao controlador.
    // Aqui estamos usando o ValidationPipe para validar os dados da requisição.
    // O whitelist remove propriedades que não estão definidas no DTO.
    // O forbidNonWhitelisted lança um erro se propriedades não definidas forem enviadas.
    // O transform transforma os dados da requisição para o tipo definido no DTO.
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Inicia o servidor na porta definida em PORT (variável de ambiente)
    // ou na porta 3000 caso a variável não esteja definida.
    await app.listen(process.env.PORT ?? 3000);
}

// Chama a função bootstrap para iniciar a aplicação.
bootstrap();
