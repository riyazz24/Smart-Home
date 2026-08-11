import { createSlice } from '@reduxjs/toolkit';

// fullName is no longer persisted via redux-persist ('persist:root') or a raw
// 'user' key - it's read straight out of the plain 'name' key in localStorage,
// which is the single source of truth and is kept in sync by whoever calls
// setUserData with a fullName (see Navbar.js).
const initialState = {
  userId: '',
  fullName: localStorage.getItem('name') || '',
  agentName: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      const userData = action.payload;
      return { ...state, ...userData };
    },
    clearUserData: () => {
      // Return a fresh object rather than the captured `initialState` above,
      // since that reference was computed once at module load from
      // localStorage and could still hold a stale name if this reducer ran
      // without a page reload in between.
      return { userId: '', fullName: '', agentName: '' };
    }
  }
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;