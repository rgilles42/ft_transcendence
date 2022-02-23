class ConfigService {
  constructor(private readonly env: { [k: string]: (string | undefined) }) {
    this.env = env;
  }

  private getValue(key: string, defaultValue = '', throwOnMissing = true): string {
    const value = this.env[key];
    if (value === undefined || value === null) {
      if (throwOnMissing) {
        throw new Error(`config error - missing env.${key}`);
      }
      return defaultValue;
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, '', true));
    return this;
  }

  public getAppEnv() {
    return this.getValue('NODE_ENV', '', false);
  }

  public getBaseUrl() {
    return this.getValue('BASE_URL', '', false);
  }

  public getApiUrl() {
    return this.getValue('VUE_APP_API_URL', '', false);
  }

  public isProduction() {
    return ['production', 'prod'].includes(this.getAppEnv());
  }

  public getFortyTwoConfig() {
    return {
      clientId: this.getValue('VUE_APP_FORTY_TWO_CLIENT_ID', '', false),
    };
  }
}

export const configService = new ConfigService(process.env).ensureValues([
  'NODE_ENV',
  'BASE_URL',
  'VUE_APP_API_URL',
  'VUE_APP_FORTY_TWO_CLIENT_ID',
]);

export default { configService };
