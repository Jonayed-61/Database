import { configureStore } from '@reduxjs/toolkit';

// Import your slices here
// import exampleReducer from './slices/exampleSlice';

export const store = configureStore({
  reducer: {
    // Add your reducers here
    // example: exampleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
