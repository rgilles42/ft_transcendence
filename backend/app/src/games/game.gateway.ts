import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RemoteSocket, Server, Socket } from 'socket.io';
import { configService } from 'src/config/config.service';
import { GamesService } from './games.service';
import { parse } from 'cookie';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { GameEntity } from 'src/_entities/game.entity';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: (reqOrigin, cb) => {
      if (
        !reqOrigin ||
        !configService.getCorsConfig().origin.includes(reqOrigin)
      ) {
        cb(new Error('Not allowed by CORS'));
        return;
      }
      cb(null, true);
    },
    credentials: configService.getCorsConfig().credentials,
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  games: {
    entity: GameEntity;
    leftPaddlePos: number;
    rightPaddlePos: number;
  }[];

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    @Inject(forwardRef(() => GamesService))
    private gamesService: GamesService,
  ) {}

  afterInit() {
    this.server.use(async (newClient, next) => {
      try {
        const cookies = parse(newClient.handshake.headers.cookie || '');
        const access_token =
          newClient.handshake.auth.access_token || cookies.access_token;
        if (!access_token) {
          throw new UnauthorizedException('No access_token provided.');
        }
        const payload = this.authService.verifyJwt(access_token);
        const user = await this.usersService.findOne(payload.id);
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
        newClient.data.user = user;
        newClient.data.desiredGameParams = { map: '', powerUps: [] };
        next();
      } catch (err) {
        next(err);
      }
    });
    this.games = [];
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Client Connected: ${client.id}`);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client Disconnected: ${client.id}`);
  }

  @SubscribeMessage('moveRacket')
  moveRacket(
    @ConnectedSocket() client: Socket,
    @MessageBody('gameId') gameId: number,
    @MessageBody('moveUp') moveUp: boolean,
  ) {
    const game = this.games.find((game) => game.entity.id === gameId);
    if (!game) throw new NotFoundException();
    if (client.data.user.id === game.entity.player1Id) {
      game.leftPaddlePos += moveUp ? 10 : -10;
    } else if (client.data.user.id === game.entity.player2Id) {
      game.rightPaddlePos += moveUp ? 10 : -10;
    } else throw new ForbiddenException('Client is not a player.');
  }

  gameLoop(game: {
    entity: GameEntity;
    leftPaddlePos: number;
    rightPaddlePos: number;
  }) {
    this.server.in(game.entity.id.toString()).emit('uwu');
  }

  async launchGame(
    player1: RemoteSocket<DefaultEventsMap, any>,
    player2: Socket,
    map: string,
    powerUps: string[],
  ) {
    let newGame: GameEntity;
    try {
      newGame = await this.gamesService.create({
        player1Id: player1.data.user.id,
        player2Id: player2.data.user.id,
        map,
        powerUps,
      });
    } catch (err) {
      throw err;
    }
    player1.join(newGame.id.toString());
    player2.join(newGame.id.toString());
    this.server.in(newGame.id.toString()).emit('gameStarted', newGame);
    this.games.push({ entity: newGame, leftPaddlePos: 0, rightPaddlePos: 0 });
    this.gameLoop(this.games.find((game) => game.entity.id === newGame.id));
    this.server.in(newGame.id.toString()).disconnectSockets(true);
  }

  @SubscribeMessage('getGames')
  getGames(@ConnectedSocket() client: Socket) {
    client.emit('activeGames', this.games);
  }

  @SubscribeMessage('observeGame')
  observeGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('game') game: GameEntity,
  ) {
    if (this.games.some((activeGame) => activeGame.entity.id === game.id)) {
      client.join(game.id.toString());
      client.emit('gameStarted', game);
    } else throw new NotFoundException();
  }

  @SubscribeMessage('acceptInvit')
  async createGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('invitingPlayerId') invitingPlayerId: number,
    @MessageBody('map') map: string,
    @MessageBody('powerUps') powerUps: string[],
  ) {
    const results = (await this.server.fetchSockets()).filter(
      (socket) => socket.data.user.id === invitingPlayerId,
    );
    if (results.length === 0)
      throw new BadRequestException('Inviting user is disconnected');
    this.launchGame(results[0], client, map, powerUps);
  }

  @SubscribeMessage('joinParty')
  async joinParty(
    @ConnectedSocket() client: Socket,
    @MessageBody('map') map: string,
    @MessageBody('powerUps') powerUps: string[],
  ) {
    client.data.desiredGameParams = { map, powerUps };
    client.join('lobby');
    const waitingClients = await this.server.in('lobby').fetchSockets();
    const matches = waitingClients.filter(
      (socket) =>
        socket.data.desiredGameParams === client.data.desiredGameParams,
    );
    if (matches.length !== 0) {
      client.leave('lobby');
      matches[0].leave('lobby');
      this.launchGame(matches[0], client, map, powerUps);
    }
  }
}
