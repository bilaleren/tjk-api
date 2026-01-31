import Transformer from './Transformer';
import { isDefined, parseNumber } from '../utils';
import { GALLOP_VIDEO_CDN, LOCAL_HIPPODROMES } from '../constants';
import { TjkBetProgram } from '../types';

class BetProgramTransformer extends Transformer<TjkBetProgram.Race[]> {
  static create(): BetProgramTransformer {
    return new BetProgramTransformer();
  }

  transform(races: unknown): TjkBetProgram.Race[] {
    if (!Array.isArray(races)) {
      return [];
    }

    return races.map<TjkBetProgram.Race>((race) => {
      const {
        KOD: id,
        CARDID: cardId,
        KEY: key,
        YER: location,
        TARIH: raceDate = '',
        HIPODROM: hippodrome,
        ACILIS: openingTime,
        KAPANIS: closingTime,
        SIRA: order,
        YURTDISI: abroad,
        GECE: isNight = false,
        hava: weather,
        pist: runway,
        kosular: runs = [],
        bahisler: bets = [],
        fixedbets: fixedBets
      } = race;

      const date = raceDate.split('/').reverse().join('-');

      return {
        id,
        cardId,
        key,
        date,
        location,
        hippodrome,
        openingTime,
        closingTime,
        order: order ? +order : undefined,
        abroad: abroad || !LOCAL_HIPPODROMES.includes(key),
        isNight,
        runway: this.transformRunway(runway),
        weather: this.transformWeather(weather),
        runs: this.transformRuns(runs, new Date(date)),
        bets: this.transformBets(bets),
        fixedBets
      };
    });
  }

  protected transformRuns(runs: any[], raceDate: Date): TjkBetProgram.Run[] {
    return runs.map<TjkBetProgram.Run>((run) => {
      const {
        KOD: _runId,
        NO: no,
        SAAT: startTime,
        PISTKODU: runwayCode,
        PIST: runwayName,
        MESAFE: runwayDistance,
        KISALTMA: shortedName,
        GRUP: groupName,
        GRUPKISA: groupShortName,
        CINSDETAY: condition,
        CINSIYET: gender,
        ONEMLIADI: runName,
        OZELADI: specialName,
        ikramiyeler: awards = [],
        primler: bonuses = [],
        DOVIZ: currencyUnit,
        BILGI: info,
        atlar: horses = []
      } = run;

      const runId = this.isId(_runId) ? _runId : undefined;

      return {
        id: runId,
        no: +no,
        startTime,
        runway: {
          code: runwayCode,
          name: runwayName,
          distance: +runwayDistance
        },
        shortedName: shortedName || undefined,
        groupName,
        groupShortName: groupShortName || undefined,
        condition,
        gender: gender || undefined,
        runName: runName || undefined,
        specialName: specialName || undefined,
        awards: awards.map((value: any) => parseNumber(value, 0)),
        bonuses: bonuses.map((value: any) => parseNumber(value, 0)),
        currencyUnit,
        info,
        horses: this.transformHorses(horses, runId, raceDate)
      };
    });
  }

  protected transformBets(bets: any[]): TjkBetProgram.RaceBet[] {
    return bets.map<TjkBetProgram.RaceBet>((bet) => {
      const { TYPE: id, BAHIS: name, POOLUNIT: unitPrice, kosular: runs } = bet;

      return {
        id,
        name,
        unitPrice,
        runs
      };
    });
  }

  protected transformHorses(
    horses: any[],
    runId: string | undefined,
    raceDate: Date
  ): TjkBetProgram.Horse[] {
    return horses.map<TjkBetProgram.Horse>((horse: any) => {
      const {
        KOD: _horseId,
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
        JOKEYKODU: jockeyId,
        SAHIPKODU: ownerId,
        ANTRENORKODU: trainerId,
        BABAKODU: fatherId,
        ANNEKODU: motherId,
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
        FORMA: uniformImageUrl,
        IDMANVIDEO: gallopVideo
      } = horse;

      const horseId = this.isId(_horseId) ? _horseId : undefined;

      return {
        id: horseId,
        key,
        no: +no,
        name,
        age,
        agf1: this.transformHorseAgf(horse, 1),
        agf2: this.transformHorseAgf(horse, 2),
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
        bestGrade: this.transformBestGrade(horse),
        stablemate: stablemate || undefined,
        outOfRace: outOfRace || undefined,
        dateOfBirth: dateOfBirth || undefined,
        jockey: {
          id: this.isId(jockeyId) ? jockeyId : undefined,
          name: jockeyName,
          apprentice: apprentice || undefined
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
        uniformImageUrl: uniformImageUrl || undefined,
        gallopVideoUrl:
          horseId && runId && gallopVideo
            ? `${GALLOP_VIDEO_CDN}/${raceDate.getFullYear()}/${raceDate.getMonth() + 1}/${runId}-${horseId}.mp4`
            : undefined
      };
    });
  }

  protected transformWeather(value: any): TjkBetProgram.RaceWeather {
    const { KOD: code } = value;

    return {
      code,
      ...super.transformWeather(value)
    };
  }
}

export default BetProgramTransformer;
