function parseNumber(value: unknown, fallback?: number): number {
  let result = NaN;

  if (typeof value === 'number') {
    result = value;
  } else if (typeof value === 'string') {
    if (value === '0' || value === '0.00' || value === '0,00') {
      return 0;
    }

    const fractions = value.replace(/,/g, '.').split('.').filter(Boolean);
    const lastFraction = fractions.pop();

    if (fractions.length >= 1 && lastFraction !== undefined) {
      result = +fractions.join('').concat('.', lastFraction);
    } else if (lastFraction !== undefined) {
      result = +lastFraction;
    }
  }

  return Number.isFinite(result) ? result : (fallback ?? 0);
}

export default parseNumber;
