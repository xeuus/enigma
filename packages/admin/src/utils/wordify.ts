export const wordify = (nmb: number, lvl: number): string => {
  let num = nmb;
  let level = lvl;
  if (num === null || typeof num === 'undefined' || isNaN(num)) {
    return '';
  }
  if (num < 0) {
    num = num * -1;
    const a = wordify(num, level);
    return a ? `منفی ${a}` : '';
  }
  if (num === 0) {
    if (level === 0) {
      return 'صفر';
    }
    return '';
  }
  let result = '';
  const yekan = [
    ' یک ',
    ' دو ',
    ' سه ',
    ' چهار ',
    ' پنج ',
    ' شش ',
    ' هفت ',
    ' هشت ',
    ' نه ',
  ];
  const dahgan = [
    ' بیست ',
    ' سی ',
    ' چهل ',
    ' پنجاه ',
    ' شصت ',
    ' هفتاد ',
    ' هشتاد ',
    ' نود ',
  ];
  const sadgan = [
    ' یکصد ',
    ' دویست ',
    ' سیصد ',
    ' چهارصد ',
    ' پانصد ',
    ' ششصد ',
    ' هفتصد ',
    ' هشتصد ',
    ' نهصد ',
  ];
  const dah = [
    ' ده ',
    ' یازده ',
    ' دوازده ',
    ' سیزده ',
    ' چهارده ',
    ' پانزده ',
    ' شانزده ',
    ' هفده ',
    ' هیجده ',
    ' نوزده ',
  ];
  if (level > 0) {
    result += ' و ';
    level -= 1;
  }
  if (num < 10) {
    result += yekan[num - 1];
  } else if (num < 20) {
    result += dah[num - 10];
  } else if (num < 100) {
    result += dahgan[~~(num / 10) - 2] + wordify(num % 10, level + 1);
  } else if (num < 1000) {
    result += sadgan[~~(num / 100) - 1] + wordify(num % 100, level + 1);
  } else if (num < 1000000) {
    result += `${wordify(~~(num / 1000), level)} هزار ${wordify(
      ~~(num % 1000),
      level + 1,
    )}`;
  } else if (num < 1000000000) {
    result += `${wordify(~~(num / 1000000), level)} میلیون ${wordify(
      ~~(num % 1000000),
      level + 1,
    )}`;
  } else if (num < 1000000000000) {
    result += `${wordify(~~(num / 1000000000), level)} میلیارد ${wordify(
      ~~(num % 1000000000),
      level + 1,
    )}`;
  } else if (num < 1000000000000000) {
    result += `${wordify(~~(num / 1000000000000), level)} تریلیون ${wordify(
      ~~(num % 1000000000000),
      level + 1,
    )}`;
  }
  if (
    result === null ||
    typeof result === 'undefined' ||
    result === 'undefined'
  ) {
    return '';
  }
  return result;
};
