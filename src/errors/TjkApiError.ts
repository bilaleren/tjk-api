import TjkError from './TjkError';
import type { TjkFailResponse } from '../types';

class TjkApiError extends TjkError {
  private readonly response!: TjkFailResponse;

  constructor(response: TjkFailResponse) {
    super(response.message);
    this.response = response;
  }

  get name(): string {
    return TjkApiError.name;
  }

  get errorCode(): number {
    return this.response.errorCode;
  }
}

export default TjkApiError;
