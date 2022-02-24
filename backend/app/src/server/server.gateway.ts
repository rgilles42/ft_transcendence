import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(/*port, { namespace:  }*/)
export class ServerGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

    @WebSocketServer() wss: Server;

    private logger: Logger = new Logger('ServerGateway'); 

    afterInit(server: Server) {
        this.logger.log('Server init');
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client Disconnected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client Connected: ${client.id}`);
    } 

    @SubscribeMessage('chatToServer')
    handleMessage(client: Socket, message: { sender: string, room: string, message:string }): void {
        this.wss.to(message.room).emit('chatToClient', message);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, room: string) {
        client.join('room');
        client.emit('joinedRoom', room);
    }

    @SubscribeMessage('joinRoom')
    handleLeaveRom(client: Socket, room: string) {
        client.leave('room');
        client.emit('leftRoom', room);
    }
}
