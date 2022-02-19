import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockshipEntity } from 'src/_entities/users_blockship.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlockedService {
  constructor(
    @InjectRepository(BlockshipEntity)
    private blockshipsRepository: Repository<BlockshipEntity>,
  ) {}

  findAll(): Promise<BlockshipEntity[]> {
    return this.blockshipsRepository.find({
      relations: ['user'],
    });
  }

  async remove(id: number): Promise<BlockshipEntity> {
    try {
      const blockship = await this.blockshipsRepository.findOneOrFail(id, {
        relations: ['user'],
      });
      this.blockshipsRepository.delete(id);
      return blockship;
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
