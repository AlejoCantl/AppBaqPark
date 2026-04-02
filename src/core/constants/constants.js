import Constants from 'expo-constants';

const PARKS_KEY = Constants.expoConfig?.extra?.PARKS_KEY || process.env.PARKS_KEY;

// ─── Drawer heights (SearchMaps) ────────────────────────────────────────────
export const DRAWER_MIN_HEIGHT = 190;
export const DRAWER_MAX_HEIGHT = 650;

// ─── Floating TabBar dimensions — fuente de verdad para toda la app ──────────
export const TAB_BAR_HEIGHT = 58;
export const TAB_BAR_BOTTOM_ANDROID = 14;
export const TAB_BAR_BOTTOM_IOS = 24;

export const GOOGLE_MAPS_APIKEY = PARKS_KEY;
