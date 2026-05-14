import { OnGatewayConnection } from '@nestjs/websockets';
import { Server } from 'socket.io';
export declare class TasksGateway implements OnGatewayConnection {
    server: Server;
    handleConnection(client: any): void;
    handleTaskUpdatedEvent(payload: any): void;
    handleTaskCreatedEvent(payload: any): void;
    handleTaskDeletedEvent(payload: any): void;
}
