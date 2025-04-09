export interface FindActiveRunNumberOptions {
  runs: Array<{ no: number; startTime: string }>;
  raceDate: string;
  raceClosingTime: string;
  jumpToLastRun?: boolean;
  strict?: boolean;
}

function now(): Date {
  const date = new Date();

  date.setSeconds(0, 0);

  return date;
}

function addMinutesToDate(date: Date, minutes: number): Date {
  const cloned = new Date(date.getTime());

  cloned.setMinutes(cloned.getMinutes() + minutes);

  return cloned;
}

function normalizeTjkDate(dateString: string, timeString: string): Date {
  if (!dateString || !timeString) {
    return now();
  }

  const date = new Date(`${dateString}T${timeString}`);

  if (date.getHours() >= 0 && date.getHours() <= 9) {
    date.setDate(date.getDate() + 1);
  }

  return date;
}

function findActiveRunNumber(
  options: FindActiveRunNumberOptions
): number | null {
  const {
    runs = [],
    raceDate,
    raceClosingTime,
    strict,
    jumpToLastRun
  } = options;

  if (runs.length === 0) {
    return null;
  }

  const currentDate = now();
  const closingDate = addMinutesToDate(
    normalizeTjkDate(raceDate, raceClosingTime),
    30
  );

  if (currentDate.getTime() >= closingDate.getTime()) {
    return null;
  }

  const lastRun = runs[runs.length - 1];
  const activeRun = runs.find((run, index) => {
    const nextRun = runs[index + 1];
    const startTime = normalizeTjkDate(raceDate, run.startTime);
    const endTime = nextRun
      ? normalizeTjkDate(raceDate, nextRun.startTime)
      : addMinutesToDate(startTime, 30);

    if (!strict) {
      return (
        currentDate.getTime() >= startTime.getTime() &&
        currentDate.getTime() <= endTime.getTime()
      );
    }

    return startTime.getTime() > currentDate.getTime();
  });

  if (lastRun && jumpToLastRun && !activeRun) {
    const startTime = normalizeTjkDate(raceDate, lastRun.startTime);

    if (currentDate.getTime() >= startTime.getTime()) {
      return lastRun.no;
    }
  }

  return activeRun ? activeRun.no : null;
}

export default findActiveRunNumber;
