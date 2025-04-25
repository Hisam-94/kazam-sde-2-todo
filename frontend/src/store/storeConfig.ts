import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import todoReducer from "./slices/todoSlice";

// Create a function to configure the store instead of exporting the store directly
export function configureAppStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      todo: todoReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Allows non-serializable values in state
      }),
  });
}

// Define types for TypeScript
export type AppStore = ReturnType<typeof configureAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
