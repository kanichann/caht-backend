import { userService } from '@service/db/user.service';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';

const log: Logger = config.createLogger('authWorker');
class UserWorker {
  async addUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      await userService.addUserData(value);
      job.progress(100);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const userWorker: UserWorker = new UserWorker();
