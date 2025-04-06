export namespace TjkHorseDetail {
  export interface Horse {
    key: string;
    name: string;
    age: string;
    gender: string;
    origin: string;
    father: HorseOrigin | undefined;
    mother: HorseOrigin | undefined;
    isDied: boolean;
    dateOfBirth: string;
    dateOfDeath: string | undefined;
    handicap: number | undefined;
    totalEarnings: number;
    growerTotalEarnings: number;
    sponsorEarnings: number;
    abroadEarnings: number;
    ownerName: string;
    growerName: string | undefined;
    trainerName: string;
    trainer: TjkHorseDetail.Person;
    owners: TjkHorseDetail.Person[];
    growers: TjkHorseDetail.Person[];
    runs: TjkHorseDetail.Run[];
  }

  export interface Run {
    no: number;
    date: string;
    location: string;
    runway: Runway;
    groupName: string;
    groupShortName: string;
    condition: string;
    weight: number;
    result: number | undefined;
    odds: number | undefined;
    handicap: number | undefined;
    grade: string | undefined;
    last20: string | undefined;
    earnings: number;
    equipments: string | undefined;
    outOfRace: boolean | undefined;
    jockey: Person | undefined;
    trainer: Person | undefined;
    owner: Person | undefined;
    videoUrl: string | undefined;
    photoFinishUrl: string | undefined;
  }

  export interface Runway {
    id: string;
    name: string;
    status: string | undefined;
    distance: number;
  }

  export interface Person {
    key: string | undefined;
    name: string;
    rate?: string | undefined;
  }

  export interface HorseOrigin {
    key: string | undefined;
    name: string;
    dateOfBirth: string | undefined;
    father: HorseOrigin | undefined;
    mother: HorseOrigin | undefined;
  }
}
