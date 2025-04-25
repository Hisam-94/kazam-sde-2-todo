import { configureAppStore, RootState, AppDispatch } from "./storeConfig";

// Create the store instance
export const store = configureAppStore();

// Re-export types
export type { RootState, AppDispatch };
