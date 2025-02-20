import {
  DependencyList,
  EffectCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { nanoid } from "nanoid";

export const createId = () => {
  return nanoid().slice(0, 5);
};

export function useDebouncedEffect(
  effect: () => void,
  delay: number,
  deps: DependencyList
) {
  return useEffectAfterInitial(() => {
    const handler = setTimeout(effect, delay);
    return () => clearTimeout(handler);
  }, deps);
}

export function useEffectAfterInitial(
  effect: EffectCallback,
  deps: DependencyList
) {
  const firstRender = useRef(true);
  return useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      return effect();
    }
  }, deps);
}

export function useHasTimeElapsed(time: number) {
  const [isElapsed, setIsElapsed] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsElapsed(true), time);
    return () => clearTimeout(timeout);
  }, []);

  return isElapsed;
}
