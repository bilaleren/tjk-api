import type {
  RaceRunway,
  BestGrade,
  Jockey,
  Person,
  HorseAgf,
  HorseOrigin,
  TjkRaceWeather
} from './tjk';

export declare namespace TjkDetailedProgram {
  export interface Race {
    id: string;
    key: string;
    hippodrome: string;
    location: string;
    date: string;
    abroad: boolean;
    openingTime: string;
    closingTime: string;
    runway: RaceRunway;
    weather: RaceWeather;
    runs: Run[];
    bettingUnitPrices: Record<string, number> | undefined;
  }

  export interface Run {
    id: string | undefined;
    no: number;
    startTime: string;
    info: string;
    runway: RunRunway;
    timing800: string | undefined;
    currencyUnit: string;
    genderName: string | undefined;
    groupName: string;
    groupShortName: string | undefined;
    shortedName: string | undefined;
    condition: string;
    runName: string | undefined;
    specialName: string | undefined;
    bestGrade: BestGrade | undefined;
    bets: RunBet[];
    betResults: RunBetResult[];
    awards: number[];
    bonuses: number[];
    videoUrl: string | undefined;
    photoFinishUrl: string | undefined;
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
    resultRank: number | undefined;
    timing: string | undefined;
    odds: number | undefined;
    weight: number | undefined;
    extraWeight: number | undefined;
    last6: string | undefined;
    last20: string | undefined;
    equipments: string | undefined;
    handicap: number | undefined;
    daysOff: string | undefined;
    salePrice: string | undefined;
    lateStart: string | undefined;
    difference: string | undefined;
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
    gallopVideoUrl: string | undefined;
  }

  export interface RunBet {
    code: string;
    name: string;
    order: number;
    distributionAmount: number;
  }

  export interface RunRunway {
    code: string;
    name: string;
    distance: number;
  }

  export interface RunBetResult {
    code: string;
    name: string;
    order: number;
    amount: number;
    result: string | undefined;
    description: string | undefined;
    rolloverAmount: number;
  }

  export interface RaceWeather extends TjkRaceWeather {
    code: string;
    description: string | undefined;
  }
}
