import { config } from '@root/config';
import { ChattyServer } from '@root/setupServer';
import express, { Express } from 'express';
import databaseConnection from '@root/setupDatabase';

class Application {
  public initialize(): void {
    this.loadConfig();
    databaseConnection();
    const app: Express = express();
    const serverr: ChattyServer = new ChattyServer(app);
    serverr.start();
  }
  private loadConfig(): void {
    config.validateConfig;
    config.cloudinaryConfirm();
  }
}

const application: Application = new Application();
application.initialize();
