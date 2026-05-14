import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import axios from 'axios';

@Injectable()
export class TelegramListener {
  // Вставьте сюда ваши данные из BotFather
  private readonly BOT_TOKEN = 'YOUR_BOT_TOKEN';
  private readonly CHAT_ID = 'YOUR_CHAT_ID';

  @OnEvent('task.updated')
  async handleTaskUpdated(task: any) {
    if (task.status === 'DONE') {
      const message = `🎉 *Задача завершена!* \n\n📌 Название: ${task.title}\n✅ Статус: Готово`;
      
      console.log('--- Telegram Automation ---');
      console.log('Sending notification:', message);

      // Раскомментируйте код ниже, когда вставите свои токены
      /*
      try {
        await axios.post(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`, {
          chat_id: this.CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        });
      } catch (error) {
        console.error('Failed to send Telegram notification. Check your tokens.');
      }
      */
    }
  }
}
