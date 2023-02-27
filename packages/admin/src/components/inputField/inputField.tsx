import classNames from 'classnames';
import React, {
  FC,
  useCallback, useEffect,
  useMemo,
  useRef
} from 'react';

export const helpers = {
  getValue({
    name,
    value: baseValue,
    type,
    options,
  }: Pick<InputFieldProps, 'value' | 'type' | 'options' | 'name'>) {
    const haveName = name !== undefined && typeof name === 'string';
    const isObject =
      typeof baseValue === 'object' && String(baseValue) === '[object Object]';
    if (isNullOrUndefined(baseValue)) return '';
    if (isObject && !haveName) return '';
    const value =
      isObject && baseValue !== null && haveName ? baseValue[name] : baseValue;
    if (isNullOrUndefined(value)) return '';

    if (type === 'checkbox') {
      return Boolean(value);
    } else if (type === 'select') {
      const found = options?.find((a) => a.id === value);
      if (!found) return undefined;
      return String(value);
    }

    let final = String(value);
    switch (type) {
      case 'currency':
        final = moneyfy(final);
        break;
    }
    return final;
  },
};

export type Option = {
  id: string;
  name: string;
};

export type InputFieldProps = {
  placeholder?: string;
  label?: React.ReactNode;
  postfix?: React.ReactNode;
  value?: string | number | Record<string, unknown> | null | undefined;
  setValue?: React.Dispatch<React.SetStateAction<any>>;
  className?: string;
  inputClassName?: string;
  type?:
    | 'text'
    | 'password'
    | 'currency'
    | 'number'
    | 'checkbox'
    | 'radio'
    | 'select';
  name?: string;
  filters?: (a: string) => string;
  autoSelect?: boolean;
  radioValue?: string;
  options?: Array<Option>;
  undefinedLabel?: string;
  disabled?: boolean;
};

export const InputField: FC<InputFieldProps> = ({
  className,
  inputClassName,
  type = 'text',
  label,
  name,
  value: baseValue,
  setValue,
  postfix,
  placeholder,
  filters,
  autoSelect = true,
  radioValue,
  options,
  undefinedLabel,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const selection = useRef<{
    start?: number | null;
    end?: number | null;
    length?: number | null;
  }>({
    start: 0,
    end: 0,
  });

  const value = useMemo<any>(
    () => helpers.getValue({ name, value: baseValue, type, options }),
    [baseValue, name, type],
  );

  const updateValue = useCallback(
    (value?: string | undefined) => {
      const isObject =
        typeof baseValue === 'object' &&
        String(baseValue) === '[object Object]';
      const haveName = name !== undefined && typeof name === 'string';
      if (setValue) {
        const val = value;
        if (haveName && isObject)
          setValue((form: Record<string, string>) => ({
            ...form,
            [name]: val,
          }));
        else setValue(val);
      }
    },
    [setValue, name, baseValue],
  );

  const handleInputChange = useCallback(
    (e: any) => {
      if (type === 'checkbox') {
        return updateValue(e.target.checked);
      } else if (type === 'radio') {
        return updateValue(e.target.value);
      } else if (type === 'select') {
        if (e.target.value === '') return updateValue(undefined);
        return updateValue(e.target.value);
      }
      let final = sanitize(e.target.value);
      if (filters) final = filters(e.target.value);
      switch (type) {
        case 'currency':
          final = demonyfy(final.replace(/(-|\.|,|(e.*$))/g, ''));
          break;
        case 'number':
          final = numberify(final);
          break;
      }
      if (selection.current) {
        selection.current.start = inputRef.current?.selectionStart;
        selection.current.end = inputRef.current?.selectionEnd;
        selection.current.length = inputRef.current?.value.length;
      }
      return updateValue(final);
    },
    [updateValue, type],
  );

  const { pattern, inputMode } = useMemo<{
    pattern: React.InputHTMLAttributes<HTMLInputElement>['pattern'];
    inputMode: React.HtmlHTMLAttributes<HTMLInputElement>['inputMode'];
  }>(() => {
    const isNumeric = type === 'currency' || type === 'number';
    const platform =
      typeof navigator !== 'undefined' ? navigator?.userAgent : '';
    const isIos = /iPad|iPhone|iPod/i.test(platform);
    let inputMode = undefined;
    if (isNumeric) {
      if (isIos) inputMode = 'number';
      else inputMode = 'numeric';
    }
    return {
      pattern: isNumeric ? 'd*' : undefined,
      inputMode:
        inputMode as React.HtmlHTMLAttributes<HTMLInputElement>['inputMode'],
    };
  }, [type]);

  const inputType = useMemo(() => {
    if (type === 'password') return 'password';
    return 'text';
  }, [type]);

  useEffect(() => {
    if (!inputRef.current) return;

    const { selectionStart, selectionEnd, value } = inputRef.current;
    const { start, end, length } = selection.current;
    const textLength = value?.length;

    if (
      isNullOrUndefined(start) ||
      isNullOrUndefined(end) ||
      isNullOrUndefined(length)
    )
      return;

    if (
      isNullOrUndefined(selectionStart) ||
      isNullOrUndefined(selectionEnd) ||
      isNullOrUndefined(textLength)
    )
      return;

    if (start === selectionStart || end === selectionEnd) return;
    const diff = textLength - length;
    inputRef.current.selectionStart = clamp(start + diff, 0, textLength);
    inputRef.current.selectionEnd = clamp(end + diff, 0, textLength);
  });

  if (type === 'checkbox') {
    return (
      <label className={classNames('flex items-center', className)}>
        <input
          name={name}
          type='checkbox'
          checked={value}
          onChange={handleInputChange}
          className={inputClassName}
          disabled={disabled}
        />
        {label && (
          <span className='ml-2 select-none text-slate-500'>{label}</span>
        )}
      </label>
    );
  } else if (type === 'radio') {
    return (
      <label className={classNames('flex items-center', className)}>
        <input
          name={name}
          type='radio'
          value={radioValue}
          checked={radioValue === value}
          onChange={handleInputChange}
          className={inputClassName}
          disabled={disabled}
        />
        {label && (
          <span className='ml-2 select-none text-slate-500'>{label}</span>
        )}
      </label>
    );
  } else if (type === 'select') {
    return (
      <div className={classNames('flex flex-col gap-1', className)}>
        {label && <span className='select-none text-slate-500'>{label}</span>}
        <div className='relative flex flex-col justify-center'>
          <select
            name={name}
            value={value}
            onChange={handleInputChange}
            className={classNames(inputClassName, 'h-10 px-3')}
            disabled={disabled}
          >
            <option value='' className='text-slate-400'>
              {undefinedLabel || ''}
            </option>
            {options?.map((option) => (
              <option
                key={option.id}
                value={option.id}
                className='text-slate-700'
              >
                {option.name}
              </option>
            ))}
          </select>
          {!value && (
            <div className='absolute flex items-center justify-center bg-white pointer-events-none top-1 bottom-1 left-3 text-slate-500'>
              {placeholder}
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className={classNames('flex flex-col gap-1', className)}>
      {label && <div className='select-none text-slate-500'>{label}</div>}
      <div className='relative flex flex-col'>
        <input
          name={name}
          ref={inputRef}
          type={inputType}
          className={classNames(inputClassName, 'h-10 px-3')}
          onFocus={autoSelect ? (e) => e.target.select() : undefined}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          pattern={pattern}
          inputMode={inputMode}
          disabled={disabled}
        />
        {postfix && (
          <div className='absolute top-0 flex items-center justify-center h-full right-2 '>
            {postfix}
          </div>
        )}
      </div>
    </div>
  );
};

function isNullOrUndefined(a: unknown): a is null | undefined {
  return typeof a === 'undefined' || a === null;
}

function moneyfy(number: unknown) {
  if (number === '0' || number === 0) return '0';
  if (!number) return '';
  return String(number).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function demonyfy(value: unknown) {
  const str = String(value);
  const out = numberify(str.replace(/(-|\.|,|e.*$|^0+)/g, ''));
  if (out === '' && Number(value) === 0 && str.length > 0) return '0';
  return out;
}

const numbers = new Set([
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '-',
  '.',
]);

function numberify(str: unknown) {
  let out = '';
  for (const chr of String(str)) {
    if (numbers.has(chr)) {
      out += chr;
    }
  }
  return out;
}

function clamp(x: number, min: number, max: number) {
  if (x < min) return min;
  if (x > max) return max;
  return x;
}

const replacements = new Map([
  ['ك', 'ک'],
  ['دِ', 'د'],
  ['بِ', 'ب'],
  ['زِ', 'ز'],
  ['ذِ', 'ذ'],
  ['شِ', 'ش'],
  ['سِ', 'س'],
  ['ى', 'ی'],
  ['ي', 'ی'],
  ['٠', '0'],
  ['١', '1'],
  ['٢', '2'],
  ['٣', '3'],
  ['٤', '4'],
  ['٥', '5'],
  ['٦', '6'],
  ['٧', '7'],
  ['٨', '8'],
  ['٩', '9'],
  ['۰', '0'],
  ['۱', '1'],
  ['۲', '2'],
  ['۳', '3'],
  ['۴', '4'],
  ['۵', '5'],
  ['۶', '6'],
  ['۷', '7'],
  ['۸', '8'],
  ['۹', '9'],
  ['١', '1'],
  ['٢', '2'],
  ['٣', '3'],
  ['٤', '4'],
  ['٥', '5'],
  ['٦', '6'],
  ['٧', '7'],
  ['٨', '8'],
  ['٩', '9'],
  ['٠', '0'],
]);

function sanitize(str: unknown) {
  let out = '';
  for (const chr of String(str)) {
    if (replacements.has(chr)) {
      out += replacements.get(chr);
    } else {
      out += chr;
    }
  }
  return out;
}

function emailify(email: unknown) {}
