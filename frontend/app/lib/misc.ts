import { DependencyList, EffectCallback, useEffect, useRef } from "react";

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
