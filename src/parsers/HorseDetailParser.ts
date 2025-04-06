import Parser from './Parser';
import { parseNumber } from '../utils';
import type { TjkHorseDetail } from '../types';

class HorseDetailParser extends Parser<TjkHorseDetail.Horse> {
  parse(horse: any): TjkHorseDetail.Horse {
    const {
      KEY: key,
      AD: name,
      YAS: age,
      CINSIYET: gender,
      IRK: origin,
      baba: father,
      anne: mother,
      OLDU: isDied,
      DOGUMTARIHI: dateOfBirth,
      OLUMTARIHI: dateOfDeath,
      HANDIKAP: handicap,
      KAZANC: totalEarnings,
      YETISTIRICIKAZANCI: growerTotalEarnings,
      SPONSORKAZANCI: sponsorEarnings,
      YURTDISIKAZANCI: abroadEarnings,
      SAHIP: ownerName = '',
      YETISTIRICI: growerName,
      ANTRENOR: trainerName = '',
      antrenor: trainer,
      sahipler: owners = [],
      yetistiriciler: growers = [],
      kosular: runs = []
    } = horse;

    return {
      key,
      name,
      age,
      gender,
      origin,
      father: this.parseOrigin(father),
      mother: this.parseOrigin(mother),
      isDied: isDied || undefined,
      dateOfBirth,
      dateOfDeath: dateOfDeath || undefined,
      handicap: handicap ? +handicap : undefined,
      totalEarnings: parseNumber(totalEarnings, 0),
      growerTotalEarnings: parseNumber(growerTotalEarnings, 0),
      sponsorEarnings: parseNumber(sponsorEarnings, 0),
      abroadEarnings: parseNumber(abroadEarnings, 0),
      ownerName,
      growerName: growerName || undefined,
      trainerName,
      trainer: {
        key: trainer.KEY || undefined,
        name: trainer.AD
      },
      owners: this.parsePersons(owners, 'SAHIPADI'),
      growers: this.parsePersons(growers, 'YETISTIRICIADI'),
      runs: this.parseRuns(runs)
    };
  }

  private parseRuns(runs: any[]): TjkHorseDetail.Run[] {
    return runs.map<TjkHorseDetail.Run>((run) => {
      const {
        KOSU: no,
        TARIH: date = '',
        YER: location,
        GRUP: groupName,
        GRUPKISA: groupShortName,
        CINSDETAY: condition,
        KILO: weight,
        SONUC: result,
        GANYAN: odds,
        DERECE: grade,
        SON20: last20,
        KAZANC: earnings,
        TAKI: equipments,
        KOSMAZ: outOfRace,
        jokey: jockey,
        antrenor: trainer,
        sahip: owner,
        VIDEO: videoUrl,
        FOTOFINISH: photoFinishUrl
      } = run;

      const runway = this.parseRunRunway(run);
      const handicap = run.HANDIKAP
        ? run.HANDIKAP
        : runway.name === 'Kum'
          ? run.HANDIKAP_KUM
          : run.HANDIKAP_CIM;

      return {
        no: no ? +no : 0,
        date: date.split('/').reverse().join('-'),
        location,
        runway,
        groupName,
        groupShortName,
        condition,
        weight,
        result: result ? +result : undefined,
        odds: odds ? parseNumber(odds) : undefined,
        handicap: handicap ? +handicap : undefined,
        grade: grade || undefined,
        last20: last20 || undefined,
        earnings: parseNumber(earnings, 0),
        equipments: equipments || undefined,
        outOfRace: outOfRace || undefined,
        jockey: this.parseRunPerson(jockey),
        trainer: this.parseRunPerson(trainer),
        owner: this.parseRunPerson(owner),
        videoUrl:
          videoUrl && typeof videoUrl === 'string'
            ? videoUrl.replace('http://', 'https://')
            : undefined,
        photoFinishUrl:
          photoFinishUrl && typeof photoFinishUrl === 'string'
            ? photoFinishUrl.replace('http://', 'https://')
            : undefined
      };
    });
  }

  private parseRunRunway(run: any): TjkHorseDetail.Runway {
    const {
      PISTKOD: id,
      PIST: name,
      MESAFE: distance,
      PISTDURUM: status
    } = run;

    return {
      id,
      name,
      status: status || undefined,
      distance: +distance
    };
  }

  private parseRunPerson(person: any): TjkHorseDetail.Person | undefined {
    const { KEY: key, AD: name } = person;

    if (!name) {
      return undefined;
    }

    return {
      key: key || undefined,
      name
    };
  }

  private parseOrigin(value: any): TjkHorseDetail.HorseOrigin | undefined {
    const {
      KEY: key,
      AD: name,
      DOGUMTARIHI: dateOfBirth,
      baba: father,
      anne: mother
    } = value;

    if (!name) {
      return undefined;
    }

    return {
      key: key || undefined,
      name,
      dateOfBirth: dateOfBirth || undefined,
      father: father ? this.parseOrigin(father) : undefined,
      mother: mother ? this.parseOrigin(mother) : undefined
    };
  }

  private parsePersons(
    persons: any[],
    nameKey: string
  ): TjkHorseDetail.Person[] {
    return persons.map<TjkHorseDetail.Person>((person) => {
      const { KEY: key, ORAN: rate } = person;

      return {
        key,
        name: person[nameKey],
        rate
      };
    });
  }
}

export default HorseDetailParser;
