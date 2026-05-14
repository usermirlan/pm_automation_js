import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({ cors: true })
export class TasksGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  @OnEvent('task.updated')
  handleTaskUpdatedEvent(payload: any) {
    this.server.emit('task_updated', payload);
  }

  @OnEvent('task.created')
  handleTaskCreatedEvent(payload: any) {
    this.server.emit('task_created', payload);
  }

  @OnEvent('task.deleted')
  handleTaskDeletedEvent(payload: any) {
    this.server.emit('task_deleted', payload);
  }
}
