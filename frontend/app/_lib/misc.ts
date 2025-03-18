import {
  DependencyList,
  EffectCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";

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

export const useWarnIfUnsavedChanges = (unsaved: boolean) => {
  const router = useRouter();

  const handleAnchorClick = (e: MouseEvent) => {
    if (e.button !== 0) return; // only handle left-clicks
    const targetUrl = (e.currentTarget as HTMLAnchorElement).href;
    const currentUrl = window.location.href;
    if (targetUrl !== currentUrl && window.onbeforeunload) {
      // @ts-ignore
      const res = window.onbeforeunload();
      if (!res) e.preventDefault();
    }
  };

  const addAnchorListeners = () => {
    const anchorElements = document.querySelectorAll(
      "a[href]"
    ) as NodeListOf<HTMLAnchorElement>;
    anchorElements.forEach((anchor) =>
      anchor.addEventListener("click", handleAnchorClick)
    );
  };

  useEffect(() => {
    const mutationObserver = new MutationObserver(addAnchorListeners);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    addAnchorListeners();

    return () => {
      mutationObserver.disconnect();
      const anchorElements = document.querySelectorAll(
        "a[href]"
      ) as NodeListOf<HTMLAnchorElement>;
      anchorElements.forEach((anchor) =>
        anchor.removeEventListener("click", handleAnchorClick)
      );
    };
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // required for Chrome
    };

    const handlePopState = (e: PopStateEvent) => {
      if (unsaved) {
        if (
          !window.confirm(
            "You have unsaved changes. Are you sure you want to leave?"
          )
        ) {
          e.preventDefault();
          window.history.pushState(null, "", window.location.href);
        } else {
          router.back();
        }
      }
    };

    if (unsaved) {
      window.addEventListener("beforeunload", beforeUnloadHandler);
      window.addEventListener("popstate", handlePopState);
    } else {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      window.removeEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [unsaved]);

  useEffect(() => {
    const originalPush = router.push;

    router.push = (url: string, options?: NavigateOptions) => {
      if (unsaved) {
        const confirmLeave = window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        );
        if (confirmLeave) originalPush(url, options);
      } else {
        originalPush(url, options);
      }
    };

    return () => {
      router.push = originalPush;
    };
  });
};
