import Parser from './Parser';
import type { TjkProbables } from '../types';

class ProbablesParser extends Parser<TjkProbables.Race[]> {
  parse(races: unknown): TjkProbables.Race[] {
    if (!Array.isArray(races)) {
      return [];
    }

    return races.map((race) => {
      const {
        KEY: key,
        HIPODROM: hippodrome,
        YER: location,
        TARIH: raceDate,
        kosular: runs = []
      } = race;

      const date = raceDate
        ? (raceDate as string).split('/').reverse().join('-')
        : undefined;

      return {
        key,
        hippodrome,
        location,
        date,
        runs: this.parseRuns(runs)
      };
    });
  }

  private parseRuns(runs: any[]): TjkProbables.Run[] {
    return runs.map<TjkProbables.Run>((run) => {
      const {
        NO: no,
        SAAT: startTime,
        DURUM: status,
        mTime: lastUpdateTime,
        bahisler: bets = []
      } = run;

      return {
        no: +no,
        startTime,
        status,
        lastUpdateTime: lastUpdateTime || undefined,
        bets: this.parseBets(bets)
      };
    });
  }

  private parseBets(bets: any[]): TjkProbables.Bet[] {
    return bets.map<TjkProbables.Bet>((bet) => {
      const { BAHIS: name, DURUM: status, muhtemeller: probables = [] } = bet;

      return {
        name,
        status,
        probables: this.parseBetProbables(probables)
      };
    });
  }

  private parseBetProbables(probables: any[]): TjkProbables.Probable[] {
    return probables.map<TjkProbables.Probable>((probable) => {
      const {
        ATADI: horseName,
        KOSMAZ: outOfRace,
        GANYAN: odds,
        EKURI: stablemate,
        AGF: agf
      } = probable;

      return {
        horseName: horseName || undefined,
        odds: odds && odds !== '-' ? odds : undefined,
        runners: this.parseProbableRunners(probable),
        stablemate: stablemate || undefined,
        agf: agf || undefined,
        outOfRace: outOfRace || undefined
      };
    });
  }

  private parseProbableRunners(probable: any): number[] {
    const runners: number[] = [];

    for (let i = 1; i <= 2; i++) {
      const value = probable['SONUC' + i];

      if (value && typeof value === 'string') {
        runners.push(+value);
      }
    }

    return runners;
  }
}

export default ProbablesParser;
