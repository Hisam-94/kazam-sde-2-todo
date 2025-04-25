// Utility for accessing the store without creating circular dependencies
import { createAction } from "@reduxjs/toolkit";

// Define action types
export const AUTH_CLEAR_CREDENTIALS = "auth/clearCredentials";

// Create standalone actions
export const clearCredentialsAction = createAction(AUTH_CLEAR_CREDENTIALS);

// Lazy loading utility to get the store without direct imports
// This avoids circular dependencies when api.ts needs to dispatch actions
let storeRef: any;

export function setStoreRef(store: any) {
  storeRef = store;
}

export function getStoreRef() {
  return storeRef;
}

// Helper to dispatch actions without directly importing the store
export function dispatchAction(action: any) {
  if (storeRef) {
    storeRef.dispatch(action);
  } else {
    console.error("Store not initialized yet");
  }
}
