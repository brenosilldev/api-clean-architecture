import { Injectable } from '@nestjs/common';
import { EnvConfigInterface } from './env-config.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService implements EnvConfigInterface {
    constructor(private readonly configService: ConfigService) {}
    getAppPort(): number {
        const raw = this.configService.get<string | number>('PORT');
        if (raw === undefined || raw === null) return 3000;
        const parsed =
            typeof raw === 'number' ? raw : Number.parseInt(String(raw), 10);
        return Number.isNaN(parsed) ? 3000 : parsed;
    }

    getNodeEnv(): string {
        return this.configService.get<string>('NODE_ENV') ?? 'development';
    }
}
