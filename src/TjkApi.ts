import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios';
import {
  Transformer,
  AgfTransformer,
  ResultsTransformer,
  ProgramTransformer,
  ProbablesTransformer,
  BetProgramTransformer,
  HorseDetailTransformer,
  JockeyChangesTransformer,
  DetailedProgramTransformer
} from './transformers';
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

export interface TjkApiConstructorOptions {
  authKey: string;
  baseURL?: string;
  axiosDefaults?: CreateAxiosDefaults;
  agfTransformer?: Transformer<TjkAgf.Race[]>;
  programTransformer?: Transformer<TjkProgram.Race[]>;
  resultsTransformer?: Transformer<TjkResults.Race[]>;
  betProgramTransformer?: Transformer<TjkBetProgram.Race[]>;
  probablesTransformer?: Transformer<TjkProbables.Race[]>;
  horseDetailTransformer?: Transformer<TjkHorseDetail.Horse>;
  jockeyChangesTransformer?: Transformer<TjkJockeyChanges.Race[]>;
  detailedProgramTransformer?: Transformer<TjkDetailedProgram.Race[]>;
}

class TjkApi {
  readonly client!: AxiosInstance;

  private readonly agfTransformer!: Transformer<TjkAgf.Race[]>;

  private readonly programTransformer!: Transformer<TjkProgram.Race[]>;

  private readonly resultsTransformer!: Transformer<TjkResults.Race[]>;

  private readonly betProgramTransformer!: Transformer<TjkBetProgram.Race[]>;

  private readonly probablesTransformer!: Transformer<TjkProbables.Race[]>;

  private readonly horseDetailTransformer!: Transformer<TjkHorseDetail.Horse>;

  private readonly jockeyChangesTransformer!: Transformer<
    TjkJockeyChanges.Race[]
  >;

  private readonly detailedProgramTransformer!: Transformer<
    TjkDetailedProgram.Race[]
  >;

  constructor(options: TjkApiConstructorOptions) {
    const {
      authKey,
      baseURL,
      axiosDefaults,
      agfTransformer = AgfTransformer.create(),
      programTransformer = ProgramTransformer.create(),
      resultsTransformer = ResultsTransformer.create(),
      betProgramTransformer = BetProgramTransformer.create(),
      probablesTransformer = ProbablesTransformer.create(),
      horseDetailTransformer = HorseDetailTransformer.create(),
      jockeyChangesTransformer = JockeyChangesTransformer.create(),
      detailedProgramTransformer = DetailedProgramTransformer.create()
    } = options;

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

    this.agfTransformer = agfTransformer;
    this.programTransformer = programTransformer;
    this.resultsTransformer = resultsTransformer;
    this.betProgramTransformer = betProgramTransformer;
    this.probablesTransformer = probablesTransformer;
    this.horseDetailTransformer = horseDetailTransformer;
    this.jockeyChangesTransformer = jockeyChangesTransformer;
    this.detailedProgramTransformer = detailedProgramTransformer;
  }

  async getProgram(
    params?: TjkServiceParams
  ): Promise<TjkResponse<TjkProgram.Race[]>> {
    const {
      data,
      checksum,
      updatetime: updateTime
    } = await this.getServiceResponse(
      TjkServices.PROGRAM,
      this.getServiceParams(params)
    );

    return {
      data: this.programTransformer.transform(data?.yarislar),
      checksum,
      updateTime
    };
  }

  async getResults(
    params?: TjkServiceParams
  ): Promise<TjkResponse<TjkResults.Race[]>> {
    const {
      data,
      checksum,
      updatetime: updateTime
    } = await this.getServiceResponse(
      TjkServices.RESULTS,
      this.getServiceParams(params)
    );

    return {
      data: this.resultsTransformer.transform(data?.yarislar),
      checksum,
      updateTime
    };
  }

  async getBetProgram(
    params?: TjkBetProgramServiceParams
  ): Promise<TjkResponse<TjkBetProgram.Race[]>> {
    const {
      data,
      checksum,
      updatetime: updateTime
    } = await this.getServiceResponse(TjkServices.BET_PROGRAM, params);

    return {
      data: this.betProgramTransformer.transform(data?.yarislar),
      checksum,
      updateTime
    };
  }

  async getAgf(params?: TjkServiceParams): Promise<TjkResponse<TjkAgf.Race[]>> {
    const {
      data,
      checksum,
      updatetime: updateTime
    } = await this.getServiceResponse(
      TjkServices.AGF,
      this.getServiceParams(params)
    );

    return {
      data: this.agfTransformer.transform(data?.yarislar),
      checksum,
      updateTime
    };
  }

  async getProbables(
    params?: TjkProbablesServiceParams
  ): Promise<TjkResponse<TjkProbables.Race[]>> {
    const {
      data,
      checksum,
      updatetime: updateTime
    } = await this.getServiceResponse(
      params?.full ? TjkServices.PROBABLES_FULL : TjkServices.PROBABLES,
      this.getServiceParams(params)
    );

    return {
      data: this.probablesTransformer.transform(data?.yarislar),
      checksum,
      updateTime
    };
  }

  async getDetailedProgram(
    params?: TjkDetailedProgramServiceParams
  ): Promise<TjkResponse<TjkDetailedProgram.Race[]>> {
    const {
      data,
      checksum,
      updatetime: updateTime
    } = await this.getServiceResponse(
      TjkServices.DETAILED_PROGRAM,
      this.getServiceParams(params)
    );

    return {
      data: this.detailedProgramTransformer.transform(data?.hippodromes),
      checksum,
      updateTime
    };
  }

  async getHippodromes(
    params?: TjkHippodromesServiceParams
  ): Promise<TjkResponse<Hippodrome[]>> {
    const {
      data,
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
      checksum,
      updateTime
    };
  }

  async getHorseDetail(
    params: TjkHorseDetailServiceParams
  ): Promise<TjkResponse<TjkHorseDetail.Horse>> {
    const {
      data,
      checksum,
      updatetime: updateTime
    } = await this.getServiceResponse(
      TjkServices.HORSE_DETAIL,
      'id' in params
        ? { atkodu: params.id, checksum: params.checksum }
        : { atkey: params.key, checksum: params.checksum }
    );

    return {
      data: this.horseDetailTransformer.transform(data.at),
      checksum,
      updateTime
    };
  }

  async getJockeyChanges(
    params?: TjkJockeyChangesServiceParams
  ): Promise<TjkResponse<TjkJockeyChanges.Race[]>> {
    const {
      data,
      checksum,
      updatetime: updateTime
    } = await this.getServiceResponse(
      TjkServices.JOCKEY_CHANGES,
      this.getServiceParams(params)
    );

    return {
      data: this.jockeyChangesTransformer.transform(data?.yarislar),
      checksum,
      updateTime
    };
  }

  private async getServiceResponse(
    service: TjkServices,
    params: Record<string, any> | undefined
  ): Promise<TjkSuccessResponse> {
    const { data } = await this.client.get<
      TjkServiceResponse | null | undefined
    >(`/${service}`, {
      params
    });

    if (!isPlainObject(data)) {
      throw new TjkTypeError('Invalid TJK api response.');
    } else if (!data.success) {
      throw new TjkApiError(data);
    }

    return data;
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
