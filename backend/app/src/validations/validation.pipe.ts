import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationException } from './validation.exception';

const validationPipe = new ValidationPipe({
  exceptionFactory: (errors: ValidationError[]) => {
    const messages = {};
    errors.forEach((error) => {
      if (!messages[error.property]) {
        messages[error.property] = [];
      }
      Object.values(error.constraints).forEach((message) => {
        messages[error.property].push(message);
      });
    });
    return new ValidationException(messages);
  },
});

export { validationPipe };
