import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, PersistConfig, PersistedState } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session'; // ใช้ sessionStorage
import authReducer from './features/authSlice';
import masterDataReducer from './features/masterDataSlice';

// ✅ กำหนด Type สำหรับ Redux Persist
type RootState = ReturnType<typeof rootReducer>;

// ✅ กำหนด Config สำหรับ Redux Persist
const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  version: 1,
  storage: storageSession,
  whitelist: ['auth'],
  migrate: async (state: PersistedState) => {
    if (state) {
      return state; // ✅ คงค่า state เดิมไว้
    }

    return {
      auth: {
        user: null,
        isAuthenticated: false, // ✅ แทนที่จะให้เป็น null, กำหนดค่าเริ่มต้น
      },
      _persist: { version: 1, rehydrated: true }, // ✅ ต้องมี _persist
    };
  },
};

// ✅ รวม reducers
const rootReducer = combineReducers({
  auth: authReducer,
  masterData: masterDataReducer,
});

// ✅ ใช้ persistReducer เพื่อเก็บ Redux State
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ สร้าง Redux Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// ✅ สร้าง persistor สำหรับ Redux Persist
export const persistor = persistStore(store);

// ✅ กำหนด Type สำหรับ Redux
export type AppDispatch = typeof store.dispatch;
export type RootStateType = ReturnType<typeof store.getState>;
