import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestrictionEntity } from 'src/_entities/channel-restriction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RestrictionsService {
  constructor(
    @InjectRepository(RestrictionEntity)
    private restrictionRepository: Repository<RestrictionEntity>,
  ) {}

  findAll(): Promise<RestrictionEntity[]> {
    return this.restrictionRepository.find({ relations: ['user'] });
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
