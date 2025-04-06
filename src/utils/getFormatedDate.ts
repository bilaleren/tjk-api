import { TjkTypeError } from '../errors';

const DATE_REGEX = /^\d{2}\/\d{2}\/\d{4}$/;

function getFormatedDate(date: string | Date): string {
  let instance: Date;

  if (typeof date === 'string') {
    if (DATE_REGEX.test(date)) {
      return date;
    }

    instance = new Date(date);
  } else {
    instance = date;
  }

  if (date.toString() === 'Invalid Date') {
    throw new TjkTypeError('An invalid date was provided.');
  }

  const day = instance.getDate().toString().padStart(2, '0');
  const month = (instance.getMonth() + 1).toString().padStart(2, '0');
  const year = instance.getFullYear();

  return `${day}/${month}/${year}`;
}

export default getFormatedDate;
