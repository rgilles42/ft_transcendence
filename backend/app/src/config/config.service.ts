import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { StorageOptions } from '@squareboat/nest-storage';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getAppName() {
    return this.getValue('APP_NAME', false);
  }

  public getAppEnv() {
    return this.getValue('APP_ENV', false);
  }

  public getAppUrl() {
    const apiUrl = this.getValue('APP_URL', false);
    return apiUrl.replace(new RegExp('[/]+$'), '');
  }

  public getFrontUrl() {
    const apiUrl = this.getValue('FRONT_URL', false);
    return apiUrl.replace(new RegExp('[/]+$'), '');
  }

  public isProduction() {
    return ['production', 'prod'].includes(this.getAppEnv());
  }

  public getCorsConfig() {
    const corsConfig = {
      origin: [
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'https://localhost:8080',
        'https://127.0.0.1:8080',
      ],
      credentials: true,
    };
    if (this.getFrontUrl() !== undefined) {
      corsConfig.origin.push(this.getFrontUrl());
    }
    return corsConfig;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: this.getValue('DB_DRIVER') as any,

      host: this.getValue('DB_HOST'),
      port: parseInt(this.getValue('DB_PORT')),
      database: this.getValue('DB_DATABASE'),
      username: this.getValue('DB_USERNAME'),
      password: this.getValue('DB_PASSWORD'),

      entities: ['dist/_entities/**/*.entity.{ts,js}'],

      migrationsTableName: 'migrations',

      migrations: ['dist/migrations/**/*.{ts,js}'],

      cli: {
        migrationsDir: 'src/migrations',
      },

      ssl: false, // this.isProduction(),
      synchronize: !this.isProduction(),
    };
  }

  public getFortyTwoStrategyConfig() {
    return {
      clientID: this.getValue('FORTY_TWO_CLIENT_ID'),
      clientSecret: this.getValue('FORTY_TWO_CLIENT_SECRET_ID'),
      callbackURL: `${this.getAppUrl()}/auth/42/callback`,
    };
  }

  public getJwtConfig() {
    return {
      secret: this.getValue('JWT_SECRET'),
      accessToken: {
        maxAge: 60 * 60 * 1, // 1 hour
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      },
      refreshToken: {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/auth/refresh',
      },
    };
  }

  public getStorageConfig(): StorageOptions {
    return {
      default: 'local',
      disks: {
        local: {
          driver: 'local',
          basePath: './uploads/', // fully qualified path of the folder
        },
      },
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'DB_DRIVER',
  'DB_HOST',
  'DB_PORT',
  'DB_DATABASE',
  'DB_USERNAME',
  'DB_PASSWORD',
  'APP_URL',
]);

export { configService };
