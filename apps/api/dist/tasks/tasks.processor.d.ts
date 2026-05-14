import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TasksService } from './tasks.service';
export declare class TasksProcessor extends WorkerHost {
    private tasksService;
    constructor(tasksService: TasksService);
    process(job: Job<any, any, string>): Promise<any>;
}
