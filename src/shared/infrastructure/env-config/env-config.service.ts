import { Injectable } from '@nestjs/common';

import { EnvConfigInterface } from './env-config.interface';

// ConfigService é o serviço do @nestjs/config que lê as variáveis de ambiente
// (carregadas do arquivo .env ou do process.env).
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService implements EnvConfigInterface {
    // O construtor recebe o ConfigService via injeção de dependência do NestJS.
    // "private readonly" significa que só pode ser acessado dentro desta classe
    // e não pode ser reatribuído após a criação.
    constructor(private readonly configService: ConfigService) {}

    // Lê a variável de ambiente PORT e retorna como número.
    // Trata os casos em que a variável não existe ou tem um valor inválido,
    // retornando 3000 como padrão seguro.
    getAppPort(): number {
        // Tenta ler a variável PORT — pode vir como string ou número dependendo do ambiente.
        const raw = this.configService.get<string | number>('PORT');

        // Se PORT não foi definida no .env, retorna o valor padrão 3000.
        if (raw === undefined || raw === null) return 3000;

        // Se já for número, usa direto. Se for string, converte com parseInt na base 10.
        const parsed =
            typeof raw === 'number' ? raw : Number.parseInt(String(raw), 10);

        // Se a conversão falhar (ex: PORT='abc'), parseInt retorna NaN.
        // Nesse caso também retorna o padrão 3000.
        return Number.isNaN(parsed) ? 3000 : parsed;
    }

    // Lê a variável de ambiente NODE_ENV e retorna como string.
    // Se não estiver definida, usa 'development' como padrão.
    getNodeEnv(): string {
        return this.configService.get<string>('NODE_ENV') ?? 'development';
    }
}
