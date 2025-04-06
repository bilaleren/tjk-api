import isDefined from './isDefined';

function isPlainObject(value: unknown): value is Record<string, any> {
  return isDefined(value) && Object.getPrototypeOf(value) === Object.prototype;
}

export default isPlainObject;
