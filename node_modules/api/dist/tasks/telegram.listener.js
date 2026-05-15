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
exports.TelegramListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let TelegramListener = class TelegramListener {
    BOT_TOKEN = 'YOUR_BOT_TOKEN';
    CHAT_ID = 'YOUR_CHAT_ID';
    async handleTaskUpdated(task) {
        if (task.status === 'DONE') {
            const message = `🎉 *Задача завершена!* \n\n📌 Название: ${task.title}\n✅ Статус: Готово`;
            console.log('--- Telegram Automation ---');
            console.log('Sending notification:', message);
        }
    }
};
exports.TelegramListener = TelegramListener;
__decorate([
    (0, event_emitter_1.OnEvent)('task.updated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramListener.prototype, "handleTaskUpdated", null);
exports.TelegramListener = TelegramListener = __decorate([
    (0, common_1.Injectable)()
], TelegramListener);
//# sourceMappingURL=telegram.listener.js.map