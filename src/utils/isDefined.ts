function isDefined<T>(value: T): value is NonNullable<T> {
  return value != null;
}

export default isDefined;
