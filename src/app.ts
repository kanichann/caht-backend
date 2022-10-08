import { config } from './config';
import { ChattyServer } from './setupServer';
import express, { Express } from 'express';
import databaseConnection from './setupDatabase';

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
  }
}

const application: Application = new Application();
application.initialize();
