import debounce from 'lodash/debounce';
import {
  Dispatch,
  SetStateAction, useCallback,
  useEffect,
  useMemo,
  useRef, useState
} from 'react';
import { useLocation, useNavigate } from 'react-router';

function cleanQuery(search: string) {
  return search.replace(/(^[?&]+|[?&]+$)/g, '');
}
export type QueryParamType = string | number | boolean | undefined;

export function searchVariableInQuery<T extends QueryParamType>(
  name: string,
  search: string,
) {
  const re = new RegExp(`(?:${name}=)(.+?)(?:&|$)`, 'g');
  let result: RegExpExecArray | null = null;
  const values: T[] = [];
  while ((result = re.exec(search))) {
    values.push(decodeURIComponent(result[1]) as unknown as T);
  }
  return values;
}
export function clearVariableInQuery(name: string, search: string) {
  return cleanQuery(
    search.trim().replace(new RegExp(`(${name}=)(.+?)(&|$)`, 'g'), ''),
  );
}
export function isVariableDiffersWithQuery<T extends QueryParamType>(
  name: string,
  values: T[],
  search: string,
): boolean {
  const found = searchVariableInQuery(name, search);
  if (found.length !== values.length) return true;
  if (found.some((v, i) => v !== values[i])) return true;
  return false;
}
export function replaceVariableInQuery<T extends QueryParamType>(
  name: string,
  values: T[],
  search: string,
) {
  let i = 0;
  let end = search
    .trim()
    .replace(new RegExp(`(${name}=)(.+?)?(&|$)`, 'g'), (m) => {
      if (i < values.length) {
        const val = values[i++];
        return m.replace(
          /(=)(.+)?(&|$)/g,
          `=${val ? encodeURIComponent(val) : ''}&`,
        );
      }
      return '';
    });
  if (i < values.length) {
    for (let j = i; j < values.length; j++) {
      const val = values[i++];
      end += `&${name}=${val ? encodeURIComponent(val) : ''}&`;
    }
  }
  return cleanQuery(end);
}

export type UseQueryParam<T> = [T[], (value: T[]) => void];

export function useQueryParam<T extends QueryParamType>(
  name: string,
  def?: T,
): UseQueryParam<T> {
  const location = useLocation();
  const navigate = useNavigate();
  const setValue = useCallback(
    (value: T[]) => {
      if (!isVariableDiffersWithQuery(name, value, location.search)) return;
      navigate({
        search: `?${replaceVariableInQuery(name, value, location.search)}`,
      });
    },
    [navigate, location.search, name],
  );
  const value = useMemo(() => {
    const arr = searchVariableInQuery<T>(name, location.search);
    return arr.length > 0 ? arr : def ? [def] : [];
  }, [location.search, name, def]);
  return [value, setValue];
}

export function useQueryParamDebounced<T extends QueryParamType>(
  name: string,
  def?: T,
  ms = 300,
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, T] {
  const [value, setValue] = useQueryParam<T>('query', def);

  const [rawValue, setRawValue] = useState(value[0] || def);

  const debouncedSetValue = useRef(debounce(setValue, ms)).current;

  useEffect(() => {
    debouncedSetValue(rawValue ? [rawValue] : []);
  }, [debouncedSetValue, rawValue]);

  return [rawValue, setRawValue, value[0]];
}
