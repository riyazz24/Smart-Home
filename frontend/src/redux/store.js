import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice';

// redux-persist ('persist:root' in localStorage) has been removed - fullName
// now lives directly under the plain 'name' key in localStorage (see
// slice.js initialState and Navbar.js), so there's nothing left here that
// needs cross-reload persistence via redux-persist.
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
