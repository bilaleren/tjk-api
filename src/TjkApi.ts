import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios';
import {
  AgfParser,
  ProgramParser,
  ResultsParser,
  BetProgramParser,
  ProbablesParser,
  HorseDetailParser,
  JockeyChangesParser,
  DetailedProgramParser
} from './parsers';
import { isPlainObject, getFormatedDate } from './utils';
import { TjkApiError, TjkTypeError } from './errors';
import {
  TjkAgf,
  TjkProgram,
  TjkResults,
  TjkProbables,
  TjkBetProgram,
  TjkHorseDetail,
  TjkJockeyChanges,
  TjkDetailedProgram,
  Hippodrome,
  TjkResponse,
  TjkSuccessResponse,
  TjkServiceResponse
} from './types';

export enum TjkServices {
  AGF = 'agf',
  PROGRAM = 'program',
  RESULTS = 'sonuclar',
  BET_PROGRAM = 'bahis-programi',
  PROBABLES = 'muhtemeller',
  PROBABLES_FULL = 'muhtemeller-tjk',
  DETAILED_PROGRAM = 'program-cache-tjk',
  HORSE_DETAIL = 'at-detay',
  HIPPODROMES = 'hipodromlar',
  JOCKEY_CHANGES = 'jokey-degisiklikleri'
}

export interface TjkServiceParams {
  date?: string | Date;
  hippodrome?: string;
  runNumber?: number;
  checksum?: string;
}

export interface TjkJockeyChangesServiceParams {
  date?: string | Date;
  hippodrome?: string;
  checksum?: string;
}

export interface TjkDetailedProgramServiceParams {
  date?: string | Date;
  checksum?: string;
}

export interface TjkBetProgramServiceParams {
  checksum?: string;
}

export interface TjkProbablesServiceParams extends TjkServiceParams {
  full?: boolean;
}

export type TjkHorseDetailServiceParams = ({ id: string } | { key: string }) & {
  checksum?: string;
};

export interface TjkHippodromesServiceParams {
  checksum?: string;
}

export interface CacheStore {
  set(key: string, value: TjkSuccessResponse): void;
  get(key: string): TjkSuccessResponse | undefined;
  has(key: string): boolean;
  delete(key: string): boolean;
  clear(): void;
}

export interface TjkCacheOptions {
  store?: CacheStore;
  enabled?: boolean;
}

export interface TjkApiConstructorOptions {
  authKey: string;
  baseURL?: string;
  cache?: TjkCacheOptions;
  axiosDefaults?: CreateAxiosDefaults;
}

class TjkApi {
  readonly client!: AxiosInstance;
  readonly cacheStore: CacheStore | undefined = undefined;

  private readonly agfParser!: AgfParser;
  private readonly programParser!: ProgramParser;
  private readonly resultsParser!: ResultsParser;
  private readonly betProgramParser!: BetProgramParser;
  private readonly probablesParser!: ProbablesParser;
  private readonly horseDetailParser!: HorseDetailParser;
  private readonly jockeyChangesParser!: JockeyChangesParser;
  private readonly detailedProgramParser!: DetailedProgramParser;

  constructor(options: TjkApiConstructorOptions) {
    const { authKey, baseURL, cache, axiosDefaults } = options;

    this.client = axios.create({
      timeout: 10 * 1000,
      baseURL:
        baseURL ||
        process.env.TJK_API_BASE_URL ||
        'https://vhs.tjk.org/vss/data',
      ...axiosDefaults,
      headers: {
        ...axiosDefaults?.headers,
        'X-Auth': authKey
      }
    });

    if (cache?.enabled) {
      this.cacheStore = cache.store || new Map<string, TjkSuccessResponse>();
    }

    this.agfParser = new AgfParser();
    this.programParser = new ProgramParser();
    this.resultsParser = new ResultsParser();
    this.betProgramParser = new BetProgramParser();
    this.probablesParser = new ProbablesParser();
    this.horseDetailParser = new HorseDetailParser();
    this.jockeyChangesParser = new JockeyChangesParser();
    this.detailedProgramParser = new DetailedProgramParser();
  }

  async getProgram(
    params?: TjkServiceParams
  ): Promise<TjkResponse<TjkProgram.Race[]>> {
    const {
      data,
      stale = false,
      checksum,
      updatetime: updateTime
    } = await this.getServiceResponse(
      TjkServices.PROGRAM,
      this.getServiceParams(params)
    );

    return {
      data: this.programParser.parse(data?.yarislar),
      stale,
      checksum,
      updateTime
    };
  }

  async getResults(
    params?: TjkServiceParams
  ): Promise<TjkResponse<TjkResults.Race[]>> {
    const {
      data,
      stale = false,
      checksum,
      updatetime: updateTime
    } = await this.getServiceResponse(
      TjkServices.RESULTS,
      this.getServiceParams(params)
    );

    return {
      data: this.resultsParser.parse(data?.yarislar),
      stale,
      checksum,
      updateTime
    };
  }

  async getBetProgram(
    params?: TjkBetProgramServiceParams
  ): Promise<TjkResponse<TjkBetProgram.Race[]>> {
    const {
      data,
      stale = false,
      checksum,
      updatetime: updateTime
    } = await this.getServiceResponse(TjkServices.BET_PROGRAM, params);

    return {
      data: this.betProgramParser.parse(data?.yarislar),
      stale,
      checksum,
      updateTime
    };
  }

  async getAgf(params?: TjkServiceParams): Promise<TjkResponse<TjkAgf.Race[]>> {
    const {
      data,
      stale = false,
      checksum,
      updatetime: updateTime
    } = await this.getServiceResponse(
      TjkServices.AGF,
      this.getServiceParams(params)
    );

    return {
      data: this.agfParser.parse(data?.yarislar),
      stale,
      checksum,
      updateTime
    };
  }

  async getProbables(
    params?: TjkProbablesServiceParams
  ): Promise<TjkResponse<TjkProbables.Race[]>> {
    const {
      data,
      stale = false,
      checksum,
      updatetime: updateTime
    } = await this.getServiceResponse(
      params?.full ? TjkServices.PROBABLES_FULL : TjkServices.PROBABLES,
      this.getServiceParams(params)
    );

    return {
      data: this.probablesParser.parse(data?.yarislar),
      stale,
      checksum,
      updateTime
    };
  }

  async getDetailedProgram(
    params?: TjkDetailedProgramServiceParams
  ): Promise<TjkResponse<TjkDetailedProgram.Race[]>> {
    const {
      data,
      stale = false,
      checksum,
      updatetime: updateTime
    } = await this.getServiceResponse(
      TjkServices.DETAILED_PROGRAM,
      this.getServiceParams(params)
    );

    return {
      data: this.detailedProgramParser.parse(data?.hippodromes),
      stale,
      checksum,
      updateTime
    };
  }

  async getHippodromes(
    params?: TjkHippodromesServiceParams
  ): Promise<TjkResponse<Hippodrome[]>> {
    const {
      data,
      stale = false,
      checksum,
      updatetime: updateTime
    } = await this.getServiceResponse(TjkServices.HIPPODROMES, params);

    const hippodromes = data.hipodromlar as any[];

    return {
      data: hippodromes.map<Hippodrome>((hippodrome) => {
        const {
          KEY: key,
          HIPODROM: name,
          YER: location,
          YABANCI: abroad
        } = hippodrome;

        return {
          key,
          name,
          location,
          abroad
        };
      }),
      stale,
      checksum,
      updateTime
    };
  }

  async getHorseDetail(
    params: TjkHorseDetailServiceParams
  ): Promise<TjkResponse<TjkHorseDetail.Horse>> {
    const {
      data,
      stale = false,
      checksum,
      updatetime: updateTime
    } = await this.getServiceResponse(
      TjkServices.HORSE_DETAIL,
      'id' in params
        ? { atkodu: params.id, checksum: params.checksum }
        : { atkey: params.key, checksum: params.checksum }
    );

    return {
      data: this.horseDetailParser.parse(data.at),
      stale,
      checksum,
      updateTime
    };
  }

  async getJockeyChanges(
    params?: TjkJockeyChangesServiceParams
  ): Promise<TjkResponse<TjkJockeyChanges.Race[]>> {
    const {
      data,
      stale = false,
      checksum,
      updatetime: updateTime
    } = await this.getServiceResponse(
      TjkServices.JOCKEY_CHANGES,
      this.getServiceParams(params)
    );

    return {
      data: this.jockeyChangesParser.parse(data?.yarislar),
      stale,
      checksum,
      updateTime
    };
  }

  private async getServiceResponse(
    service: TjkServices,
    params: Record<string, any> | undefined
  ): Promise<TjkSuccessResponse> {
    const cacheKey = this.createCacheKey(service, params);
    const cachedData =
      this.cacheStore && !params?.checksum
        ? this.cacheStore.get(cacheKey)
        : undefined;

    const { data } = await this.client.get<
      TjkServiceResponse | null | undefined
    >(`/${service}`, {
      params: cachedData
        ? {
            ...params,
            checksum: cachedData.checksum
          }
        : params
    });

    if (!isPlainObject(data)) {
      throw new TjkTypeError('Invalid TJK api response.');
    } else if (!data.success) {
      throw new TjkApiError(data);
    }

    if (cachedData && !data.data) {
      return {
        ...cachedData,
        stale: true
      };
    }

    if (this.cacheStore && !params?.checksum) {
      this.cacheStore.set(cacheKey, data);
    }

    return data;
  }

  private createCacheKey(
    service: TjkServices,
    params: Record<string, any> | undefined
  ): string {
    let cacheKey = '';

    if (!params) {
      return service;
    }

    for (const key in params) {
      if (key === 'checksum') {
        continue;
      }

      cacheKey += params[key];
    }

    return cacheKey ? `${service}:${cacheKey}` : service;
  }

  private getServiceParams(
    params: TjkServiceParams | undefined
  ): Partial<Record<string, string | number>> | undefined {
    if (params) {
      const newParams: Record<string, string | number> = {};

      if (params.date) {
        newParams.date = getFormatedDate(params.date);
      }

      if (params.checksum) {
        newParams.checksum = params.checksum;
      }

      if (params.hippodrome) {
        newParams.hipodromkey = params.hippodrome;

        if (params.runNumber) {
          newParams.no = params.runNumber;
        }
      }

      return newParams;
    }

    return undefined;
  }
}

export default TjkApi;
