export declare namespace TjkAgf {
  export interface Race {
    key: string;
    hippodrome: string;
    location: string;
    date: string;
    bets: Bet[];
  }

  export interface Bet {
    name: string;
    official: boolean;
    lastUpdateTime: string;
    runs: Run[];
  }

  export interface Run {
    no: number;
    horses: Horse[];
  }

  export interface Horse {
    no: number;
    name: string;
    jockeyName: string;
    rank: number;
    rate: number;
    outOfRace: boolean | undefined;
    stablemate: string | undefined;
    stablemateRate: number | undefined;
  }
}
