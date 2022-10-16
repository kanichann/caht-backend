import { ObjectSchema } from 'joi';
import { JoiRequestValidationError } from '@global/helpers/error-handlers';
import { Request } from 'express';
import Logger from 'bunyan';
import { config } from '@root/config';

const log: Logger = config.createLogger('decolator');

type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;

export function joiValidation(schema: ObjectSchema): IJoiDecorator {
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    log.info(descriptor.value);
    console.log('deco');
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];
      const { error } = await Promise.resolve(schema.validate(req.body));
      log.error(error);
      if (error?.details) {
        throw new JoiRequestValidationError(error.details[0].message);
      }
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
