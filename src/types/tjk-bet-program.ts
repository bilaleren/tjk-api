import type {
  BestGrade,
  Person,
  Jockey,
  HorseAgf,
  HorseOrigin,
  RaceRunway,
  TjkRaceWeather
} from './tjk';

export declare namespace TjkBetProgram {
  export interface Race {
    id: string;
    cardId: string;
    key: string;
    date: string;
    location: string;
    hippodrome: string;
    openingTime: string;
    closingTime: string;
    order: number | undefined;
    abroad: boolean;
    isNight: boolean;
    runway: RaceRunway;
    weather: RaceWeather;
    runs: Run[];
    bets: RaceBet[];
    fixedBets:
      | Record<string, Record<string, Record<string, RaceFixedBet>>>
      | undefined;
  }

  export interface Run {
    id: string | undefined;
    no: number;
    startTime: string;
    runway: RunRunway;
    shortedName: string | undefined;
    groupName: string;
    groupShortName: string | undefined;
    condition: string;
    gender: string | undefined;
    runName: string | undefined;
    specialName: string | undefined;
    awards: string[];
    bonuses: string[];
    currencyUnit: string;
    info: string;
    horses: Horse[];
  }

  export interface Horse {
    id: string | undefined;
    key: string;
    no: number;
    name: string;
    age: string;
    agf1: HorseAgf | undefined;
    agf2: HorseAgf | undefined;
    foal: string | undefined;
    position: number;
    odds: number | undefined;
    daysOff: string | undefined;
    weight: number | undefined;
    extraWeight: number | undefined;
    missingWeight: number | undefined;
    last6: string | undefined;
    last20: string | undefined;
    equipments: string | undefined;
    handicap: number | undefined;
    bestGrade: BestGrade | undefined;
    stablemate: string | undefined;
    outOfRace: boolean | undefined;
    dateOfBirth: string | undefined;
    jockey: Jockey;
    owner: Person | undefined;
    trainer: Person | undefined;
    grower: Person | undefined;
    father: HorseOrigin;
    mother: HorseOrigin;
    motherOfFather: HorseOrigin | undefined;
    motherOfMother: HorseOrigin | undefined;
    fatherOfFather: HorseOrigin | undefined;
    fatherOfMother: HorseOrigin | undefined;
    uniformImageUrl: string | undefined;
    gallopVideoUrl: string | undefined;
  }

  export interface RaceBet {
    id: string;
    name: string;
    unitPrice: number;
    runs: number[];
  }

  export interface RunRunway {
    code: string;
    name: string;
    distance: number;
  }

  export interface RaceFixedBet {
    id: string;
    no: number;
    status: string;
    odds: string;
  }

  export interface RaceWeather extends TjkRaceWeather {
    code: string;
  }
}
