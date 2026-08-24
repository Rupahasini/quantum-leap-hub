import { useCallback, useSyncExternalStore } from "react";

export type ProgressState = {
  stars: number;
  spent: number;
  completedChapters: string[];
  quizzesPassed: string[];
  katasDone: string[];
  projectsSubmitted: string[];
  unlockedPerks: string[];
};

const STORAGE_KEY = "qla-progress-v1";

const EMPTY: ProgressState = {
  stars: 0,
  spent: 0,
  completedChapters: [],
  quizzesPassed: [],
  katasDone: [],
  projectsSubmitted: [],
  unlockedPerks: [],
};

let state: ProgressState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...EMPTY, ...(JSON.parse(raw) as ProgressState) };
  } catch {
    /* ignore */
  }
  emit();
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function set(next: ProgressState) {
  state = next;
  persist();
  emit();
}

const addOnce = (list: string[], id: string) => (list.includes(id) ? list : [...list, id]);

export const progressActions = {
  awardQuiz(id: string, stars: number) {
    if (state.quizzesPassed.includes(id)) return false;
    set({ ...state, quizzesPassed: addOnce(state.quizzesPassed, id), stars: state.stars + stars });
    return true;
  },
  awardKata(id: string, stars: number) {
    if (state.katasDone.includes(id)) return false;
    set({ ...state, katasDone: addOnce(state.katasDone, id), stars: state.stars + stars });
    return true;
  },
  submitProject(id: string, stars: number) {
    if (state.projectsSubmitted.includes(id)) return false;
    set({
      ...state,
      projectsSubmitted: addOnce(state.projectsSubmitted, id),
      stars: state.stars + stars,
    });
    return true;
  },
  toggleChapter(id: string) {
    const done = state.completedChapters.includes(id);
    set({
      ...state,
      completedChapters: done
        ? state.completedChapters.filter((x) => x !== id)
        : [...state.completedChapters, id],
    });
    return !done;
  },
  unlockPerk(id: string, cost: number) {
    if (state.unlockedPerks.includes(id)) return "already" as const;
    if (state.stars - state.spent < cost) return "insufficient" as const;
    set({ ...state, unlockedPerks: [...state.unlockedPerks, id], spent: state.spent + cost });
    return "unlocked" as const;
  },
  reset() {
    set(EMPTY);
  },
};

export function useProgress() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => state,
    () => EMPTY,
  );
  const available = snapshot.stars - snapshot.spent;
  const has = useCallback(
    (list: keyof ProgressState, id: string) => {
      const value = snapshot[list];
      return Array.isArray(value) && value.includes(id);
    },
    [snapshot],
  );
  return { ...snapshot, available, has, actions: progressActions };
}
