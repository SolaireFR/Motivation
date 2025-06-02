import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskController } from './controllers/task.controller';
import { BudgetController } from './controllers/budget.controller';
import { TaskService } from './services/task.service';
import { BudgetService } from './services/budget.service';
import { Task, TaskSchema } from './schemas/task.schema';
import { Budget, BudgetSchema } from './schemas/budget.schema';
import configuration from './config/configuration';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Budget.name, schema: BudgetSchema }
    ])
  ],
  controllers: [TaskController, BudgetController],
  providers: [TaskService, BudgetService],
})
export class AppModule {}
