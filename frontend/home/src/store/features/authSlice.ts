import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

// ✅ ป้องกัน state.auth จากการเป็น null
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      if (!state) {
        return initialState; // ✅ แก้ไขให้คืนค่าเริ่มต้นแทน null
      }
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      if (!state) {
        return initialState;
      }
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer; 