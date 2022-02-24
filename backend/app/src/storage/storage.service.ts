import { UserEntity } from './../_entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Storage } from '@squareboat/nest-storage';
import * as path from 'path';

@Injectable()
export class StorageService {
  async getAvatar(filename, getFullPath = false) {
    const storage = Storage.disk('local');

    const filePath = path.join('usersAvatars', filename);
    if (!(await storage.exists(filePath))) {
      throw new NotFoundException('Avatar not found');
    }

    if (getFullPath) {
      const { basePath } = storage.getConfig();
      return path.join(basePath, filePath);
    }
    return filePath;
  }

  async storeUserAvatar(avatar, user: UserEntity) {
    const storage = Storage.disk('local');
    if (await storage.exists(user.imageUrl)) {
      storage.delete(user.imageUrl);
    }
    const fileExtension = path.parse(avatar.originalname).ext;
    const filename = `${user.id}-${user.login}${fileExtension}`;

    const filePath = path.join('usersAvatars', filename);
    await storage.put(filePath, avatar.buffer);

    return filePath;
  }
}
