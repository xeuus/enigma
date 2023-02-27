import throttle from 'lodash/throttle';
import { useCallback, useEffect, useRef, useState } from 'react';

function clamp(a: number, min: number, max: number) {
  if (a > max) return max;
  else if (a < min) return min;
  else return a;
}
export const useScroll = () => {
  const p1 = 10;
  const p2 = 6;
  const [direction, setDirection] = useState(-1);
  const [position, setPosition] = useState(0);

  const state = useRef({
    lastScroll: 0,
    lazyDiff: 0,
  }).current;

  const onScroll = useCallback(
    throttle(() => {
      const limit =
        Math.max(
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight,
        ) - window.innerHeight;
      const scroll = window.scrollY;
      const dy = window.scrollY - state.lastScroll;
      state.lazyDiff += dy;
      const absMax = (p1 / 100) * window.innerHeight;
      const absMax2 = (p2 / 100) * window.innerHeight;
      state.lazyDiff = clamp(state.lazyDiff, -absMax, absMax);
      state.lastScroll = scroll;
      if (state.lazyDiff > absMax2) setDirection(1);
      else if (state.lazyDiff < -absMax2) setDirection(-1);

      if (scroll < 20) {
        setPosition(-1);
        state.lazyDiff = absMax2;
      } else if (scroll > limit - 20) {
        setPosition(1);
        state.lazyDiff = -absMax2;
      } else setPosition(0);
    }, 50),
    [],
  );
  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  return {
    direction,
    position,
  };
};
