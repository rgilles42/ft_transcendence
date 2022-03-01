import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getMOTD(): string {
    return 'ft_transcendence backend server, powered by NestJS<br><br>Proudly presented by pkevin, ppaglier & rgilles, © 2022';
  }
}
