import type {
  BestGrade,
  Jockey,
  Person,
  HorseAgf,
  HorseOrigin,
  RaceRunway,
  RaceWeather
} from './tjk';

export declare namespace TjkProgram {
  export interface Race {
    key: string;
    date: string;
    location: string;
    hippodrome: string;
    openingTime: string;
    closingTime: string;
    abroad: boolean;
    isNight: boolean;
    runway: RaceRunway;
    weather: RaceWeather;
    runs: Run[];
  }

  export interface Run {
    no: number;
    startTime: string;
    runway: RunRunway;
    shortedName: string | undefined;
    groupName: string;
    groupShortName: string | undefined;
    condition: string;
    runName: string | undefined;
    genderName: string | undefined;
    specialName: string | undefined;
    awards: number[];
    bonuses: number[];
    currencyUnit: string;
    info: string;
    betInfo: string;
    horses: Horse[];
  }

  export interface Horse {
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
  }

  export interface RunRunway {
    name: string;
    distance: number;
  }
}
