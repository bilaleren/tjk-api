import type { HorseAgf, BestGrade, RaceRunway, RaceWeather } from '../types';

abstract class Parser<TReturn> {
  abstract parse(value: unknown): TReturn;

  protected isId(value: unknown): value is string {
    return typeof value === 'string' && value !== '' && value !== '0';
  }

  protected parseRunway(value: any): RaceRunway {
    const { cim: grass, kum: sand } = value;

    return {
      grass: {
        status: grass.DURUM || undefined,
        weight: grass.AGIRLIK || 0
      },
      sand: {
        status: sand.DURUM || undefined,
        weight: sand.AGIRLIK || 0
      }
    };
  }

  protected parseWeather(value: any): RaceWeather {
    const { DURUM: status, NEM: moisture, SICAKLIK: temperature } = value;

    return {
      status: status || undefined,
      moisture,
      temperature
    };
  }

  protected parseHorseAgf(
    horse: any,
    index: 1 | 2,
    rateKeyPrefix: string = 'AGF',
    rankKeyPrefix: string = 'AGFSIRA'
  ): HorseAgf | undefined {
    const RATE_KEY = rateKeyPrefix + index;
    const RANK_KEY = rankKeyPrefix + index;
    const rate = horse[RATE_KEY];
    const rank = horse[RANK_KEY];

    if (typeof rate === 'number' && typeof rank === 'number' && rank > 0) {
      return {
        rate,
        rank
      };
    }

    return undefined;
  }

  protected parseBestGrade(value: any): BestGrade | undefined {
    const {
      ENIYIDERECE: timing,
      ENIYIDERECEACIKLAMA: description,
      ENIYIDERECEFARKLIHIPODROM: anotherHippodrome = false
    } = value;

    if (
      timing &&
      description &&
      typeof timing === 'string' &&
      typeof description === 'string'
    ) {
      return {
        timing,
        description: description
          .replace(
            'Bu bilgiler 1996 yılından bu zamana kadar olan verileri kapsamaktadır.',
            ''
          )
          .trim(),
        anotherHippodrome
      };
    }

    return undefined;
  }
}

export default Parser;
