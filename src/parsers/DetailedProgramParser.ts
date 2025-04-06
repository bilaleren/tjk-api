import Parser from './Parser';
import { isDefined, isPlainObject, parseNumber } from '../utils';
import {
  PHOTO_CDN,
  VIDEO_CDN,
  GALLOP_VIDEO_CDN,
  LOCAL_HIPPODROMES
} from '../constants';
import type {
  RaceRunway,
  RaceRunwayVariant,
  TjkDetailedProgram
} from '../types';

class DetailedProgramParser extends Parser<TjkDetailedProgram.Race[]> {
  parse(hippodromes: unknown): TjkDetailedProgram.Race[] {
    if (!isPlainObject(hippodromes)) {
      return [];
    }

    const races = Object.values(hippodromes);

    return races.map<TjkDetailedProgram.Race>((race) => {
      const {
        HIPODROMKODU: id,
        KEY: key,
        HIPODROMADI: hippodrome,
        HIPODROMYERI: location,
        KOSUTARIHI: raceDate = '',
        KOSUSAATI: openingTime,
        emiRuns = {},
        poolunits: bettingUnitPrices
      } = race;

      const date = raceDate.split('/').reverse().join('-');
      const abroad = !LOCAL_HIPPODROMES.includes(key);
      const runs = this.parseRuns(
        Object.values(emiRuns as Record<string, any>),
        new Date(date)
      );

      return {
        id: '' + id,
        key,
        hippodrome,
        location,
        date,
        abroad,
        openingTime: openingTime || '00:00',
        closingTime: runs[runs.length - 1]?.startTime || '00:00',
        runway: this.parseRunway(race),
        weather: this.parseWeather(race),
        runs,
        bettingUnitPrices
      };
    });
  }

  private parseRuns(runs: any[], raceDate: Date): TjkDetailedProgram.Run[] {
    return runs.map<TjkDetailedProgram.Run>((run) => {
      const {
        KOSUKODU: _runId,
        KOSUNO: no,
        KOSUSAATI: startTime,
        BILGI: info,
        PISTKODU: runwayCode,
        PISTUZUNADI: runwayName,
        MESAFE: runwayDistance,
        SON800: timing800,
        DOVIZKODU: currencyUnit,
        CINSIYETADI: genderName,
        GRUPADI: groupName,
        GRUPKISAADI: groupShortName,
        KISALTMAKODU: shortedName,
        KOSUCINSDETAYADI: condition,
        ONEMLIKOSUADI: runName,
        OZELKOSUTANIMI: specialName,
        VIDEO: videoFilename,
        FOTOFINISH: photoFinisFilename,
        emiBets: bets = [],
        emiBetResults: betResults = [],
        emiRunners = {}
      } = run;

      const runId = this.isId(_runId) ? _runId : undefined;
      const horses = this.parseHorses(
        Object.values(emiRunners),
        runId,
        raceDate
      );

      return {
        id: runId,
        no: +no,
        startTime,
        info,
        runway: {
          code: runwayCode,
          name: runwayName,
          distance: +runwayDistance
        },
        timing800: timing800 || undefined,
        currencyUnit,
        genderName: genderName || undefined,
        groupName,
        groupShortName: groupShortName || undefined,
        shortedName: shortedName || undefined,
        condition,
        runName: runName || undefined,
        specialName: specialName || undefined,
        bestGrade: this.parseBestGrade(run),
        bets: this.parseBets(bets),
        betResults: this.parseBetResults(betResults),
        horses,
        awards: this.parseAwardsOrBonuses(run, 'IKRAMIYE'),
        bonuses: this.parseAwardsOrBonuses(run, 'YPRIM'),
        videoUrl: videoFilename
          ? `${VIDEO_CDN}/${raceDate.getFullYear()}/${raceDate.getMonth() + 1}/${videoFilename}`
          : undefined,
        photoFinishUrl: photoFinisFilename
          ? `${PHOTO_CDN}/${raceDate.getFullYear()}/${photoFinisFilename}`
          : undefined
      };
    });
  }

  private parseHorses(
    horses: any[],
    runId: string | undefined,
    raceDate: Date
  ): TjkDetailedProgram.Horse[] {
    return horses.map<TjkDetailedProgram.Horse>((horse) => {
      const {
        ATKODU: _horseId,
        KEY: key,
        ATNO: no,
        ATADI: name,
        YAS: age,
        FOAL: foal,
        STARTNO: position,
        SONUCNO: resultRank,
        DERECE: timing,
        GANYAN: odds,
        KILO: weight,
        FAZLAKILO: extraWeight,
        SON6KOSUDETAY: last6,
        KALANKOSUSAYISI: last20,
        emiFlagsStr: equipments,
        HANDIKAP: handicap,
        KGS: daysOff,
        SATISBEDELI: salePrice,
        GECCIKIS_BOY: lateStart,
        FARK: difference,
        EKURIFLG: stablemate,
        APRANTIFLG: apprentice,
        KOSMAZFLG: outOfRace,
        DOGUMTARIHI: dateOfBirth,
        JOKEYKODU: jockeyId,
        SAHIPKODU: ownerId,
        ANTRENORKODU: trainerId,
        BABAKODU: fatherId,
        ANNEKODU: motherId,
        ANNEBABAKODU: motherFatherId,
        ANNEANNEKODU: motherMotherId,
        BABABABAKODU: fatherFatherId,
        BABAANNEKODU: fatherMotherId,
        JOKEYUZUNADI: jockeyName,
        SAHIPUZUNADI: ownerName = '',
        ANTRENORUZUNADI: trainerName = '',
        YETISTIRICIUZUNADI: growerName,
        BABA: fatherName = '',
        ANNE: motherName = '',
        ANNEBABA: motherFatherName,
        ANNEANNE: motherMotherName,
        BABABABA: fatherFatherName,
        BABAANNE: fatherMotherName,
        IDMANVIDEO: gallopVideo
      } = horse;

      const horseId = this.isId(_horseId) ? _horseId : undefined;

      return {
        id: horseId,
        key,
        no: +no,
        name,
        age,
        agf1: this.parseHorseAgf(horse, 1, 'AGFORAN', 'AGFSIRANO'),
        agf2: this.parseHorseAgf(horse, 2, 'AGFORAN', 'AGFSIRANO'),
        foal: foal || undefined,
        position: +position,
        resultRank: resultRank && resultRank !== '0' ? +resultRank : undefined,
        timing: timing || undefined,
        odds: odds ? parseNumber(odds, 0) : undefined,
        weight: isDefined(weight) ? parseNumber(weight, 0) : undefined,
        extraWeight: isDefined(extraWeight)
          ? parseNumber(extraWeight, 0)
          : undefined,
        last6: last6 || undefined,
        last20: last20 || undefined,
        equipments: equipments || undefined,
        handicap: handicap ? +handicap : undefined,
        daysOff: daysOff || undefined,
        salePrice:
          salePrice && typeof salePrice === 'string' ? salePrice : undefined,
        lateStart: lateStart || undefined,
        difference: difference || undefined,
        bestGrade: this.parseBestGrade(horse),
        stablemate: stablemate && stablemate !== '0' ? stablemate : undefined,
        outOfRace: outOfRace === true || outOfRace === '-1' ? true : undefined,
        dateOfBirth: dateOfBirth || undefined,
        jockey: {
          id: this.isId(jockeyId) ? jockeyId : undefined,
          name: jockeyName,
          apprentice:
            apprentice === true || apprentice === '-1' ? true : undefined
        },
        owner: ownerName
          ? {
              id: this.isId(ownerId) ? ownerId : undefined,
              name: ownerName
            }
          : undefined,
        trainer: trainerName
          ? {
              id: this.isId(trainerId) ? trainerId : undefined,
              name: trainerName
            }
          : undefined,
        grower: growerName ? { name: growerName } : undefined,
        father: {
          id: this.isId(fatherId) ? fatherId : undefined,
          name: fatherName
        },
        mother: {
          id: this.isId(motherId) ? motherId : undefined,
          name: motherName
        },
        motherOfFather: motherFatherName
          ? {
              id: this.isId(motherFatherId) ? motherFatherId : undefined,
              name: motherFatherName
            }
          : undefined,
        motherOfMother: motherMotherName
          ? {
              id: this.isId(motherMotherId) ? motherMotherId : undefined,
              name: motherMotherName
            }
          : undefined,
        fatherOfFather: fatherFatherName
          ? {
              id: this.isId(fatherFatherId) ? fatherFatherId : undefined,
              name: fatherFatherName
            }
          : undefined,
        fatherOfMother: fatherMotherName
          ? {
              id: this.isId(fatherMotherId) ? fatherMotherId : undefined,
              name: fatherMotherName
            }
          : undefined,
        gallopVideoUrl:
          horseId && runId && gallopVideo
            ? `${GALLOP_VIDEO_CDN}/${raceDate.getFullYear()}/${raceDate.getMonth() + 1}/${runId}-${horseId}.mp4`
            : undefined
      };
    });
  }

  private parseBets(bets: any[]): TjkDetailedProgram.RunBet[] {
    return bets.map<TjkDetailedProgram.RunBet>((bet) => {
      const {
        BAHISTIPKODU: code,
        BAHISTIPADI: name,
        BAHISSIRA: order,
        TEVZI: distributionAmount
      } = bet;

      return {
        code,
        name,
        order: +order,
        distributionAmount
      };
    });
  }

  private parseBetResults(
    betResults: any[]
  ): TjkDetailedProgram.RunBetResult[] {
    return betResults.map<TjkDetailedProgram.RunBetResult>((bet) => {
      const {
        BAHISTIPKODU: code,
        BAHISTIPADI: name,
        BAHISSIRA: order,
        TUTAR: amount,
        SONUC: result,
        ACIKLAMA: description,
        DEVREDENTUTAR: rolloverAmount
      } = bet;

      return {
        code: '' + code,
        name,
        amount,
        order: +order,
        result: result || undefined,
        description: description || undefined,
        rolloverAmount
      };
    });
  }

  private parseAwardsOrBonuses(run: any, keyPrefix: string): number[] {
    const values: number[] = [];
    const loopCount = run.BESINCIIKRAMIYEALIRFLG ? 5 : 4;

    for (let i = 1; i <= loopCount; i++) {
      const value = run[keyPrefix + i];

      if (value && typeof value === 'string') {
        values.push(parseNumber(value));
      } else {
        values.push(0);
      }
    }

    return values;
  }

  private parseRunwayVariant(race: any, prefix: string): RaceRunwayVariant {
    return {
      status: race[prefix] || undefined,
      weight: race[prefix + 'PISTAGIRLIGI'] || 0
    };
  }

  protected parseRunway(value: any): RaceRunway {
    return {
      grass: this.parseRunwayVariant(value, 'CIM'),
      sand: this.parseRunwayVariant(value, 'KUM')
    };
  }

  protected parseWeather(value: any): TjkDetailedProgram.RaceWeather {
    const {
      HAVADURUMKODU: code,
      HAVA: status,
      NEM: moisture,
      SICAKLIK: temperature,
      HAVAACIKLAMA: description
    } = value;

    return {
      code,
      status: status || undefined,
      moisture,
      temperature,
      description: description || undefined
    };
  }
}

export default DetailedProgramParser;
