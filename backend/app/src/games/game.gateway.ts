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

enum GameState {
  RUNNING = 0,
  FINISHED = 1,
  STARTING = 3,
}

class GameObject {
  leftGoUp: boolean;
  leftGoDown: boolean;
  rightGoUp: boolean;
  rightGoDown: boolean;
  racketLen: number;
  leftRacketPos: number;
  rightRacketPos: number;
  ball: {
    size: number;
    xPos: number;
    yPos: number;
    xSpeed: number;
    ySpeed: number;
  };
  entity: GameEntity;
  player1Ready: boolean;
  player2Ready: boolean;
  state: GameState;
}

function normalise(x: number, y: number): { x: number; y: number } {
  const length = Math.sqrt(x * x + y * y);
  return { x: x / length, y: y / length };
}

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
  games: GameObject[];

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
    const activeGame = this.games.find(
      (games) =>
        games.entity.player1Id === client.data.user.id ||
        games.entity.player2Id === client.data.user.id,
    );
    if (activeGame) {
      client.join(activeGame.entity.id.toString());
      client.emit('gameStarted', activeGame);
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client Disconnected: ${client.id}`);
    const activeGame = this.games.find(
      (games) =>
        games.entity.player1Id === client.data.user.id ||
        games.entity.player2Id === client.data.user.id,
    );
    if (activeGame) {
      if (client.data.user.id === activeGame.entity.player1Id) {
        activeGame.leftGoDown = activeGame.leftGoUp = false;
      } else {
        activeGame.rightGoDown = activeGame.rightGoUp = false;
      }
    }
  }

  @SubscribeMessage('getGames')
  getGames(@ConnectedSocket() client: Socket) {
    client.emit('activeGames', this.games);
  }

  @SubscribeMessage('observeGame')
  observeGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('gameId') gameId: number,
  ) {
    const game = this.games.find(
      (activeGame) => activeGame.entity.id === gameId,
    );
    if (game) {
      client.join(gameId.toString());
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

  equalsIgnoreOrder(a: any[], b: any[]) {
    if (a.length !== b.length) return false;
    const uniqueValues = new Set([...a, ...b]);
    for (const v of uniqueValues) {
      const aCount = a.filter((e) => e === v).length;
      const bCount = b.filter((e) => e === v).length;
      if (aCount !== bCount) return false;
    }
    return true;
  }

  evalGameParams(
    requestedParams: { map: string; powerUps: string[] },
    param: { map: string; powerUps: string[] },
  ) {
    if (requestedParams.map !== param.map) {
      return false;
    }
    return this.equalsIgnoreOrder(requestedParams.powerUps, param.powerUps);
  }

  @SubscribeMessage('joinMatchmaking')
  async joinMatchmaking(
    @ConnectedSocket() client: Socket,
    @MessageBody('map') map: string,
    @MessageBody('powerUps') powerUps: string[],
  ) {
    client.data.desiredGameParams = { map, powerUps };
    client.join('lobby');
    const waitingClients = await this.server.in('lobby').fetchSockets();
    const matches = waitingClients.filter(
      (socket) =>
        socket.id !== client.id &&
        this.evalGameParams(
          socket.data.desiredGameParams,
          client.data.desiredGameParams,
        ),
    );
    if (matches.length > 0) {
      client.leave('lobby');
      matches[0].leave('lobby');
      this.launchGame(matches[0], client, map, powerUps);
    }
  }

  // Game logic
  // in order to allow for responsiveness, all so-called dimensions/positions handled in the server
  // could be more accurately described as proportions relating to the height and length of the terrain
  // rather than actual lengths.
  //
  // ex: racketPosition belongs to the [0, 1] interval, and its actual position on screen will be
  // racketPosition * <height of the terrain>.
  // The height of the terrain is known only of the frontend and is dynamic thanks to responsiveness.
  //
  // important values:
  // racketLen = 0.06

  @SubscribeMessage('confirmReady')
  confirmReady(
    @ConnectedSocket() client: Socket,
    @MessageBody('gameId') gameId: number,
  ) {
    const game = this.games.find(
      (game) => game.entity.id === gameId && game.state === GameState.STARTING,
    );
    if (!game) throw new NotFoundException();
    if (client.data.user.id === game.entity.player1Id) {
      game.player1Ready = true;
    } else if (client.data.user.id === game.entity.player2Id) {
      game.player2Ready = true;
    }
  }

  @SubscribeMessage('keyDown')
  keyDown(
    @ConnectedSocket() client: Socket,
    @MessageBody('gameId') gameId: number,
    @MessageBody('direction') moveUp: 1,
  ) {
    const game = this.games.find(
      (game) => game.entity.id === gameId && game.state === GameState.RUNNING,
    );
    if (!game) {
      return;
    }
    if (client.data.user.id === game.entity.player1Id) {
      moveUp ? (game.leftGoUp = true) : (game.leftGoDown = true);
    } else if (client.data.user.id === game.entity.player2Id) {
      moveUp ? (game.rightGoUp = true) : (game.rightGoDown = true);
    } else throw new ForbiddenException('Client is not a player.');
  }

  @SubscribeMessage('keyUp')
  keyUp(
    @ConnectedSocket() client: Socket,
    @MessageBody('gameId') gameId: number,
    @MessageBody('direction') moveUp: 1,
  ) {
    const game = this.games.find(
      (game) => game.entity.id === gameId && game.state === GameState.RUNNING,
    );
    if (!game) {
      return;
    }
    if (client.data.user.id === game.entity.player1Id) {
      moveUp ? (game.leftGoUp = false) : (game.leftGoDown = false);
    } else if (client.data.user.id === game.entity.player2Id) {
      moveUp ? (game.rightGoUp = false) : (game.rightGoDown = false);
    } else throw new ForbiddenException('Client is not a player.');
  }

  async gameLoop(game: GameObject) {
    if (game.state === GameState.STARTING) {
      if (game.player1Ready && game.player2Ready) {
        game.ball.size = 0.02;
        game.ball.xPos = 0.5;
        game.ball.yPos = Math.random();
        const normalisedSpeed = normalise(
          Math.random() * 0.2 - 0.1,
          Math.random() * 0.2 - 0.1,
        );
        game.ball.xSpeed = 0.1 * normalisedSpeed.x;
        game.ball.ySpeed = 0.1 * normalisedSpeed.y;
        game.state = GameState.RUNNING;
      }
    } else if (game.state === GameState.RUNNING) {
      game.ball.xPos += game.ball.xSpeed * 0.17;
      game.ball.yPos += game.ball.ySpeed * 0.17;

      const racketSpeed = 0.01;

      // Left movement
      if (game.leftGoDown && game.leftRacketPos + racketSpeed <= 1) {
        game.leftRacketPos += racketSpeed;
      }
      if (game.leftGoUp && game.leftRacketPos - racketSpeed >= 0) {
        game.leftRacketPos -= racketSpeed;
      }

      // Right movement
      if (game.rightGoDown && game.rightRacketPos + racketSpeed <= 1) {
        game.rightRacketPos += racketSpeed;
      }
      if (game.rightGoUp && game.rightRacketPos - racketSpeed >= 0) {
        game.rightRacketPos -= racketSpeed;
      }

      if (game.ball.yPos + game.ball.size / 2 >= 1) {
        game.ball.yPos = 1 - game.ball.size / 2;
        game.ball.ySpeed = -game.ball.ySpeed;
      }
      if (game.ball.yPos - game.ball.size / 2 <= 0) {
        game.ball.yPos = 0 + game.ball.size / 2;
        game.ball.ySpeed = -game.ball.ySpeed;
      }
      if (game.ball.xPos + game.ball.size / 2 >= 1) {
        if (
          game.ball.yPos >= game.rightRacketPos - game.racketLen / 2 &&
          game.ball.yPos <= game.rightRacketPos + game.racketLen / 2
        ) {
          game.ball.xPos = 1 - game.ball.size / 2;
          const hitPosGradient =
            (game.ball.yPos - game.rightRacketPos) / (game.racketLen / 2);
          const normalisedSpeed = normalise(
            hitPosGradient < 0 ? -(1 + hitPosGradient) : -(1 - hitPosGradient),
            hitPosGradient,
          );
          game.ball.xSpeed =
            (1 + Math.abs(hitPosGradient)) * 0.1 * normalisedSpeed.x;
          game.ball.ySpeed =
            (1 + Math.abs(hitPosGradient)) * 0.1 * normalisedSpeed.y;
        } else {
          game.entity.player1Score++;
          game.ball.xPos = 0.5;
          game.ball.yPos = Math.random();
          const normalisedSpeed = normalise(
            Math.random() * 0.1,
            Math.random() * 0.2 - 0.1,
          );
          game.ball.xSpeed = 0.1 * normalisedSpeed.x;
          game.ball.ySpeed = 0.1 * normalisedSpeed.y;
        }
      }
      if (game.ball.xPos - game.ball.size / 2 <= 0) {
        if (
          game.ball.yPos >= game.leftRacketPos - game.racketLen &&
          game.ball.yPos <= game.leftRacketPos + game.racketLen
        ) {
          game.ball.xPos = 0 + game.ball.size / 2;
          const hitPosGradient =
            (game.ball.yPos - game.leftRacketPos) / (game.racketLen / 2);
          const normalisedSpeed = normalise(
            hitPosGradient < 0 ? 1 + hitPosGradient : 1 - hitPosGradient,
            hitPosGradient,
          );
          game.ball.xSpeed =
            (1 + Math.abs(hitPosGradient)) * 0.1 * normalisedSpeed.x;
          game.ball.ySpeed =
            (1 + Math.abs(hitPosGradient)) * 0.1 * normalisedSpeed.y;
        } else {
          game.entity.player2Score++;
          game.ball.xPos = 0.5;
          game.ball.yPos = Math.random();
          const normalisedSpeed = normalise(
            Math.random() * -0.1,
            Math.random() * 0.2 - 0.1,
          );
          game.ball.xSpeed = 0.1 * normalisedSpeed.x;
          game.ball.ySpeed = 0.1 * normalisedSpeed.y;
        }
      }
      this.server.in(game.entity.id.toString()).emit('updateGame', game);
      if (game.entity.player1Score == 11 || game.entity.player2Score == 11) {
        game.state = GameState.FINISHED;
        await this.gamesService.updateScore(
          game.entity.id,
          game.entity.player1Score,
          game.entity.player2Score,
        );
        const gameIndex = this.games.findIndex(
          (find) => find.entity.id === game.entity.id,
        );
        if (gameIndex > -1) this.games.splice(gameIndex, 1);
        this.server.in(game.entity.id.toString()).disconnectSockets(true);
      }
    }
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
        player1Score: 0,
        player2Score: 0,
        map,
        powerUps,
      });
    } catch (err) {
      throw err;
    }
    player1.join(newGame.id.toString());
    player2.join(newGame.id.toString());
    const gameObject: GameObject = {
      entity: newGame,
      leftGoDown: false,
      leftGoUp: false,
      rightGoDown: false,
      rightGoUp: false,
      player1Ready: false,
      player2Ready: false,
      state: GameState.STARTING,
      racketLen: 0.06,
      leftRacketPos: 0.5,
      rightRacketPos: 0.5,
      ball: { xPos: 0, yPos: 0, xSpeed: 0, ySpeed: 0, size: 0 },
    };
    this.gameLoop(gameObject);
    this.server.in(newGame.id.toString()).emit('gameStarted', gameObject);
    this.server.emit('activeGames', this.games);
    this.games.push(gameObject);
    const interval = setInterval(() => {
      this.gameLoop(gameObject);
      if (gameObject.state === GameState.FINISHED) clearInterval(interval);
    }, 16);
  }
}
