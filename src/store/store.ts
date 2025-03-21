
import { configureStore } from '@reduxjs/toolkit';
import imagesReducer from './imagesSlice';

export const store = configureStore({
  reducer: {
    images: imagesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
