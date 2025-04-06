import Parser from './Parser';
import type { TjkJockeyChanges } from '../types';

class JockeyChangesParser extends Parser<TjkJockeyChanges.Race[]> {
  parse(races: unknown): TjkJockeyChanges.Race[] {
    if (!Array.isArray(races)) {
      return [];
    }

    return races.map<TjkJockeyChanges.Race>((race) => {
      const {
        KEY: key,
        HIPODROM: hippodrome,
        YER: location,
        TARIH: raceDate = '',
        jokeyDegisiklikleri: changes = []
      } = race;

      const date = raceDate.split('/').reverse().join('-');

      return {
        key,
        hippodrome,
        location,
        date,
        changes: this.parseChanges(changes)
      };
    });
  }

  private parseChanges(changes: any[]): TjkJockeyChanges.Change[] {
    return changes.map<TjkJockeyChanges.Change>((change) => {
      const {
        KOSUNO: runNumber,
        ATNO: horseNumber,
        JOKEYYENI: newJockeyName,
        JOKEYESKI: oldJockeyName
      } = change;

      return {
        runNumber: +runNumber,
        horseNumber: +horseNumber,
        newJockeyName,
        oldJockeyName
      };
    });
  }
}

export default JockeyChangesParser;
