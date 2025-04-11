# TJK API

[![License MIT](https://img.shields.io/badge/licence-MIT-blue.svg)](https://github.com/bilaleren/tjk-api/blob/master/LICENCE)
[![NPM](https://img.shields.io/npm/v/tjk-api.svg)](https://www.npmjs.com/package/tjk-api)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm downloads](https://img.shields.io/npm/dt/tjk-api.svg)](#kurulum)

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
