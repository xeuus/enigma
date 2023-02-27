export type DateTuple = [number, number, number];
export type DateObject = Date | number | string | null | undefined;

function isNullOrUndefined(a: unknown) {
  return typeof a === 'undefined' || a === null;
}

export const monthNames = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

const localeData: Record<
  string,
  {
    displayName: string;
    relative: Record<string, string>;
    relativeTime: Record<string, Record<string, string>>;
  }
> = {
  year: {
    displayName: 'سال',
    relative: {
      '0': 'امسال',
      '1': 'سال آینده',
      '-1': 'سال گذشته',
    },
    relativeTime: {
      future: {
        one: '? سال بعد',
        other: '? سال بعد',
      },
      past: {
        one: '? سال پیش',
        other: '? سال پیش',
      },
    },
  },
  month: {
    displayName: 'ماه',
    relative: {
      '0': 'این ماه',
      '1': 'ماه آینده',
      '-1': 'ماه گذشته',
    },
    relativeTime: {
      future: {
        one: '? ماه بعد',
        other: '? ماه بعد',
      },
      past: {
        one: '? ماه پیش',
        other: '? ماه پیش',
      },
    },
  },
  day: {
    displayName: 'روز',
    relative: {
      '0': 'امروز',
      '1': 'فردا',
      '2': 'پس‌فردا',
      '-2': 'پریروز',
      '-1': 'دیروز',
    },
    relativeTime: {
      future: {
        one: '? روز بعد',
        other: '? روز بعد',
      },
      past: {
        one: '? روز پیش',
        other: '? روز پیش',
      },
    },
  },
  hour: {
    displayName: 'ساعت',
    relative: {
      0: 'همین ساعت',
    },
    relativeTime: {
      future: {
        one: '? ساعت بعد',
        other: '? ساعت بعد',
      },
      past: {
        one: '? ساعت پیش',
        other: '? ساعت پیش',
      },
    },
  },
  minute: {
    displayName: 'دقیقه',
    relative: {
      0: 'همین دقیقه',
    },
    relativeTime: {
      future: {
        one: '? دقیقه بعد',
        other: '? دقیقه بعد',
      },
      past: {
        one: '? دقیقه پیش',
        other: '? دقیقه پیش',
      },
    },
  },
  second: {
    displayName: 'ثانیه',
    relative: {
      0: 'اکنون',
    },
    relativeTime: {
      future: {
        one: '? ثانیه بعد',
        other: '? ثانیه بعد',
      },
      past: {
        one: '? ثانیه پیش',
        other: '? ثانیه پیش',
      },
    },
  },
};

export const zeroFill = (a: unknown, n = 2, s = '0') => {
  let o = String(a);
  while (o.length < n) o = s + o;
  return o;
};

export function formatTime(date: DateObject) {
  const dt = parseDate(date);
  if (!dt) return '';
  return [dt.getHours(), dt.getMinutes(), dt.getSeconds()]
    .map((a) => zeroFill(a, 2))
    .join(':');
}

export function formatPersianDateTime(date: DateObject) {
  return [formatPersianDate(date), formatTime(date)].join(' ساعت ');
}

export function formatPersianDate(date: DateObject) {
  const [jy, jm, jd] = getPersianDateTuple(date);
  return [zeroFill(jy, 4), zeroFill(jm, 2), zeroFill(jd, 2)].join('/');
}

export function formatBeautiful(date: DateObject) {
  return `${formatPersianDateRange(date)[0]} | ${formatTime(date)}`;
}

export function formatPersianDateRange(from?: DateObject, to?: DateObject) {
  if (!to && from) {
    const [jy0, jm0, jd0] = getPersianDateTuple(from);
    return [[jd0, monthNames[jm0 - 1], jy0].join(' ')];
  }
  if (from || to) {
    const [jy0, jm0, jd0] = getPersianDateTuple(from);
    const [jy1, jm1, jd1] = getPersianDateTuple(to);
    if (jy0 === jy1 && jm0 === jm1 && jd0 === jd1) {
      return [[jd0, monthNames[jm0 - 1], jy0].join(' ')];
    }
    return [
      [jd0, jm0 !== jm1 && monthNames[jm0 - 1], jy0 !== jy1 && jy0]
        .filter(Boolean)
        .join(' '),
      [jd1, monthNames[jm1 - 1], jy1].join(' '),
    ];
  }
  return [];
}

export function getGregorianDateTuple(date: DateObject): DateTuple {
  const dt = parseDate(date);
  if (!dt) return [0, 0, 0];
  return [dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate()];
}
export function getPersianDateTuple(date: DateObject): DateTuple {
  return d2j(g2d(getGregorianDateTuple(date)));
}

export function isDateEqual(a: DateTuple, b: DateTuple) {
  return g2d(a) === g2d(b);
}
export function isDateGreaterThan(a: DateTuple, b: DateTuple) {
  return g2d(a) > g2d(b);
}
export function isDateGreaterThanEqual(a: DateTuple, b: DateTuple) {
  return g2d(a) >= g2d(b);
}
export function isDateLessThan(a: DateTuple, b: DateTuple) {
  return g2d(a) < g2d(b);
}
export function isDateLessThanEqual(a: DateTuple, b: DateTuple) {
  return g2d(a) <= g2d(b);
}

export function monday(d: DateObject) {
  const dt = parseDate(d);
  if (!dt) return null;
  const day = dt.getDay() || 7;
  if (day !== 1) {
    dt.setHours(-24 * (day - 1));
  }
  return dt;
}

function jalCal(jy: number) {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
    2192, 2262, 2324, 2394, 2456, 3178,
  ];
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];
  let jm;
  let jump = 9;
  let leap;
  let leapG = 0;
  let march = 0;
  let n;
  let i;
  if (jy < jp || jy >= breaks[bl - 1]) {
    return null;
  }
  for (i = 1; i < bl; i += 1) {
    jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) {
      break;
    }
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  n = jy - jp;
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) {
    leapJ += 1;
  }
  leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  march = 20 + leapJ - leapG;
  if (jump - n < 6) {
    n = n - jump + div(jump + 4, 33) * 33;
  }
  leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) {
    leap = 4;
  }
  return {
    leap,
    gy,
    march,
  };
}

export function j2d(dt: DateTuple) {
  const r = jalCal(dt[0]);
  if (!r) return 0;
  return (
    g2d([r.gy, 3, r.march]) +
    (dt[1] - 1) * 31 -
    div(dt[1], 7) * (dt[1] - 7) +
    dt[2] -
    1
  );
}

export function d2j(jdn: number): DateTuple {
  const gy = d2g(jdn)[0];
  let jy = gy - 621;
  const r = jalCal(jy);
  if (!r) return [0, 0, 0];
  const jdn1f = g2d([gy, 3, r.march]);
  let jd;
  let jm;
  let k;
  k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) {
      jm = 1 + div(k, 31);
      jd = mod(k, 31) + 1;
      return [jy, jm, jd];
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) {
      k += 1;
    }
  }
  jm = 7 + div(k, 30);
  jd = mod(k, 30) + 1;
  return [jy, jm, jd];
}

export function g2d(dt: DateTuple) {
  let d =
    div((dt[0] + div(dt[1] - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(dt[1] + 9, 12) + 2, 5) +
    dt[2] -
    34840408;
  d = d - div(div(dt[0] + 100100 + div(dt[1] - 8, 6), 100) * 3, 4) + 752;
  return d;
}

export function d2g(jdn: number) {
  let j;
  j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return [gy, gm, gd];
}

function div(a: number, b: number) {
  return ~~(a / b);
}

function mod(a: number, b: number) {
  return a - ~~(a / b) * b;
}

export function isValidPersianDate(jy: number, jm: number, jd: number) {
  return (
    jy >= -61 &&
    jy <= 3177 &&
    jm >= 1 &&
    jm <= 12 &&
    jd >= 1 &&
    jd <= persianMonthLength(jy, jm)
  );
}

function leapYear(jy: number) {
  const jd = jalCal(jy);
  if (!jd) return false;
  return jd.leap === 0;
}

export function persianMonthLength(jy: number, jm: number) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  if (leapYear(jy)) return 30;
  return 29;
}

export function gregorianMonthLength(gy: number, gm: number) {
  return new Date(Date.UTC(gy, gm, 0)).getDate();
}

export function persianDateToGregorian(
  dt: DateTuple,
  tm: DateTuple = [0, 0, 0],
) {
  const a = d2g(j2d(dt));
  return new Date(Date.UTC(a[0], a[1] - 1, a[2], tm[0], tm[1], tm[2], 0));
}

function dec(data: number): [number[], number] {
  const dms = [60, 60, 24, 30, 12, 365];
  let d = data;
  if (d < 1000) {
    d = 1000;
  }
  const pt = [];
  let acc = div(d, 1000);
  for (let i = 0; i < dms.length; i = i + 1) {
    pt[i] = mod(acc, dms[i]);
    acc = div(acc, dms[i]);
  }
  let k;
  for (k = pt.length - 1; k >= 0; k = k - 1) {
    if (pt[k] !== 0) {
      break;
    }
  }
  return [pt, k];
}

function getPluralKey(n: number) {
  if (n > 1) return 'other';
  return 'one';
}

export function parseDate(value: DateObject) {
  if (isNullOrUndefined(value)) return null;
  try {
    if (typeof value === 'number' || typeof value === 'string')
      return new Date(value);
  } catch (e) {
    console.error(e);
    return null;
  }
  return value;
}
export function formatRelative(value: DateObject) {
  const dt = parseDate(value);
  if (!dt) return '';
  const date = dt.getTime();
  const now = Date.now();
  const d = date - now;
  const sign = Math.sign(d);
  const dx = dec(Math.abs(d));
  const idx = dx[1];
  const a = dx[0][idx];
  const dmn = ['second', 'minute', 'hour', 'day', 'month', 'year'];
  const key = dmn[dx[1]];
  const data = localeData[key];
  return data.relativeTime[sign > 0 ? 'future' : 'past'][
    getPluralKey(a)
  ].replace('?', String(a));
}
