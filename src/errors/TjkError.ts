abstract class TjkError extends Error {
  abstract get name(): string;
}

export default TjkError;
