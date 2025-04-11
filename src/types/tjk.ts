export interface TjkResponse<TData> {
  data: TData;
  checksum: string;
  updateTime: number;
}

export interface TjkSuccessResponse {
  success: true;
  data?: any;
  stale?: boolean;
  checksum: string;
  updatetime: number;
}

export interface TjkFailResponse {
  success: false;
  errorCode: number;
  message: string;
}

export type TjkServiceResponse = TjkSuccessResponse | TjkFailResponse;

export interface Hippodrome {
  key: string;
  name: string;
  location: string;
  abroad: boolean;
}

export interface Person {
  id?: string;
  name: string;
}

export interface Jockey extends Person {
  apprentice?: boolean;
}

export interface HorseAgf {
  rank: number;
  rate: number;
}

export interface HorseOrigin {
  id?: string;
  name: string;
}

export interface BestGrade {
  timing: string;
  description: string;
  anotherHippodrome: boolean;
}

export interface RaceWeather {
  status?: string;
  moisture: number;
  temperature: number;
}

export type TjkRaceWeather = RaceWeather;

export interface RaceRunway {
  grass: RaceRunwayVariant;
  sand: RaceRunwayVariant;
}

export interface RaceRunwayVariant {
  status?: string;
  weight: number;
}
