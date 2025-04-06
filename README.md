# TJK API

TJK (Türkiye Jokey Kulübü) tarafından sağlanan resmi API kaynağından program, sonuçlar, AGF, muhtemel oranlar ve benzeri verileri çeken bir Node.js paketi.

# Kurulum

```shell
yarn add tjk-api
```

veya

```shell
npm install tjk-api
```

# Kullanım

```typescript
import { TjkApi } from 'tjk-api';

const api = new TjkApi({
  authKey: 'TJK Auth Key'
});

const { data: races } = await api.getProgram();

console.log('races:', races);
```

# Önbelleğe Alma

TJK servisleri, her istek yanıtında bir `checksum` değeri üretir. Bu değer kullanılarak ilgili servisin verisinde herhangi bir değişiklik olup olmadığı kontrol edilebilir.

```typescript
import { TjkApi, type CacheStore, type TjkSuccessResponse } from 'tjk-api';

const store: CacheStore = new Map<string, TjkSuccessResponse>();

const api = new TjkApi({
  authKey: 'TJK Auth Key',
  cache: {
    enabled: true,
    store // Opsiyonel
  }
});

const { data, stale, checksum } = await api.getProgram();

if (stale) {
  console.log('eski veri:', data, 'eski checksum:', checksum);
} else {
  console.log('yeni veri:', data, 'yeni checksum:', checksum);
}
```

# Hata Ayıklama

```typescript
import axios from 'axios';
import { TjkApiError, TjkTypeError } from 'tjk-api';

try {
  const { data } = await tjk.getProgram();
  console.log('program:', data);
} catch (e) {
  if (e instanceof TjkTypeError) {
    console.error('Tjk tür hatası:', e);
  } else if (e instanceof TjkApiError) {
    console.error('Tjk API hatası:', e);
  } else if (axios.isAxiosError(e)) {
    console.error('Axios hatası:', e);
  } else {
    console.error('Bilinmeyen hata:', e);
  }
}
```

# Servisler

#### Yarış Programı Servisi

```typescript
const response = await api.getProgram();
```

#### Yarış Sonuçları Servisi

```typescript
const response = await api.getResults();
```

#### Bahis Programı Servisi

```typescript
const response = await api.getBetProgram();
```

#### AGF Servisi

```typescript
const response = await api.getAgf();
```

#### Muhtemel Oranlar Servisi

```typescript
const response = await api.getProbables();
```

#### Detaylı Program Servisi

```typescript
const response = await api.getDetailedProgram();
```

#### Hipodromlar Servisi

```typescript
const response = await api.getHippodromes();
```

#### At Detay Servisi

```typescript
const response = await api.getHorseDetail({ id: 'at kimliği' } | { key: 'at anahtarı' });
```

#### Jokey Değişiklikleri Servisi

```typescript
const response = await api.getJockeyChanges();
```
