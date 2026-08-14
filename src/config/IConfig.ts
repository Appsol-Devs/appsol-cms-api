export interface IConfig {
  port: number;
  mongo: {
    uri: string;
  };
  postgres: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    url: string;
  };
  permissionKey: string;
  jwtSecret: string;
  mailerAppPassword: string;
  mailerEmail: string;
  mailerPort: number;
  mailerService: string;
  mailerHost: string;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecrete: string;
  internalApiKey: string;
  resendApiKey: string;
}
