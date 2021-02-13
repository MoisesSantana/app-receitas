export const loadState = (key, initialValue) => {
  const serializedState = localStorage.getItem(key);
  if (serializedState === null) return initialValue;
  return JSON.parse(serializedState);
};

export const saveState = (nameKey, state) => {
  const serializedState = JSON.stringify(state);
  localStorage.setItem(nameKey, serializedState);
};
