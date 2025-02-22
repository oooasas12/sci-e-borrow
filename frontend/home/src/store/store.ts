import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import masterDataReducer from './features/masterDataSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    masterData: masterDataReducer,
    // reducers อื่นๆ (ถ้ามี)
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 