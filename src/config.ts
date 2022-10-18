import dotenv from 'dotenv';
import bunyan from 'bunyan';
import cloudinary from 'cloudinary';

dotenv.config({});
class Config {
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TOW: string | undefined;
  public CLIENT_URL: string | undefined;
  public REDIS_HOST: string | undefined;
  public CLOURD_API_KEY: string | undefined;
  public CLOURD_NAME: string | undefined;
  public CLOURD_API_SECRET: string | undefined;
  public SENDER_EMAIL: string | undefined;
  public SENDER_EMAIL_PASSWORD: string | undefined;
  public SENDGRID_API_KEY: string | undefined;
  public SENDGRID_SENDER: string | undefined;
  private readonly DEFULRT_DATABASE_URL = 'mongodb+srv://ganis9531:95319531@chatty.u5jf11n.mongodb.net/test';

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFULRT_DATABASE_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN || '1234';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
    this.SECRET_KEY_TOW = process.env.SECRET_KEY_TOW || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.CLOURD_API_KEY = process.env.CLOURD_API_KEY || '';
    this.CLOURD_NAME = process.env.CLOURD_NAME || '';
    this.CLOURD_API_SECRET = process.env.CLOURD_API_SECRET || '';
    this.SENDER_EMAIL = process.env.SENDER_EMAIL || '';
    this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || '';
    this.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
    this.SENDGRID_SENDER = process.env.SENDGRID_SENDER || '';
  }
  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' });
  }
  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configration ${key} is undefined`);
      }
    }
  }

  public cloudinaryConfirm(): void {
    cloudinary.v2.config({
      cloud_name: this.CLOURD_NAME,
      api_key: this.CLOURD_API_KEY,
      api_secret: this.CLOURD_API_SECRET
    });
  }
}
export const config: Config = new Config();
