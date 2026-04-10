import { Module } from '@nestjs/common';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [EnvConfigModule.forRoot(), UsersModule], // forRoot é
})
export class AppModule {}
