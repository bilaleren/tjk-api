import Transformer from './Transformer';
import { parseNumber } from '../utils';
import type { TjkHorseDetail } from '../types';

class HorseDetailTransformer extends Transformer<TjkHorseDetail.Horse> {
  static create(): HorseDetailTransformer {
    return new HorseDetailTransformer();
  }

  transform(horse: any): TjkHorseDetail.Horse {
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
      father: this.transformOrigin(father),
      mother: this.transformOrigin(mother),
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
      owners: this.transformPersons(owners, 'SAHIPADI'),
      growers: this.transformPersons(growers, 'YETISTIRICIADI'),
      runs: this.transformRuns(runs)
    };
  }

  protected transformRuns(runs: any[]): TjkHorseDetail.Run[] {
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

      const runway = this.transformRunRunway(run);
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
        jockey: this.transformRunPerson(jockey),
        trainer: this.transformRunPerson(trainer),
        owner: this.transformRunPerson(owner),
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

  protected transformRunRunway(run: any): TjkHorseDetail.Runway {
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

  protected transformRunPerson(person: any): TjkHorseDetail.Person | undefined {
    const { KEY: key, AD: name } = person;

    if (!name) {
      return undefined;
    }

    return {
      key: key || undefined,
      name
    };
  }

  protected transformOrigin(
    value: any
  ): TjkHorseDetail.HorseOrigin | undefined {
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
      father: father ? this.transformOrigin(father) : undefined,
      mother: mother ? this.transformOrigin(mother) : undefined
    };
  }

  protected transformPersons(
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

export default HorseDetailTransformer;
