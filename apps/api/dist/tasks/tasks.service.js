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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
let TasksService = class TasksService {
    prisma;
    eventEmitter;
    deadlineQueue;
    constructor(prisma, eventEmitter, deadlineQueue) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
        this.deadlineQueue = deadlineQueue;
    }
    async findAll() {
        return this.prisma.task.findMany();
    }
    async findOne(id) {
        return this.prisma.task.findUnique({ where: { id } });
    }
    async create(data) {
        const createdTask = await this.prisma.task.create({
            data: {
                title: data.title,
                projectId: data.projectId,
                status: 'TODO',
            },
        });
        this.eventEmitter.emit('task.created', createdTask);
        if (data.title.startsWith('Проект:')) {
            const subTasks = ['Планирование', 'Разработка', 'Тестирование'];
            for (const subTitle of subTasks) {
                setTimeout(async () => {
                    await this.create({
                        title: `↳ ${subTitle} (${data.title.replace('Проект:', '').trim()})`,
                        projectId: data.projectId
                    });
                }, 2000);
            }
        }
        setTimeout(async () => {
            const taskInDb = await this.findOne(createdTask.id);
            if (taskInDb && taskInDb.status === 'TODO') {
                const mathRegex = /^(\d+)\s*([\+\-\*\/])\s*(\d+)$/;
                const match = taskInDb.title.match(mathRegex);
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
                    await this.update(createdTask.id, 'DONE', `${taskInDb.title} = ${result}`);
                }
                else {
                    await this.update(createdTask.id, 'IN_PROGRESS');
                }
            }
        }, 10000);
        return createdTask;
    }
    async update(id, status, newTitle) {
        const updateData = { status };
        if (newTitle)
            updateData.title = newTitle;
        if (status === 'IN_PROGRESS') {
            updateData.startedAt = new Date();
        }
        else if (status === 'DONE') {
            updateData.finishedAt = new Date();
        }
        const task = await this.prisma.task.update({
            where: { id },
            data: updateData,
        });
        this.eventEmitter.emit('task.updated', task);
        return task;
    }
    async remove(id) {
        const task = await this.prisma.task.delete({ where: { id } });
        this.eventEmitter.emit('task.deleted', task);
        return task;
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bullmq_1.InjectQueue)('deadlines')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2,
        bullmq_2.Queue])
], TasksService);
//# sourceMappingURL=tasks.service.js.map