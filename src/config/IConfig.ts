export interface IConfig {
  port: number;
  mongo: {
    uri: string;
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
}
