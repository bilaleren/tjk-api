import Transformer from './Transformer';
import type { TjkProbables } from '../types';

class ProbablesTransformer extends Transformer<TjkProbables.Race[]> {
  static create(): ProbablesTransformer {
    return new ProbablesTransformer();
  }

  transform(races: unknown): TjkProbables.Race[] {
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
        runs: this.transformRuns(runs)
      };
    });
  }

  protected transformRuns(runs: any[]): TjkProbables.Run[] {
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
        bets: this.transformBets(bets)
      };
    });
  }

  protected transformBets(bets: any[]): TjkProbables.Bet[] {
    return bets.map<TjkProbables.Bet>((bet) => {
      const { BAHIS: name, DURUM: status, muhtemeller: probables = [] } = bet;

      return {
        name,
        status,
        probables: this.transformBetProbables(probables)
      };
    });
  }

  protected transformBetProbables(probables: any[]): TjkProbables.Probable[] {
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
        runners: this.transformProbableRunners(probable),
        stablemate: stablemate || undefined,
        agf: agf || undefined,
        outOfRace: outOfRace || undefined
      };
    });
  }

  protected transformProbableRunners(probable: any): number[] {
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

export default ProbablesTransformer;
