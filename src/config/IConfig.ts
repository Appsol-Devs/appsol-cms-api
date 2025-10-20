export interface IConfig {
  port: number;
  mongo: {
    uri: string;
  };

  permissionKey: string;
}
