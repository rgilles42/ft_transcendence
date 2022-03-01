import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestrictionEntity } from 'src/_entities/channel-restriction.entity';
import { Repository } from 'typeorm';
import { ChatGateway } from '../chat.gateway';
import { restrictionDto } from '../_dto/restriction.dto';

@Injectable()
export class RestrictionsService {
  constructor(
    @InjectRepository(RestrictionEntity)
    private restrictionRepository: Repository<RestrictionEntity>,
    private chatGateway: ChatGateway,
  ) {}

  findAll(): Promise<RestrictionEntity[]> {
    return this.restrictionRepository.find();
  }

  async create(
    channelId: number,
    restrData: restrictionDto,
  ): Promise<RestrictionEntity> {
    const restriction = new RestrictionEntity();
    restriction.channelId = channelId;
    restriction.userId = restrData.userId;
    restriction.type = restrData.type;
    restriction.endAt = restrData.endAt;
    try {
      const newRestriction = await this.restrictionRepository.save(restriction);
      this.chatGateway.broadcastNewRestriction(newRestriction);
      return newRestriction;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async remove(id: number): Promise<RestrictionEntity> {
    try {
      const restriction = await this.restrictionRepository.findOneOrFail(id);
      this.restrictionRepository.delete(id);
      this.chatGateway.broadcastDeleteRestriction(restriction);
      return restriction;
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
