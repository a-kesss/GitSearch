import { configureStore } from '@reduxjs/toolkit';
import repoReducer from './features/reposSlice';

export const store = configureStore({
  reducer: {
    repos: repoReducer,
  },
});
