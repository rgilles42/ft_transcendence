import { TypeOrmModuleOptions } from '@nestjs/typeorm';

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

  public getAppEnv() {
    return this.getValue('APP_ENV', false);
  }

  public isProduction() {
    return ['production', 'prod'].includes(this.getAppEnv());
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

      ssl: this.isProduction(),
      synchronize: !this.isProduction(),
    };
  }

  public getFortyTwoStrategyConfig() {
    return {
      clientID: this.getValue('FORTY_TWO_CLIENT_ID'),
      clientSecret: this.getValue('FORTY_TWO_CLIENT_SECRET_ID'),
      callbackURL: 'http://127.0.0.1:3000/auth/42/callback',
    };
  }

  public getJwtConfig() {
    return {
      secret: this.getValue('JWT_SECRET'),
      accessToken: {
        maxAge: 60 * 15, // 15 minutes
      },
      refreshToken: {
        maxAge: 60 * 60 * 24 * 30, // 30 days
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
]);

export { configService };
