import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ForthyTwoAuthGuard extends AuthGuard('42') {}
