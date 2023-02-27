import { numberify } from './numberify';


export function moneyfy(number: unknown) {
  if (number === '0' || number === 0) return '0';
  if (!number) return '';
  return String(number).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
export function demonyfy(value: unknown) {
  const str = String(value);
  const out = numberify(str.replace(/(-|\.|,|e.*$|^0+)/g, ''));
  if (out === '' && Number(value) === 0 && str.length > 0) return '0';
  return out;
}

export function round(num: number, d: number) {
  const a = Math.pow(10, d);
  return Math.round(num * a) / a;
}

export const rangedPrice = (min: number, max: number, range: number[]) => {
  const minRange: number = range[0];
  const maxRange: number = range[range.length - 1];
  if (minRange === min && max === maxRange) {
    return 'مهم نیست';
  } else if (min !== minRange && max === maxRange) {
    const minTitleRange = determine(min);
    return `از ${minTitleRange.value} ${minTitleRange.mark}`;
  } else if (min === minRange && max !== maxRange) {
    const maxTitleRange = determine(max);
    return `تا ${maxTitleRange.value} ${maxTitleRange.mark}`;
  } else if (max !== maxRange) {
    const minTitleRange = determine(min);
    const maxTitleRange = determine(max);

    if (minTitleRange.mark === maxTitleRange.mark) {
      minTitleRange.mark = '';
    }

    if (minTitleRange.value === maxTitleRange.value) {
      return `${maxTitleRange.value} ${maxTitleRange.mark}`;
    }

    return `از ${minTitleRange.value} ${minTitleRange.mark} تا ${maxTitleRange.value} ${maxTitleRange.mark}`;
  }
};

export const titleRange = (value: number): string => {
  const obj = determine(value);
  return `${obj.value} ${obj.mark}`;
};

export const determine = (value: number, fx = 2, simple = false) => {
  if (!value) {
    value = 0;
  }
  let ranges = [
    'ریال',
    'هزار ریال',
    'میلیون ریال',
    'میلیارد ریال',
    'تریلیون ریال',
  ];

  if (simple) ranges = ranges.map((a) => a.substr(0, a.length - 6));
  let a = value;
  let i = 0;
  if (a > 9999) {
    while (a >= 1000) {
      a /= 1000;
      i++;
    }
  }
  return {
    value: (a > 0 ? '' : a < 0 ? '-' : '') + moneyfy(round(a, fx)),
    mark: ranges[i],
  };
};
