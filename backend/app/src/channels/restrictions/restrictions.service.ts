import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestrictionEntity } from 'src/_entities/channel-restriction.entity';
import { Repository } from 'typeorm';
import { restrictionDto } from '../_dto/restriction.dto';

@Injectable()
export class RestrictionsService {
  constructor(
    @InjectRepository(RestrictionEntity)
    private restrictionRepository: Repository<RestrictionEntity>,
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
    restriction.userId = restrData.targetUserId;
    restriction.type = restrData.type;
    restriction.endAt = restrData.endDate;
    try {
      return await this.restrictionRepository.save(restriction);
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async remove(id: number): Promise<RestrictionEntity> {
    try {
      const restriction = await this.restrictionRepository.findOneOrFail(id);
      this.restrictionRepository.delete(id);
      return restriction;
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
