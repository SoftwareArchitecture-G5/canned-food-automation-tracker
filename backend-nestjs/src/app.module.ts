import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from '@nestjs/config';
import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AutomationModule } from './automation/automation.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { BlueprintModule } from './blueprint/blueprint.module';
import * as process from "node:process";
import {AuthModule} from "./auth/auth.module";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true,}),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: String(process.env.DB_HOST),
            port: Number(process.env.DB_PORT),
            username: String(process.env.DB_USERNAME),
            password: String(process.env.DB_PASS),
            database: String(process.env.DB_NAME),
            ssl: Boolean(process.env.DB_SSL),
            autoLoadEntities: true,
            synchronize: true,
        }),
        AutomationModule,
        MaintenanceModule,
        BlueprintModule,
        AuthModule,

    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
