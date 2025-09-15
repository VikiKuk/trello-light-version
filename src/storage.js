const LS_KEY = 'trello_state';

export const DEFAULT_STATE = {
  todo: [],
  inprogress: [],
  done: []
};

export function loadState() {
  try {
    const data = localStorage.getItem(LS_KEY);
    const parsed = data ? JSON.parse(data) : structuredClone(DEFAULT_STATE);
  return parsed;
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

export function saveState(state) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}