import Parser from './Parser';
import { parseNumber } from '../utils';
import type { TjkAgf } from '../types';

class AgfParser extends Parser<TjkAgf.Race[]> {
  parse(races: unknown): TjkAgf.Race[] {
    if (!Array.isArray(races)) {
      return [];
    }

    return races.map<TjkAgf.Race>((race) => {
      const {
        KEY: key,
        HIPODROM: hippodrome,
        YER: location,
        TARIH: raceDate = '',
        bahisler: bets = []
      } = race;

      const date = raceDate.split('/').reverse().join('-');

      return {
        key,
        hippodrome,
        location,
        date,
        bets: this.parseBets(bets)
      };
    });
  }

  private parseRuns(runs: any[]): TjkAgf.Run[] {
    return runs.map<TjkAgf.Run>((run) => {
      const { NO: no, atlar: horses = [] } = run;

      return {
        no: +no,
        horses: this.parseHorses(horses)
      };
    });
  }

  private parseBets(bets: any[]): TjkAgf.Bet[] {
    return bets.map<TjkAgf.Bet>((bet) => {
      const {
        BAHIS: name,
        RESMI: official,
        AGFMODTIME: lastUpdateTime,
        kosular: runs = []
      } = bet;

      return {
        name,
        official,
        lastUpdateTime,
        runs: this.parseRuns(runs)
      };
    });
  }

  private parseHorses(horses: any[]): TjkAgf.Horse[] {
    return horses.map<TjkAgf.Horse>((horse) => {
      const {
        NO: no,
        AD: name,
        JOKEY: jockeyName,
        AGFSIRANO: rank,
        AGFORAN: rate,
        KOSMAZ: outOfRace = false,
        EKURI: stablemate,
        EKURIAGFORAN: stablemateRate
      } = horse;

      return {
        no: +no,
        name,
        jockeyName,
        rank: +rank,
        rate: parseNumber(rate),
        outOfRace: outOfRace || undefined,
        stablemate,
        stablemateRate: stablemateRate ? parseNumber(stablemateRate) : undefined
      };
    });
  }
}

export default AgfParser;
