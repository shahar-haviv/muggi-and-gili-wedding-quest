import { useCallback, useEffect, useState } from 'preact/hooks';
import type { AppRoutePath, SideQuestSlug } from '../types/wedding.ts';

/**
 * Normalizes any URL pathname into one of the canonical app routes:
 * - '/'
 * - '/side-quest/bachelor'
 * - '/side-quest/bachelorette'
 * - '/side-quest/united'
 *
 * Side quests are unlisted and only resolve when their direct URL is visited.
 */
export function resolveAppRoute(rawPathname: string): AppRoutePath {
  const cleaned = rawPathname.replace(/\/+$/, '').toLowerCase();

  if (cleaned.endsWith('/side-quest/bachelor')) {
    return '/side-quest/bachelor';
  }
  if (cleaned.endsWith('/side-quest/bachelorette')) {
    return '/side-quest/bachelorette';
  }
  if (cleaned.endsWith('/side-quest/united')) {
    return '/side-quest/united';
  }

  return '/';
}

export function extractSideQuestSlug(route: AppRoutePath): SideQuestSlug | null {
  if (route === '/side-quest/bachelor') return 'bachelor';
  if (route === '/side-quest/bachelorette') return 'bachelorette';
  if (route === '/side-quest/united') return 'united';
  return null;
}

export interface RouterState {
  readonly route: AppRoutePath;
  readonly sideQuestSlug: SideQuestSlug | null;
  readonly navigate: (target: AppRoutePath, options?: { readonly hash?: string }) => void;
}

/**
 * Single-responsibility client-side router hook using History API (`pushState` / `popstate`).
 */
export function useRoute(onRouteChange?: (nextRoute: AppRoutePath) => void): RouterState {
  const [route, setRoute] = useState<AppRoutePath>(() =>
    resolveAppRoute(window.location.pathname),
  );

  useEffect(() => {
    const handlePopState = () => {
      const resolved = resolveAppRoute(window.location.pathname);
      setRoute(resolved);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback(
    (target: AppRoutePath, options?: { readonly hash?: string }) => {
      const nextUrl = options?.hash ? `${target}${options.hash}` : target;
      const currentResolved = resolveAppRoute(window.location.pathname);

      if (target !== currentResolved || window.location.pathname !== target) {
        window.history.pushState({}, '', nextUrl);
        setRoute(target);
        onRouteChange?.(target);
      } else if (options?.hash) {
        window.history.replaceState({}, '', nextUrl);
      }

      if (options?.hash) {
        window.requestAnimationFrame(() => {
          const anchorTarget = document.querySelector(options.hash!);
          anchorTarget?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    },
    [onRouteChange],
  );

  return {
    route,
    sideQuestSlug: extractSideQuestSlug(route),
    navigate,
  };
}
