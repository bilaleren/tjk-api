import Parser from './Parser';
import { isDefined, parseNumber } from '../utils';
import type { TjkProgram } from '../types';

class ProgramParser extends Parser<TjkProgram.Race[]> {
  parse(races: unknown): TjkProgram.Race[] {
    if (!Array.isArray(races)) {
      return [];
    }

    return races.map<TjkProgram.Race>((race) => {
      const {
        KEY: key,
        YER: location,
        TARIH: raceDate = '',
        HIPODROM: hippodrome,
        ACILIS: openingTime,
        KAPANIS: closingTime,
        YURTDISI: abroad = false,
        GECE: isNight = false,
        hava: weather,
        pist: runway,
        kosular: runs = []
      } = race;

      return {
        key,
        date: raceDate.split('/').reverse().join('-'),
        location,
        hippodrome,
        openingTime,
        closingTime,
        abroad,
        isNight,
        runway: this.parseRunway(runway),
        weather: this.parseWeather(weather),
        runs: this.parseRuns(runs)
      };
    });
  }

  private parseRuns(runs: any[]): TjkProgram.Run[] {
    return runs.map<TjkProgram.Run>((run) => {
      const {
        NO: no,
        SAAT: startTime,
        PIST: runwayName,
        MESAFE: runwayDistance,
        KISALTMA: shortedName,
        GRUP: groupName,
        GRUPKISA: groupShortName,
        CINSDETAY: condition,
        ONEMLIADI: runName,
        CINSIYET: genderName,
        OZELADI: specialName,
        ikramiyeler: awards = [],
        primler: bonuses = [],
        DOVIZ: currencyUnit,
        BILGI: info,
        BAHISLER: betInfo,
        atlar: horses = []
      } = run;

      return {
        no: +no,
        startTime,
        runway: {
          name: runwayName,
          distance: +runwayDistance
        },
        shortedName: shortedName || undefined,
        groupName,
        groupShortName: groupShortName || undefined,
        condition,
        runName: runName || undefined,
        genderName: genderName || undefined,
        specialName: specialName || undefined,
        awards: awards.map((value: any) => parseNumber(value, 0)),
        bonuses: bonuses.map((value: any) => parseNumber(value, 0)),
        currencyUnit,
        info,
        betInfo,
        horses: this.parseHorses(horses)
      };
    });
  }

  private parseHorses(horses: any[]): TjkProgram.Horse[] {
    return horses.map<TjkProgram.Horse>((horse) => {
      const {
        KEY: key,
        NO: no,
        AD: name,
        YAS: age,
        FOAL: foal,
        START: position,
        GANYAN: odds,
        KILO: weight,
        FAZLAKILO: extraWeight,
        KILOINDIRIM: missingWeight,
        SON6: last6,
        SON20: last20,
        TAKI: equipments,
        HANDIKAP: handicap,
        KGS: daysOff,
        EKURI: stablemate,
        APRANTI: apprentice,
        KOSMAZ: outOfRace,
        DOGUMTARIHI: dateOfBirth,
        JOKEYADI: jockeyName,
        SAHIPADI: ownerName = '',
        ANTRENORADI: trainerName = '',
        YETISTIRICIADI: growerName,
        BABA: fatherName = '',
        ANNE: motherName = '',
        ANNEBABA: motherFatherName,
        ANNEANNE: motherMotherName,
        BABABABA: fatherFatherName,
        BABAANNE: fatherMotherName,
        FORMA: uniformImageUrl
      } = horse;

      return {
        key,
        no: +no,
        name,
        age,
        agf1: this.parseHorseAgf(horse, 1),
        agf2: this.parseHorseAgf(horse, 2),
        foal: foal || undefined,
        position: +position,
        odds: odds ? parseNumber(odds, 0) : undefined,
        weight: isDefined(weight) ? +weight : undefined,
        extraWeight: isDefined(extraWeight) ? +extraWeight : undefined,
        missingWeight: isDefined(missingWeight) ? +missingWeight : undefined,
        last6: last6 || undefined,
        last20: last20 || undefined,
        equipments: equipments || undefined,
        handicap: handicap ? parseNumber(handicap, 0) : undefined,
        daysOff: daysOff || undefined,
        bestGrade: this.parseBestGrade(horse),
        stablemate: stablemate || undefined,
        outOfRace: outOfRace || undefined,
        dateOfBirth: dateOfBirth || undefined,
        jockey: {
          name: jockeyName,
          apprentice: apprentice || undefined
        },
        owner: ownerName
          ? {
              name: ownerName
            }
          : undefined,
        trainer: trainerName
          ? {
              name: trainerName
            }
          : undefined,
        grower: growerName ? { name: growerName } : undefined,
        father: {
          name: fatherName
        },
        mother: {
          name: motherName
        },
        motherOfFather: motherFatherName
          ? { name: motherFatherName }
          : undefined,
        motherOfMother: motherMotherName
          ? { name: motherMotherName }
          : undefined,
        fatherOfFather: fatherFatherName
          ? { name: fatherFatherName }
          : undefined,
        fatherOfMother: fatherMotherName
          ? { name: fatherMotherName }
          : undefined,
        uniformImageUrl:
          typeof uniformImageUrl === 'string'
            ? uniformImageUrl.replace(
                /^https?:\/\/medya\.tjk\.org/,
                'https://medya-cdn.tjk.org'
              )
            : undefined
      };
    });
  }
}

export default ProgramParser;
