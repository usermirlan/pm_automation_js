import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksGateway } from './tasks.gateway';
import { TasksProcessor } from './tasks.processor';
import { TelegramListener } from './telegram.listener';
import { PrismaService } from '../prisma.service';

import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'deadlines',
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksGateway, TasksProcessor, TelegramListener, PrismaService],
})
export class TasksModule {}
