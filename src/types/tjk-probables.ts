export declare namespace TjkProbables {
  export interface Race {
    key: string;
    hippodrome: string;
    location: string;
    date: string | undefined;
    runs: Run[];
  }

  export interface Run {
    no: number;
    startTime: string;
    status: string;
    lastUpdateTime: string | undefined;
    bets: Bet[];
  }

  export interface Bet {
    name: string;
    status: string;
    probables: Probable[];
  }

  export interface Probable {
    horseName: string | undefined;
    odds: string | undefined;
    runners: number[];
    stablemate: string | undefined;
    agf: boolean | undefined;
    outOfRace: boolean | undefined;
  }
}
