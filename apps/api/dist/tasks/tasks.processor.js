"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const tasks_service_1 = require("./tasks.service");
let TasksProcessor = class TasksProcessor extends bullmq_1.WorkerHost {
    tasksService;
    constructor(tasksService) {
        super();
        this.tasksService = tasksService;
    }
    async process(job) {
        if (job.name === 'auto-move') {
            const { taskId } = job.data;
            const task = await this.tasksService.findOne(taskId);
            if (task && task.status === 'TODO') {
                const mathRegex = /^(\d+)\s*([\+\-\*\/])\s*(\d+)$/;
                const match = task.title.match(mathRegex);
                if (match) {
                    const num1 = parseInt(match[1]);
                    const op = match[2];
                    const num2 = parseInt(match[3]);
                    let result = 0;
                    if (op === '+')
                        result = num1 + num2;
                    if (op === '-')
                        result = num1 - num2;
                    if (op === '*')
                        result = num1 * num2;
                    if (op === '/')
                        result = num1 / num2;
                    console.log(`Automation: Solving math for task ${taskId}: ${num1} ${op} ${num2} = ${result}`);
                    await this.tasksService.update(taskId, `DONE`, `${task.title} = ${result}`);
                }
                else {
                    console.log(`Automation: Task ${taskId} has not been started. Moving to IN_PROGRESS.`);
                    await this.tasksService.update(taskId, 'IN_PROGRESS');
                }
            }
        }
        return {};
    }
};
exports.TasksProcessor = TasksProcessor;
exports.TasksProcessor = TasksProcessor = __decorate([
    (0, bullmq_1.Processor)('deadlines'),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksProcessor);
//# sourceMappingURL=tasks.processor.js.map