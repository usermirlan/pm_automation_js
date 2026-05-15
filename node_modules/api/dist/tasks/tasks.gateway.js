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
exports.TasksGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const event_emitter_1 = require("@nestjs/event-emitter");
let TasksGateway = class TasksGateway {
    server;
    handleConnection(client) {
        console.log('Client connected:', client.id);
    }
    handleTaskUpdatedEvent(payload) {
        this.server.emit('task_updated', payload);
    }
    handleTaskCreatedEvent(payload) {
        this.server.emit('task_created', payload);
    }
    handleTaskDeletedEvent(payload) {
        this.server.emit('task_deleted', payload);
    }
};
exports.TasksGateway = TasksGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TasksGateway.prototype, "server", void 0);
__decorate([
    (0, event_emitter_1.OnEvent)('task.updated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TasksGateway.prototype, "handleTaskUpdatedEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('task.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TasksGateway.prototype, "handleTaskCreatedEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('task.deleted'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TasksGateway.prototype, "handleTaskDeletedEvent", null);
exports.TasksGateway = TasksGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true })
], TasksGateway);
//# sourceMappingURL=tasks.gateway.js.map