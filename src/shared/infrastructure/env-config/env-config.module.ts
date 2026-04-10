import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { EnvConfigService } from './env-config.service';
import path from 'path';
@Module({
    imports: [],
    providers: [EnvConfigService],
    exports: [EnvConfigService],
})
export class EnvConfigModule extends ConfigModule {
    static forRoot(options: ConfigModuleOptions = {}): Promise<DynamicModule> {
        return super.forRoot({
            ...options,
            isGlobal: true,
            envFilePath: '.env',
        });
    }
}
