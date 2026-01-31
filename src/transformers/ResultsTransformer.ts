import Transformer from './Transformer';
import { isDefined, parseNumber } from '../utils';
import type { TjkResults } from '../types';

class ResultsTransformer extends Transformer<TjkResults.Race[]> {
  static create(): ResultsTransformer {
    return new ResultsTransformer();
  }

  transform(races: unknown): TjkResults.Race[] {
    if (!Array.isArray(races)) {
      return [];
    }

    return races.map<TjkResults.Race>((race) => {
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
        kosular: raceRuns = []
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
        runway: this.transformRunway(runway),
        weather: this.transformWeather(weather),
        runs: this.transformRuns(raceRuns)
      };
    });
  }

  protected transformRuns(runs: any[]): TjkResults.Run[] {
    return runs.map<TjkResults.Run>((run) => {
      const {
        NO: no,
        SAAT: startTime,
        PIST: runwayName,
        MESAFE: runwayDistance,
        KISALTMA: shortedName,
        GRUP: groupName,
        GRUPKISA: groupShortName,
        CINSDETAY: condition,
        SON800: timing800,
        ONEMLIADI: runName,
        CINSIYET: genderName,
        OZELADI: specialName,
        ikramiyeler: awards = [],
        primler: bonuses = [],
        DOVIZ: currencyUnit,
        BILGI: info,
        bahisler: bets = [],
        VIDEO: videoUrl,
        FOTOFINISH: photoFinishUrl,
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
        timing800: timing800 || undefined,
        runName: runName || undefined,
        genderName: genderName || undefined,
        specialName: specialName || undefined,
        awards: awards.map((value: any) => parseNumber(value, 0)),
        bonuses: bonuses.map((value: any) => parseNumber(value, 0)),
        currencyUnit,
        info,
        bets: this.transformBets(bets),
        videoUrl:
          videoUrl && typeof videoUrl === 'string'
            ? videoUrl.replace('http://', 'https://')
            : undefined,
        photoFinishUrl:
          photoFinishUrl && typeof photoFinishUrl === 'string'
            ? photoFinishUrl.replace('http://', 'https://')
            : undefined,
        horses: this.transformHorses(horses)
      };
    });
  }

  protected transformBets(bets: any[]): TjkResults.RunBet[] {
    return bets.map<TjkResults.RunBet>((bet) => {
      const {
        BAHIS: betName,
        SONUC: result,
        TUTAR: amount,
        ACIKLAMA: description
      } = bet;

      return {
        name: betName,
        result: result || undefined,
        amount: amount ? '' + amount : undefined,
        description: description || undefined
      };
    });
  }

  protected transformHorses(horses: any[]): TjkResults.Horse[] {
    return horses.map<TjkResults.Horse>((horse) => {
      const {
        KEY: key,
        NO: no,
        AD: name,
        YAS: age,
        FOAL: foal,
        START: position,
        SONUC: resultRank,
        DERECE: timing,
        GANYAN: odds,
        KILO: weight,
        FAZLAKILO: extraWeight,
        KILOINDIRIM: missingWeight,
        SON6: last6,
        SON20: last20,
        TAKI: equipments,
        HANDIKAP: handicap,
        KGS: daysOff,
        GECCIKIS: lateStart,
        FARK: difference,
        EKURI: stablemate,
        APRANTI: apprentice,
        KOSMAZ: outOfRace,
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
        agf1: this.transformHorseAgf(horse, 1),
        agf2: this.transformHorseAgf(horse, 2),
        foal: foal || undefined,
        position: +position,
        resultRank:
          typeof resultRank === 'string' && resultRank !== ''
            ? +resultRank
            : undefined,
        timing: timing || undefined,
        odds: odds ? parseNumber(odds, 0) : undefined,
        weight: isDefined(weight) ? +weight : undefined,
        extraWeight: isDefined(extraWeight) ? +extraWeight : undefined,
        missingWeight: isDefined(missingWeight) ? +missingWeight : undefined,
        last6: last6 || undefined,
        last20: last20 || undefined,
        equipments: equipments || undefined,
        handicap: handicap ? parseNumber(handicap, 0) : undefined,
        daysOff: daysOff || undefined,
        lateStart: lateStart || undefined,
        difference: difference || undefined,
        bestGrade: this.transformBestGrade(horse),
        stablemate: stablemate || undefined,
        outOfRace: outOfRace || undefined,
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

export default ResultsTransformer;
