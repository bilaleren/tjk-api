export declare namespace TjkJockeyChanges {
  export interface Race {
    key: string;
    hippodrome: string;
    location: string;
    date: string;
    changes: Change[];
  }

  export interface Change {
    runNumber: number;
    horseNumber: number;
    newJockeyName: string;
    oldJockeyName: string;
  }
}
