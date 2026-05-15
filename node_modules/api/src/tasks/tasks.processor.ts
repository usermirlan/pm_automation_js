import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TasksService } from './tasks.service';

@Processor('deadlines')
export class TasksProcessor extends WorkerHost {
  constructor(private tasksService: TasksService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name === 'auto-move') {
      const { taskId } = job.data;
      const task = await this.tasksService.findOne(taskId);
      
      if (task && task.status === 'TODO') {
        // 1. Проверяем, нет ли в названии математического примера (например "2+2")
        const mathRegex = /^(\d+)\s*([\+\-\*\/])\s*(\d+)$/;
        const match = task.title.match(mathRegex);

        if (match) {
          const num1 = parseInt(match[1]);
          const op = match[2];
          const num2 = parseInt(match[3]);
          let result = 0;

          if (op === '+') result = num1 + num2;
          if (op === '-') result = num1 - num2;
          if (op === '*') result = num1 * num2;
          if (op === '/') result = num1 / num2;

          console.log(`Automation: Solving math for task ${taskId}: ${num1} ${op} ${num2} = ${result}`);
          await this.tasksService.update(taskId, `DONE`, `${task.title} = ${result}`);
        } else {
          // 2. Если не математика, просто двигаем в IN_PROGRESS через 10 секунд
          console.log(`Automation: Task ${taskId} has not been started. Moving to IN_PROGRESS.`);
          await this.tasksService.update(taskId, 'IN_PROGRESS');
        }
      }
    }
    return {};
  }
}
