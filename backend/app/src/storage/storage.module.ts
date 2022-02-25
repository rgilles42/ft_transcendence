import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageModule as StorageModuleBase } from '@squareboat/nest-storage';
import { configService } from 'src/config/config.service';
import { StorageController } from './storage.controller';

@Module({
  imports: [StorageModuleBase.register(configService.getStorageConfig())],
  providers: [StorageService],
  exports: [StorageService],
  controllers: [StorageController],
})
export class StorageModule {}
