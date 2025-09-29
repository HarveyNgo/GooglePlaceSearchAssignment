import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlaceResult } from '../types/google';

const HISTORY_KEY = 'PLACE_SEARCH_HISTORY';

export const saveHistory = async (history: PlaceResult[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('saveHistory error', e);
  }
};

export const loadHistory = async (): Promise<PlaceResult[]> => {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('loadHistory error', e);
    return [];
  }
};
