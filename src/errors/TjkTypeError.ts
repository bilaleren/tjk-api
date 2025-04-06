import TjkError from './TjkError';

class TjkTypeError extends TjkError {
  constructor(message: string) {
    super(message);
  }

  get name(): string {
    return TjkTypeError.name;
  }
}

export default TjkTypeError;
