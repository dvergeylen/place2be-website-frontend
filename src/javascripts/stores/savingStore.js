import { writable, derived } from 'svelte/store';

export const savingStatus = writable('saved');

export const lastSaveDate = derived(
  savingStatus,
  () => new Date(),
);
